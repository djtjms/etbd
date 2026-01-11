<?php
/**
 * JWT Authentication Handler
 * Handles token generation, validation, and user authentication
 */

namespace App\Includes;

use Exception;

class Auth {
    private Database $db;
    private ?array $user = null;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Generate JWT token
     */
    public function generateToken(array $payload, int $expiry = null): string {
        $expiry = $expiry ?? JWT_EXPIRY;
        
        $header = [
            'typ' => 'JWT',
            'alg' => JWT_ALGORITHM
        ];
        
        $payload['iat'] = time();
        $payload['exp'] = time() + $expiry;
        $payload['jti'] = bin2hex(random_bytes(16));
        
        $base64Header = $this->base64UrlEncode(json_encode($header));
        $base64Payload = $this->base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", JWT_SECRET, true);
        $base64Signature = $this->base64UrlEncode($signature);
        
        return "$base64Header.$base64Payload.$base64Signature";
    }
    
    /**
     * Validate JWT token
     */
    public function validateToken(string $token): ?array {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }
        
        list($base64Header, $base64Payload, $base64Signature) = $parts;
        
        // Verify signature
        $signature = $this->base64UrlDecode($base64Signature);
        $expectedSignature = hash_hmac('sha256', "$base64Header.$base64Payload", JWT_SECRET, true);
        
        if (!hash_equals($signature, $expectedSignature)) {
            return null;
        }
        
        // Decode payload
        $payload = json_decode($this->base64UrlDecode($base64Payload), true);
        
        if (!$payload) {
            return null;
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
    
    /**
     * Get token from request
     */
    public function getTokenFromRequest(): ?string {
        // Check Authorization header
        $headers = $this->getAuthorizationHeader();
        
        if ($headers && preg_match('/Bearer\s+(.*)$/i', $headers, $matches)) {
            return $matches[1];
        }
        
        // Check query parameter (for WebSocket or special cases)
        if (isset($_GET['token'])) {
            return $_GET['token'];
        }
        
        return null;
    }
    
    /**
     * Get Authorization header
     */
    private function getAuthorizationHeader(): ?string {
        if (isset($_SERVER['Authorization'])) {
            return $_SERVER['Authorization'];
        }
        
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return $_SERVER['HTTP_AUTHORIZATION'];
        }
        
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                return $headers['Authorization'];
            }
            if (isset($headers['authorization'])) {
                return $headers['authorization'];
            }
        }
        
        return null;
    }
    
    /**
     * Authenticate user from token
     */
    public function authenticate(): ?array {
        $token = $this->getTokenFromRequest();
        
        if (!$token) {
            return null;
        }
        
        $payload = $this->validateToken($token);
        
        if (!$payload || !isset($payload['sub'])) {
            return null;
        }
        
        // Get user from database
        $user = $this->db->fetch(
            "SELECT u.*, ur.role 
             FROM users u 
             LEFT JOIN user_roles ur ON u.id = ur.user_id 
             WHERE u.id = ? AND u.is_active = 1",
            [$payload['sub']]
        );
        
        if (!$user) {
            return null;
        }
        
        $this->user = $user;
        return $user;
    }
    
    /**
     * Get current authenticated user
     */
    public function user(): ?array {
        if ($this->user === null) {
            $this->authenticate();
        }
        return $this->user;
    }
    
    /**
     * Check if user is authenticated
     */
    public function check(): bool {
        return $this->user() !== null;
    }
    
    /**
     * Check if user has role
     */
    public function hasRole(string $role): bool {
        $user = $this->user();
        return $user && isset($user['role']) && $user['role'] === $role;
    }
    
    /**
     * Check if user is admin
     */
    public function isAdmin(): bool {
        return $this->hasRole('admin');
    }
    
    /**
     * Login user
     */
    public function login(string $email, string $password): ?array {
        $user = $this->db->fetch(
            "SELECT u.*, ur.role 
             FROM users u 
             LEFT JOIN user_roles ur ON u.id = ur.user_id 
             WHERE u.email = ? AND u.is_active = 1",
            [$email]
        );
        
        if (!$user || !password_verify($password, $user['password'])) {
            return null;
        }
        
        // Update last login
        $this->db->update('users', ['last_login' => date('Y-m-d H:i:s')], 'id = ?', [$user['id']]);
        
        // Generate tokens
        $accessToken = $this->generateToken([
            'sub' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);
        
        $refreshToken = $this->generateToken([
            'sub' => $user['id'],
            'type' => 'refresh'
        ], JWT_REFRESH_EXPIRY);
        
        // Store refresh token
        $this->db->insert('refresh_tokens', [
            'user_id' => $user['id'],
            'token' => hash('sha256', $refreshToken),
            'expires_at' => date('Y-m-d H:i:s', time() + JWT_REFRESH_EXPIRY)
        ]);
        
        unset($user['password']);
        
        return [
            'user' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_in' => JWT_EXPIRY
        ];
    }
    
    /**
     * Register new user
     */
    public function register(array $data): ?array {
        // Check if email exists
        $exists = $this->db->fetchColumn(
            "SELECT COUNT(*) FROM users WHERE email = ?",
            [$data['email']]
        );
        
        if ($exists > 0) {
            throw new Exception('Email already registered');
        }
        
        $userId = $this->generateUUID();
        
        // Insert user
        $this->db->query(
            "INSERT INTO users (id, email, password, full_name, created_at, updated_at) 
             VALUES (?, ?, ?, ?, NOW(), NOW())",
            [
                $userId,
                $data['email'],
                password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => PASSWORD_COST]),
                $data['full_name'] ?? null
            ]
        );
        
        // Assign default role
        $this->db->query(
            "INSERT INTO user_roles (user_id, role) VALUES (?, 'user')",
            [$userId]
        );
        
        // Create profile
        $this->db->query(
            "INSERT INTO profiles (id, user_id, email, full_name, created_at, updated_at) 
             VALUES (?, ?, ?, ?, NOW(), NOW())",
            [$this->generateUUID(), $userId, $data['email'], $data['full_name'] ?? null]
        );
        
        // Auto login
        return $this->login($data['email'], $data['password']);
    }
    
    /**
     * Refresh access token
     */
    public function refresh(string $refreshToken): ?array {
        $payload = $this->validateToken($refreshToken);
        
        if (!$payload || !isset($payload['type']) || $payload['type'] !== 'refresh') {
            return null;
        }
        
        // Verify token exists in database
        $tokenHash = hash('sha256', $refreshToken);
        $storedToken = $this->db->fetch(
            "SELECT * FROM refresh_tokens 
             WHERE token = ? AND expires_at > NOW() AND revoked = 0",
            [$tokenHash]
        );
        
        if (!$storedToken) {
            return null;
        }
        
        // Get user
        $user = $this->db->fetch(
            "SELECT u.*, ur.role 
             FROM users u 
             LEFT JOIN user_roles ur ON u.id = ur.user_id 
             WHERE u.id = ? AND u.is_active = 1",
            [$payload['sub']]
        );
        
        if (!$user) {
            return null;
        }
        
        // Revoke old refresh token
        $this->db->update('refresh_tokens', ['revoked' => 1], 'id = ?', [$storedToken['id']]);
        
        // Generate new tokens
        $newAccessToken = $this->generateToken([
            'sub' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);
        
        $newRefreshToken = $this->generateToken([
            'sub' => $user['id'],
            'type' => 'refresh'
        ], JWT_REFRESH_EXPIRY);
        
        // Store new refresh token
        $this->db->insert('refresh_tokens', [
            'user_id' => $user['id'],
            'token' => hash('sha256', $newRefreshToken),
            'expires_at' => date('Y-m-d H:i:s', time() + JWT_REFRESH_EXPIRY)
        ]);
        
        unset($user['password']);
        
        return [
            'user' => $user,
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'expires_in' => JWT_EXPIRY
        ];
    }
    
    /**
     * Logout user (revoke all tokens)
     */
    public function logout(): bool {
        $user = $this->user();
        
        if (!$user) {
            return false;
        }
        
        // Revoke all refresh tokens
        $this->db->update('refresh_tokens', ['revoked' => 1], 'user_id = ?', [$user['id']]);
        
        $this->user = null;
        
        return true;
    }
    
    /**
     * Generate UUID v4
     */
    private function generateUUID(): string {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
    
    /**
     * Base64 URL encode
     */
    private function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     */
    private function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}

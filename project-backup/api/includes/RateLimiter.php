<?php
/**
 * Rate Limiter
 * IP-based request rate limiting
 */

namespace App\Includes;

class RateLimiter {
    private Database $db;
    private string $clientIp;
    private int $maxRequests;
    private int $windowSeconds;
    
    /**
     * Create rate limiter instance
     */
    public function __construct(int $maxRequests = null, int $windowSeconds = null) {
        $this->db = Database::getInstance();
        $this->clientIp = $this->getClientIp();
        $this->maxRequests = $maxRequests ?? RATE_LIMIT_REQUESTS;
        $this->windowSeconds = $windowSeconds ?? RATE_LIMIT_WINDOW;
    }
    
    /**
     * Check if request is allowed
     */
    public function check(string $key = 'default'): bool {
        $identifier = $this->getIdentifier($key);
        
        // Clean old entries
        $this->cleanup($identifier);
        
        // Get current count
        $count = $this->getRequestCount($identifier);
        
        // Check limit
        if ($count >= $this->maxRequests) {
            return false;
        }
        
        // Record request
        $this->recordRequest($identifier);
        
        return true;
    }
    
    /**
     * Get remaining requests
     */
    public function remaining(string $key = 'default'): int {
        $identifier = $this->getIdentifier($key);
        $count = $this->getRequestCount($identifier);
        return max(0, $this->maxRequests - $count);
    }
    
    /**
     * Get reset time
     */
    public function resetTime(string $key = 'default'): int {
        $identifier = $this->getIdentifier($key);
        
        $oldest = $this->db->fetchColumn(
            "SELECT MIN(created_at) FROM rate_limits WHERE identifier = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND)",
            [$identifier, $this->windowSeconds]
        );
        
        if ($oldest) {
            return strtotime($oldest) + $this->windowSeconds;
        }
        
        return time() + $this->windowSeconds;
    }
    
    /**
     * Add rate limit headers to response
     */
    public function addHeaders(string $key = 'default'): void {
        header('X-RateLimit-Limit: ' . $this->maxRequests);
        header('X-RateLimit-Remaining: ' . $this->remaining($key));
        header('X-RateLimit-Reset: ' . $this->resetTime($key));
    }
    
    /**
     * Get request count for identifier
     */
    private function getRequestCount(string $identifier): int {
        return (int) $this->db->fetchColumn(
            "SELECT COUNT(*) FROM rate_limits WHERE identifier = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND)",
            [$identifier, $this->windowSeconds]
        );
    }
    
    /**
     * Record a request
     */
    private function recordRequest(string $identifier): void {
        $this->db->query(
            "INSERT INTO rate_limits (identifier, ip_address, created_at) VALUES (?, ?, NOW())",
            [$identifier, $this->clientIp]
        );
    }
    
    /**
     * Clean up old rate limit entries
     */
    private function cleanup(string $identifier): void {
        $this->db->query(
            "DELETE FROM rate_limits WHERE identifier = ? AND created_at < DATE_SUB(NOW(), INTERVAL ? SECOND)",
            [$identifier, $this->windowSeconds]
        );
    }
    
    /**
     * Get identifier for rate limiting
     */
    private function getIdentifier(string $key): string {
        return md5($this->clientIp . ':' . $key);
    }
    
    /**
     * Get client IP address
     */
    private function getClientIp(): string {
        $headers = [
            'HTTP_CF_CONNECTING_IP', // Cloudflare
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_REAL_IP',
            'HTTP_CLIENT_IP',
            'REMOTE_ADDR'
        ];
        
        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                $ip = trim($ips[0]);
                
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
    
    /**
     * Block IP temporarily
     */
    public function blockIp(int $duration = 3600): void {
        $this->db->query(
            "INSERT INTO blocked_ips (ip_address, blocked_until, reason) VALUES (?, DATE_ADD(NOW(), INTERVAL ? SECOND), 'Rate limit exceeded')",
            [$this->clientIp, $duration]
        );
    }
    
    /**
     * Check if IP is blocked
     */
    public function isBlocked(): bool {
        $blocked = $this->db->fetchColumn(
            "SELECT COUNT(*) FROM blocked_ips WHERE ip_address = ? AND blocked_until > NOW()",
            [$this->clientIp]
        );
        
        return $blocked > 0;
    }
}

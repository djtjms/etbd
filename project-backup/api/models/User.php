<?php
/**
 * User Model
 * Handles user data and authentication queries
 */

namespace App\Models;

class User extends Model {
    protected string $table = 'users';
    protected array $fillable = [
        'email',
        'password',
        'full_name',
        'avatar_url',
        'is_active'
    ];
    protected array $hidden = ['password'];
    
    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?array {
        return $this->db->fetch(
            "SELECT u.*, ur.role 
             FROM {$this->table} u 
             LEFT JOIN user_roles ur ON u.id = ur.user_id 
             WHERE u.email = ?",
            [$email]
        );
    }
    
    /**
     * Create new user with role
     */
    public function createWithRole(array $data, string $role = 'user'): ?array {
        $this->db->beginTransaction();
        
        try {
            // Hash password
            if (isset($data['password'])) {
                $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => PASSWORD_COST]);
            }
            
            // Create user
            $user = $this->create($data);
            
            if (!$user) {
                $this->db->rollback();
                return null;
            }
            
            // Assign role
            $this->db->query(
                "INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)",
                [$this->generateUUID(), $user['id'], $role]
            );
            
            // Create profile
            $this->db->query(
                "INSERT INTO profiles (id, user_id, email, full_name, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, NOW(), NOW())",
                [
                    $this->generateUUID(),
                    $user['id'],
                    $data['email'],
                    $data['full_name'] ?? null
                ]
            );
            
            $this->db->commit();
            
            // Return user with role
            $user['role'] = $role;
            return $this->hideFields($user);
            
        } catch (\Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * Update user's last login
     */
    public function updateLastLogin(string $userId): void {
        $this->db->query(
            "UPDATE {$this->table} SET last_login = NOW() WHERE id = ?",
            [$userId]
        );
    }
    
    /**
     * Get user's role
     */
    public function getRole(string $userId): ?string {
        return $this->db->fetchColumn(
            "SELECT role FROM user_roles WHERE user_id = ?",
            [$userId]
        );
    }
    
    /**
     * Check if user has specific role
     */
    public function hasRole(string $userId, string $role): bool {
        $count = $this->db->fetchColumn(
            "SELECT COUNT(*) FROM user_roles WHERE user_id = ? AND role = ?",
            [$userId, $role]
        );
        return $count > 0;
    }
    
    /**
     * Update user's password
     */
    public function updatePassword(string $userId, string $newPassword): bool {
        $hash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => PASSWORD_COST]);
        
        $affected = $this->db->query(
            "UPDATE {$this->table} SET password = ?, updated_at = NOW() WHERE id = ?",
            [$hash, $userId]
        )->rowCount();
        
        return $affected > 0;
    }
    
    /**
     * Deactivate user
     */
    public function deactivate(string $userId): bool {
        return $this->update($userId, ['is_active' => 0]) !== null;
    }
    
    /**
     * Activate user
     */
    public function activate(string $userId): bool {
        return $this->update($userId, ['is_active' => 1]) !== null;
    }
    
    /**
     * Get user profile
     */
    public function getProfile(string $userId): ?array {
        return $this->db->fetch(
            "SELECT * FROM profiles WHERE user_id = ?",
            [$userId]
        );
    }
    
    /**
     * Update user profile
     */
    public function updateProfile(string $userId, array $data): ?array {
        $allowed = ['full_name', 'avatar_url', 'bio', 'phone'];
        $data = array_intersect_key($data, array_flip($allowed));
        
        if (empty($data)) {
            return $this->getProfile($userId);
        }
        
        $data['updated_at'] = date('Y-m-d H:i:s');
        
        $set = implode(' = ?, ', array_keys($data)) . ' = ?';
        
        $this->db->query(
            "UPDATE profiles SET $set WHERE user_id = ?",
            array_merge(array_values($data), [$userId])
        );
        
        return $this->getProfile($userId);
    }
    
    /**
     * Get admin users
     */
    public function getAdmins(): array {
        return $this->db->fetchAll(
            "SELECT u.id, u.email, u.full_name, u.created_at 
             FROM {$this->table} u 
             INNER JOIN user_roles ur ON u.id = ur.user_id 
             WHERE ur.role = 'admin' AND u.is_active = 1"
        );
    }
}

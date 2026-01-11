<?php
/**
 * ContactSubmission Model
 * Handles contact form submissions
 */

namespace App\Models;

class ContactSubmission extends Model {
    protected string $table = 'contact_submissions';
    protected array $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'is_read'
    ];
    
    /**
     * Create contact submission
     */
    public function create(array $data): ?array {
        // Sanitize input
        $data['name'] = htmlspecialchars(strip_tags(trim($data['name'] ?? '')));
        $data['email'] = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $data['phone'] = preg_replace('/[^0-9+\-\s()]/', '', $data['phone'] ?? '');
        $data['subject'] = htmlspecialchars(strip_tags(trim($data['subject'] ?? '')));
        $data['message'] = htmlspecialchars(strip_tags(trim($data['message'] ?? '')));
        $data['is_read'] = 0;
        
        return parent::create($data);
    }
    
    /**
     * Get unread submissions
     */
    public function getUnread(): array {
        return $this->db->fetchAll(
            "SELECT * FROM {$this->table} WHERE is_read = 0 ORDER BY created_at DESC"
        );
    }
    
    /**
     * Get unread count
     */
    public function getUnreadCount(): int {
        return $this->count(['is_read' => 0]);
    }
    
    /**
     * Mark as read
     */
    public function markAsRead(string $id): ?array {
        return $this->update($id, ['is_read' => 1]);
    }
    
    /**
     * Mark multiple as read
     */
    public function markMultipleAsRead(array $ids): int {
        if (empty($ids)) {
            return 0;
        }
        
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        
        return $this->db->query(
            "UPDATE {$this->table} SET is_read = 1 WHERE id IN ($placeholders)",
            $ids
        )->rowCount();
    }
    
    /**
     * Get recent submissions (for admin dashboard)
     */
    public function getRecent(int $limit = 10): array {
        return $this->db->fetchAll(
            "SELECT id, name, email, subject, is_read, created_at 
             FROM {$this->table} 
             ORDER BY created_at DESC 
             LIMIT ?",
            [$limit]
        );
    }
    
    /**
     * Delete old submissions
     */
    public function deleteOlderThan(int $days): int {
        return $this->db->query(
            "DELETE FROM {$this->table} WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)",
            [$days]
        )->rowCount();
    }
    
    /**
     * Get submission statistics
     */
    public function getStats(): array {
        $today = $this->db->fetchColumn(
            "SELECT COUNT(*) FROM {$this->table} WHERE DATE(created_at) = CURDATE()"
        );
        
        $thisWeek = $this->db->fetchColumn(
            "SELECT COUNT(*) FROM {$this->table} WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
        );
        
        $thisMonth = $this->db->fetchColumn(
            "SELECT COUNT(*) FROM {$this->table} WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
        );
        
        return [
            'total' => $this->count(),
            'unread' => $this->getUnreadCount(),
            'today' => (int) $today,
            'this_week' => (int) $thisWeek,
            'this_month' => (int) $thisMonth
        ];
    }
}

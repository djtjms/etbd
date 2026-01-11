<?php
/**
 * Consultation Request Model
 */

namespace App\Models;

class ConsultationRequest extends Model {
    protected string $table = 'consultation_requests';
    protected array $fillable = [
        'name',
        'email',
        'phone',
        'interested_project',
        'message',
        'source',
        'is_read'
    ];
    
    public function create(array $data): ?array {
        $data['name'] = htmlspecialchars(strip_tags(trim($data['name'] ?? '')));
        $data['email'] = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $data['phone'] = preg_replace('/[^0-9+\-\s()]/', '', $data['phone'] ?? '');
        $data['message'] = htmlspecialchars(strip_tags(trim($data['message'] ?? '')));
        $data['source'] = $data['source'] ?? 'popup';
        $data['is_read'] = 0;
        
        return parent::create($data);
    }
    
    public function getUnread(): array {
        return $this->db->fetchAll(
            "SELECT * FROM {$this->table} WHERE is_read = 0 ORDER BY created_at DESC"
        );
    }
    
    public function markAsRead(string $id): ?array {
        return $this->update($id, ['is_read' => 1]);
    }
}

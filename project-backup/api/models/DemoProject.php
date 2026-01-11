<?php
/**
 * DemoProject Model
 * Handles demo project CRUD operations
 */

namespace App\Models;

class DemoProject extends Model {
    protected string $table = 'demo_projects';
    protected array $fillable = [
        'title',
        'slug',
        'description',
        'demo_url',
        'thumbnail',
        'screenshots',
        'project_type',
        'technologies',
        'status',
        'is_featured',
        'preview_mode',
        'allow_interaction'
    ];
    
    /**
     * Get all published demos
     */
    public function getPublished(int $page = 1, int $perPage = 12): array {
        return $this->paginate($page, $perPage, ['status' => 'published'], ['created_at' => 'DESC']);
    }
    
    /**
     * Get featured demos
     */
    public function getFeatured(int $limit = 6): array {
        return $this->db->fetchAll(
            "SELECT * FROM {$this->table} 
             WHERE status = 'published' AND is_featured = 1 
             ORDER BY created_at DESC 
             LIMIT ?",
            [$limit]
        );
    }
    
    /**
     * Get demo by slug
     */
    public function findBySlug(string $slug, bool $publishedOnly = true): ?array {
        $sql = "SELECT * FROM {$this->table} WHERE slug = ?";
        
        if ($publishedOnly) {
            $sql .= " AND status = 'published'";
        }
        
        $demo = $this->db->fetch($sql, [$slug]);
        
        if ($demo) {
            // Decode JSON fields
            $demo['technologies'] = json_decode($demo['technologies'] ?? '[]', true) ?: [];
            $demo['screenshots'] = json_decode($demo['screenshots'] ?? '[]', true) ?: [];
            
            // Get credentials if available (admin only based on caller)
            $credentials = $this->db->fetch(
                "SELECT access_username, access_password, access_code, access_notes 
                 FROM demo_project_credentials 
                 WHERE project_id = ?",
                [$demo['id']]
            );
            
            if ($credentials) {
                $demo['credentials'] = $credentials;
            }
        }
        
        return $demo;
    }
    
    /**
     * Create demo project
     */
    public function create(array $data): ?array {
        // Generate slug if not provided
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = $this->generateSlug($data['title']);
        }
        
        // Handle arrays to JSON
        if (isset($data['technologies']) && is_array($data['technologies'])) {
            $data['technologies'] = json_encode($data['technologies']);
        }
        if (isset($data['screenshots']) && is_array($data['screenshots'])) {
            $data['screenshots'] = json_encode($data['screenshots']);
        }
        
        return parent::create($data);
    }
    
    /**
     * Update demo project
     */
    public function update(string $id, array $data): ?array {
        $existing = $this->find($id);
        
        if (!$existing) {
            return null;
        }
        
        // Regenerate slug if title changed
        if (!empty($data['title']) && $data['title'] !== $existing['title'] && empty($data['slug'])) {
            $data['slug'] = $this->generateSlug($data['title'], $id);
        }
        
        // Handle arrays to JSON
        if (isset($data['technologies']) && is_array($data['technologies'])) {
            $data['technologies'] = json_encode($data['technologies']);
        }
        if (isset($data['screenshots']) && is_array($data['screenshots'])) {
            $data['screenshots'] = json_encode($data['screenshots']);
        }
        
        return parent::update($id, $data);
    }
    
    /**
     * Save demo credentials
     */
    public function saveCredentials(string $projectId, array $credentials): bool {
        // Check if credentials exist
        $existing = $this->db->fetch(
            "SELECT project_id FROM demo_project_credentials WHERE project_id = ?",
            [$projectId]
        );
        
        $data = [
            'access_username' => $credentials['access_username'] ?? null,
            'access_password' => $credentials['access_password'] ?? null,
            'access_code' => $credentials['access_code'] ?? null,
            'access_notes' => $credentials['access_notes'] ?? null,
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        if ($existing) {
            $this->db->update('demo_project_credentials', $data, 'project_id = ?', [$projectId]);
        } else {
            $data['project_id'] = $projectId;
            $data['created_at'] = date('Y-m-d H:i:s');
            $this->db->insert('demo_project_credentials', $data);
        }
        
        return true;
    }
    
    /**
     * Increment view count
     */
    public function incrementViews(string $id): void {
        $this->db->query(
            "UPDATE {$this->table} SET view_count = view_count + 1 WHERE id = ?",
            [$id]
        );
    }
    
    /**
     * Get demos by type
     */
    public function getByType(string $type, int $page = 1, int $perPage = 12): array {
        return $this->paginate($page, $perPage, [
            'status' => 'published',
            'project_type' => $type
        ], ['created_at' => 'DESC']);
    }
    
    /**
     * Get project types with counts
     */
    public function getTypeCounts(): array {
        return $this->db->fetchAll(
            "SELECT project_type, COUNT(*) as count 
             FROM {$this->table} 
             WHERE status = 'published' 
             GROUP BY project_type 
             ORDER BY count DESC"
        );
    }
    
    /**
     * Search demos
     */
    public function searchDemos(string $query, int $limit = 10): array {
        return $this->db->fetchAll(
            "SELECT id, title, slug, description, thumbnail, project_type 
             FROM {$this->table} 
             WHERE status = 'published' 
               AND (title LIKE ? OR description LIKE ?) 
             ORDER BY created_at DESC 
             LIMIT ?",
            ["%$query%", "%$query%", $limit]
        );
    }
    
    /**
     * Get demo statistics
     */
    public function getStats(): array {
        $totalViews = $this->db->fetchColumn(
            "SELECT SUM(view_count) FROM {$this->table}"
        );
        
        return [
            'total' => $this->count(),
            'published' => $this->count(['status' => 'published']),
            'featured' => $this->count(['is_featured' => 1]),
            'total_views' => (int) $totalViews
        ];
    }
}

<?php
/**
 * BlogPost Model
 * Handles blog post CRUD operations
 */

namespace App\Models;

class BlogPost extends Model {
    protected string $table = 'blog_posts';
    protected array $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'author_id',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'published_at'
    ];
    
    /**
     * Get all published posts
     */
    public function getPublished(int $page = 1, int $perPage = 10): array {
        return $this->paginate($page, $perPage, ['status' => 'published'], ['published_at' => 'DESC']);
    }
    
    /**
     * Get post by slug
     */
    public function findBySlug(string $slug, bool $publishedOnly = true): ?array {
        $sql = "SELECT bp.*, u.full_name as author_name 
                FROM {$this->table} bp 
                LEFT JOIN users u ON bp.author_id = u.id 
                WHERE bp.slug = ?";
        
        if ($publishedOnly) {
            $sql .= " AND bp.status = 'published'";
        }
        
        return $this->db->fetch($sql, [$slug]);
    }
    
    /**
     * Create blog post
     */
    public function create(array $data): ?array {
        // Generate slug if not provided
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = $this->generateSlug($data['title']);
        }
        
        // Set published_at if publishing
        if (isset($data['status']) && $data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = date('Y-m-d H:i:s');
        }
        
        // Handle SEO keywords array
        if (isset($data['seo_keywords']) && is_array($data['seo_keywords'])) {
            $data['seo_keywords'] = json_encode($data['seo_keywords']);
        }
        
        return parent::create($data);
    }
    
    /**
     * Update blog post
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
        
        // Set published_at when publishing
        if (isset($data['status']) && $data['status'] === 'published' && $existing['status'] !== 'published') {
            $data['published_at'] = date('Y-m-d H:i:s');
        }
        
        // Handle SEO keywords array
        if (isset($data['seo_keywords']) && is_array($data['seo_keywords'])) {
            $data['seo_keywords'] = json_encode($data['seo_keywords']);
        }
        
        return parent::update($id, $data);
    }
    
    /**
     * Publish post
     */
    public function publish(string $id): ?array {
        return $this->update($id, [
            'status' => 'published',
            'published_at' => date('Y-m-d H:i:s')
        ]);
    }
    
    /**
     * Unpublish post (set to draft)
     */
    public function unpublish(string $id): ?array {
        return $this->update($id, ['status' => 'draft']);
    }
    
    /**
     * Get posts by author
     */
    public function getByAuthor(string $authorId, int $page = 1, int $perPage = 10): array {
        return $this->paginate($page, $perPage, ['author_id' => $authorId], ['created_at' => 'DESC']);
    }
    
    /**
     * Search posts
     */
    public function searchPosts(string $query, int $limit = 10): array {
        return $this->db->fetchAll(
            "SELECT id, title, slug, excerpt, featured_image, published_at 
             FROM {$this->table} 
             WHERE status = 'published' 
               AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?) 
             ORDER BY published_at DESC 
             LIMIT ?",
            ["%$query%", "%$query%", "%$query%", $limit]
        );
    }
    
    /**
     * Get related posts
     */
    public function getRelated(string $postId, int $limit = 3): array {
        // Simple related posts based on author
        $post = $this->find($postId);
        
        if (!$post) {
            return [];
        }
        
        return $this->db->fetchAll(
            "SELECT id, title, slug, excerpt, featured_image, published_at 
             FROM {$this->table} 
             WHERE status = 'published' 
               AND id != ? 
               AND author_id = ? 
             ORDER BY published_at DESC 
             LIMIT ?",
            [$postId, $post['author_id'], $limit]
        );
    }
    
    /**
     * Get post statistics
     */
    public function getStats(): array {
        return [
            'total' => $this->count(),
            'published' => $this->count(['status' => 'published']),
            'draft' => $this->count(['status' => 'draft'])
        ];
    }
    
    /**
     * Get recent posts for sidebar/widget
     */
    public function getRecent(int $limit = 5): array {
        return $this->db->fetchAll(
            "SELECT id, title, slug, featured_image, published_at 
             FROM {$this->table} 
             WHERE status = 'published' 
             ORDER BY published_at DESC 
             LIMIT ?",
            [$limit]
        );
    }
}

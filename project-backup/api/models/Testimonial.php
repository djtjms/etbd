<?php
/**
 * Testimonial Model
 * Handles testimonial CRUD operations
 */

namespace App\Models;

class Testimonial extends Model {
    protected string $table = 'testimonials';
    protected array $fillable = [
        'client_name',
        'client_company',
        'client_position',
        'client_avatar',
        'review',
        'rating',
        'is_featured'
    ];
    
    /**
     * Get featured testimonials
     */
    public function getFeatured(int $limit = 6): array {
        return $this->db->fetchAll(
            "SELECT * FROM {$this->table} 
             WHERE is_featured = 1 
             ORDER BY created_at DESC 
             LIMIT ?",
            [$limit]
        );
    }
    
    /**
     * Get all testimonials (paginated)
     */
    public function getAll(int $page = 1, int $perPage = 10): array {
        return $this->paginate($page, $perPage, [], ['created_at' => 'DESC']);
    }
    
    /**
     * Create testimonial
     */
    public function create(array $data): ?array {
        // Sanitize input
        $data['client_name'] = htmlspecialchars(strip_tags(trim($data['client_name'] ?? '')));
        $data['client_company'] = htmlspecialchars(strip_tags(trim($data['client_company'] ?? '')));
        $data['client_position'] = htmlspecialchars(strip_tags(trim($data['client_position'] ?? '')));
        $data['review'] = htmlspecialchars(strip_tags(trim($data['review'] ?? '')));
        
        // Validate rating
        $data['rating'] = min(5, max(1, (int) ($data['rating'] ?? 5)));
        
        // Default is_featured to false
        $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
        
        return parent::create($data);
    }
    
    /**
     * Update testimonial
     */
    public function update(string $id, array $data): ?array {
        // Sanitize input
        if (isset($data['client_name'])) {
            $data['client_name'] = htmlspecialchars(strip_tags(trim($data['client_name'])));
        }
        if (isset($data['client_company'])) {
            $data['client_company'] = htmlspecialchars(strip_tags(trim($data['client_company'])));
        }
        if (isset($data['client_position'])) {
            $data['client_position'] = htmlspecialchars(strip_tags(trim($data['client_position'])));
        }
        if (isset($data['review'])) {
            $data['review'] = htmlspecialchars(strip_tags(trim($data['review'])));
        }
        
        // Validate rating
        if (isset($data['rating'])) {
            $data['rating'] = min(5, max(1, (int) $data['rating']));
        }
        
        return parent::update($id, $data);
    }
    
    /**
     * Toggle featured status
     */
    public function toggleFeatured(string $id): ?array {
        $testimonial = $this->find($id);
        
        if (!$testimonial) {
            return null;
        }
        
        return $this->update($id, [
            'is_featured' => !$testimonial['is_featured']
        ]);
    }
    
    /**
     * Get average rating
     */
    public function getAverageRating(): float {
        $avg = $this->db->fetchColumn(
            "SELECT AVG(rating) FROM {$this->table}"
        );
        
        return round((float) $avg, 1);
    }
    
    /**
     * Get rating distribution
     */
    public function getRatingDistribution(): array {
        $distribution = [];
        
        for ($i = 1; $i <= 5; $i++) {
            $count = $this->count(['rating' => $i]);
            $distribution[$i] = $count;
        }
        
        return $distribution;
    }
    
    /**
     * Get testimonial statistics
     */
    public function getStats(): array {
        return [
            'total' => $this->count(),
            'featured' => $this->count(['is_featured' => 1]),
            'average_rating' => $this->getAverageRating(),
            'rating_distribution' => $this->getRatingDistribution()
        ];
    }
    
    /**
     * Get random featured testimonials (for homepage rotation)
     */
    public function getRandomFeatured(int $limit = 3): array {
        return $this->db->fetchAll(
            "SELECT * FROM {$this->table} 
             WHERE is_featured = 1 
             ORDER BY RAND() 
             LIMIT ?",
            [$limit]
        );
    }
}

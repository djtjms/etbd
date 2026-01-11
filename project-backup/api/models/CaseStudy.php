<?php
/**
 * Case Study Model
 */

namespace App\Models;

class CaseStudy extends Model {
    protected string $table = 'case_studies';
    protected array $fillable = [
        'title',
        'slug',
        'client_name',
        'description',
        'results',
        'technologies',
        'featured_image',
        'gallery_images',
        'status'
    ];
    
    public function getPublished(int $page = 1, int $perPage = 10): array {
        return $this->paginate($page, $perPage, ['status' => 'published'], ['created_at' => 'DESC']);
    }
    
    public function findBySlug(string $slug, bool $publishedOnly = true): ?array {
        $sql = "SELECT * FROM {$this->table} WHERE slug = ?";
        if ($publishedOnly) {
            $sql .= " AND status = 'published'";
        }
        
        $study = $this->db->fetch($sql, [$slug]);
        
        if ($study) {
            $study['technologies'] = json_decode($study['technologies'] ?? '[]', true) ?: [];
            $study['gallery_images'] = json_decode($study['gallery_images'] ?? '[]', true) ?: [];
        }
        
        return $study;
    }
    
    public function create(array $data): ?array {
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = $this->generateSlug($data['title']);
        }
        
        if (isset($data['technologies']) && is_array($data['technologies'])) {
            $data['technologies'] = json_encode($data['technologies']);
        }
        if (isset($data['gallery_images']) && is_array($data['gallery_images'])) {
            $data['gallery_images'] = json_encode($data['gallery_images']);
        }
        
        return parent::create($data);
    }
}

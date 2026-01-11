<?php
/**
 * SEO Settings Model
 */

namespace App\Models;

class SeoSettings extends Model {
    protected string $table = 'seo_settings';
    protected array $fillable = [
        'page_name',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_image'
    ];
    
    public function getByPage(string $pageName): ?array {
        $settings = $this->findBy('page_name', $pageName);
        
        if ($settings && !empty($settings['meta_keywords'])) {
            $settings['meta_keywords'] = json_decode($settings['meta_keywords'], true) ?: [];
        }
        
        return $settings;
    }
    
    public function getAllSettings(): array {
        $settings = $this->all(['page_name' => 'ASC']);
        
        foreach ($settings as &$setting) {
            if (!empty($setting['meta_keywords'])) {
                $setting['meta_keywords'] = json_decode($setting['meta_keywords'], true) ?: [];
            }
        }
        
        return $settings;
    }
    
    public function upsert(string $pageName, array $data): ?array {
        $existing = $this->findBy('page_name', $pageName);
        
        if (isset($data['meta_keywords']) && is_array($data['meta_keywords'])) {
            $data['meta_keywords'] = json_encode($data['meta_keywords']);
        }
        
        if ($existing) {
            return $this->update($existing['id'], $data);
        } else {
            $data['page_name'] = $pageName;
            return $this->create($data);
        }
    }
}

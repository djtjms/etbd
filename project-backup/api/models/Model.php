<?php
/**
 * Base Model Class
 * Provides common CRUD operations for all models
 */

namespace App\Models;

use App\Includes\Database;

abstract class Model {
    protected Database $db;
    protected string $table;
    protected string $primaryKey = 'id';
    protected array $fillable = [];
    protected array $hidden = [];
    protected bool $timestamps = true;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Find record by primary key
     */
    public function find(string $id): ?array {
        $record = $this->db->fetch(
            "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?",
            [$id]
        );
        
        return $record ? $this->hideFields($record) : null;
    }
    
    /**
     * Find record by column value
     */
    public function findBy(string $column, $value): ?array {
        $record = $this->db->fetch(
            "SELECT * FROM {$this->table} WHERE {$column} = ?",
            [$value]
        );
        
        return $record ? $this->hideFields($record) : null;
    }
    
    /**
     * Get all records
     */
    public function all(array $orderBy = null): array {
        $sql = "SELECT * FROM {$this->table}";
        
        if ($orderBy) {
            $sql .= " ORDER BY " . implode(', ', array_map(
                fn($col, $dir) => "$col $dir",
                array_keys($orderBy),
                array_values($orderBy)
            ));
        }
        
        $records = $this->db->fetchAll($sql);
        return array_map(fn($r) => $this->hideFields($r), $records);
    }
    
    /**
     * Get paginated records
     */
    public function paginate(int $page = 1, int $perPage = DEFAULT_PAGE_SIZE, array $conditions = [], array $orderBy = null): array {
        $perPage = min($perPage, MAX_PAGE_SIZE);
        $offset = ($page - 1) * $perPage;
        
        // Build WHERE clause
        $where = '';
        $params = [];
        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $column => $value) {
                if (is_array($value)) {
                    // Handle operators like ['>=', '2023-01-01']
                    $clauses[] = "$column {$value[0]} ?";
                    $params[] = $value[1];
                } else {
                    $clauses[] = "$column = ?";
                    $params[] = $value;
                }
            }
            $where = "WHERE " . implode(' AND ', $clauses);
        }
        
        // Build ORDER BY clause
        $order = '';
        if ($orderBy) {
            $order = "ORDER BY " . implode(', ', array_map(
                fn($col, $dir) => "$col $dir",
                array_keys($orderBy),
                array_values($orderBy)
            ));
        }
        
        // Get total count
        $total = (int) $this->db->fetchColumn(
            "SELECT COUNT(*) FROM {$this->table} $where",
            $params
        );
        
        // Get paginated records
        $records = $this->db->fetchAll(
            "SELECT * FROM {$this->table} $where $order LIMIT ? OFFSET ?",
            array_merge($params, [$perPage, $offset])
        );
        
        return [
            'items' => array_map(fn($r) => $this->hideFields($r), $records),
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
            'last_page' => ceil($total / $perPage)
        ];
    }
    
    /**
     * Create new record
     */
    public function create(array $data): ?array {
        // Filter to fillable fields
        $data = array_intersect_key($data, array_flip($this->fillable));
        
        // Add timestamps
        if ($this->timestamps) {
            $data['created_at'] = date('Y-m-d H:i:s');
            $data['updated_at'] = date('Y-m-d H:i:s');
        }
        
        // Generate UUID if not provided
        if (!isset($data[$this->primaryKey])) {
            $data[$this->primaryKey] = $this->generateUUID();
        }
        
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        
        $this->db->query(
            "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)",
            array_values($data)
        );
        
        return $this->find($data[$this->primaryKey]);
    }
    
    /**
     * Update record
     */
    public function update(string $id, array $data): ?array {
        // Filter to fillable fields
        $data = array_intersect_key($data, array_flip($this->fillable));
        
        if (empty($data)) {
            return $this->find($id);
        }
        
        // Add updated timestamp
        if ($this->timestamps) {
            $data['updated_at'] = date('Y-m-d H:i:s');
        }
        
        $set = implode(' = ?, ', array_keys($data)) . ' = ?';
        
        $this->db->query(
            "UPDATE {$this->table} SET $set WHERE {$this->primaryKey} = ?",
            array_merge(array_values($data), [$id])
        );
        
        return $this->find($id);
    }
    
    /**
     * Delete record
     */
    public function delete(string $id): bool {
        $affected = $this->db->delete($this->table, "{$this->primaryKey} = ?", [$id]);
        return $affected > 0;
    }
    
    /**
     * Check if record exists
     */
    public function exists(string $column, $value, string $excludeId = null): bool {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE $column = ?";
        $params = [$value];
        
        if ($excludeId) {
            $sql .= " AND {$this->primaryKey} != ?";
            $params[] = $excludeId;
        }
        
        return (int) $this->db->fetchColumn($sql, $params) > 0;
    }
    
    /**
     * Count records
     */
    public function count(array $conditions = []): int {
        $where = '';
        $params = [];
        
        if (!empty($conditions)) {
            $clauses = [];
            foreach ($conditions as $column => $value) {
                $clauses[] = "$column = ?";
                $params[] = $value;
            }
            $where = "WHERE " . implode(' AND ', $clauses);
        }
        
        return (int) $this->db->fetchColumn(
            "SELECT COUNT(*) FROM {$this->table} $where",
            $params
        );
    }
    
    /**
     * Search records
     */
    public function search(string $query, array $columns, int $limit = 10): array {
        $clauses = array_map(fn($col) => "$col LIKE ?", $columns);
        $where = implode(' OR ', $clauses);
        $params = array_fill(0, count($columns), "%$query%");
        
        $records = $this->db->fetchAll(
            "SELECT * FROM {$this->table} WHERE $where LIMIT ?",
            array_merge($params, [$limit])
        );
        
        return array_map(fn($r) => $this->hideFields($r), $records);
    }
    
    /**
     * Hide sensitive fields
     */
    protected function hideFields(array $record): array {
        foreach ($this->hidden as $field) {
            unset($record[$field]);
        }
        return $record;
    }
    
    /**
     * Generate UUID v4
     */
    protected function generateUUID(): string {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
    
    /**
     * Generate URL slug
     */
    protected function generateSlug(string $title, string $excludeId = null): string {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->exists('slug', $slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }
}

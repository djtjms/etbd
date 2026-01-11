<?php
/**
 * Input Validator
 * Validates and sanitizes user input
 */

namespace App\Includes;

class Validator {
    private array $data = [];
    private array $rules = [];
    private array $errors = [];
    private array $validated = [];
    
    /**
     * Create validator instance
     */
    public function __construct(array $data, array $rules) {
        $this->data = $data;
        $this->rules = $rules;
    }
    
    /**
     * Static factory method
     */
    public static function make(array $data, array $rules): self {
        return new self($data, $rules);
    }
    
    /**
     * Validate data
     */
    public function validate(): bool {
        $this->errors = [];
        $this->validated = [];
        
        foreach ($this->rules as $field => $ruleString) {
            $rules = is_array($ruleString) ? $ruleString : explode('|', $ruleString);
            $value = $this->getValue($field);
            
            foreach ($rules as $rule) {
                $this->applyRule($field, $value, $rule);
            }
            
            // Store validated value if no errors for this field
            if (!isset($this->errors[$field])) {
                $this->validated[$field] = $value;
            }
        }
        
        return empty($this->errors);
    }
    
    /**
     * Get value from data (supports dot notation)
     */
    private function getValue(string $field) {
        $keys = explode('.', $field);
        $value = $this->data;
        
        foreach ($keys as $key) {
            if (!isset($value[$key])) {
                return null;
            }
            $value = $value[$key];
        }
        
        return $value;
    }
    
    /**
     * Apply a validation rule
     */
    private function applyRule(string $field, $value, string $rule): void {
        // Parse rule with parameters
        $params = [];
        if (strpos($rule, ':') !== false) {
            list($rule, $paramString) = explode(':', $rule, 2);
            $params = explode(',', $paramString);
        }
        
        $method = 'validate' . ucfirst($rule);
        
        if (method_exists($this, $method)) {
            $result = $this->$method($field, $value, $params);
            if ($result !== true) {
                $this->addError($field, $result);
            }
        }
    }
    
    /**
     * Add error message
     */
    private function addError(string $field, string $message): void {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = [];
        }
        $this->errors[$field][] = $message;
    }
    
    /**
     * Get all errors
     */
    public function errors(): array {
        return $this->errors;
    }
    
    /**
     * Get first error for a field
     */
    public function firstError(string $field): ?string {
        return $this->errors[$field][0] ?? null;
    }
    
    /**
     * Check if validation failed
     */
    public function fails(): bool {
        return !empty($this->errors);
    }
    
    /**
     * Get validated data
     */
    public function validated(): array {
        return $this->validated;
    }
    
    // ===== Validation Rules =====
    
    private function validateRequired(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '' || (is_array($value) && empty($value))) {
            return "The $field field is required.";
        }
        return true;
    }
    
    private function validateEmail(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return "The $field must be a valid email address.";
        }
        return true;
    }
    
    private function validateString(string $field, $value, array $params): bool|string {
        if ($value === null) return true;
        if (!is_string($value)) {
            return "The $field must be a string.";
        }
        return true;
    }
    
    private function validateNumeric(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        if (!is_numeric($value)) {
            return "The $field must be a number.";
        }
        return true;
    }
    
    private function validateInteger(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        if (!filter_var($value, FILTER_VALIDATE_INT)) {
            return "The $field must be an integer.";
        }
        return true;
    }
    
    private function validateMin(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        $min = (int) ($params[0] ?? 0);
        
        if (is_string($value) && strlen($value) < $min) {
            return "The $field must be at least $min characters.";
        }
        if (is_numeric($value) && $value < $min) {
            return "The $field must be at least $min.";
        }
        if (is_array($value) && count($value) < $min) {
            return "The $field must have at least $min items.";
        }
        return true;
    }
    
    private function validateMax(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        $max = (int) ($params[0] ?? 0);
        
        if (is_string($value) && strlen($value) > $max) {
            return "The $field must not exceed $max characters.";
        }
        if (is_numeric($value) && $value > $max) {
            return "The $field must not exceed $max.";
        }
        if (is_array($value) && count($value) > $max) {
            return "The $field must not have more than $max items.";
        }
        return true;
    }
    
    private function validateBetween(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        $min = (int) ($params[0] ?? 0);
        $max = (int) ($params[1] ?? 0);
        
        if (is_string($value)) {
            $len = strlen($value);
            if ($len < $min || $len > $max) {
                return "The $field must be between $min and $max characters.";
            }
        }
        return true;
    }
    
    private function validateIn(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        if (!in_array($value, $params)) {
            return "The selected $field is invalid.";
        }
        return true;
    }
    
    private function validateUrl(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        if (!filter_var($value, FILTER_VALIDATE_URL)) {
            return "The $field must be a valid URL.";
        }
        return true;
    }
    
    private function validateArray(string $field, $value, array $params): bool|string {
        if ($value === null) return true;
        if (!is_array($value)) {
            return "The $field must be an array.";
        }
        return true;
    }
    
    private function validateBoolean(string $field, $value, array $params): bool|string {
        if ($value === null) return true;
        $acceptable = [true, false, 0, 1, '0', '1', 'true', 'false'];
        if (!in_array($value, $acceptable, true)) {
            return "The $field must be true or false.";
        }
        return true;
    }
    
    private function validateDate(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        if (strtotime($value) === false) {
            return "The $field must be a valid date.";
        }
        return true;
    }
    
    private function validateRegex(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        $pattern = $params[0] ?? '';
        if (!preg_match($pattern, $value)) {
            return "The $field format is invalid.";
        }
        return true;
    }
    
    private function validateConfirmed(string $field, $value, array $params): bool|string {
        $confirmField = $field . '_confirmation';
        $confirmValue = $this->data[$confirmField] ?? null;
        
        if ($value !== $confirmValue) {
            return "The $field confirmation does not match.";
        }
        return true;
    }
    
    private function validateNullable(string $field, $value, array $params): bool|string {
        // Nullable means the field can be null, no error needed
        return true;
    }
    
    private function validateSlug(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $value)) {
            return "The $field must be a valid slug (lowercase letters, numbers, and hyphens).";
        }
        return true;
    }
    
    private function validateUuid(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        $pattern = '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';
        if (!preg_match($pattern, $value)) {
            return "The $field must be a valid UUID.";
        }
        return true;
    }
    
    private function validatePhone(string $field, $value, array $params): bool|string {
        if ($value === null || $value === '') return true;
        // Allow various phone formats
        $cleaned = preg_replace('/[^0-9+]/', '', $value);
        if (strlen($cleaned) < 10 || strlen($cleaned) > 15) {
            return "The $field must be a valid phone number.";
        }
        return true;
    }
    
    /**
     * Sanitize string (remove HTML tags, trim)
     */
    public static function sanitize(string $value): string {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Sanitize for SQL (escape special characters)
     */
    public static function escape(string $value): string {
        return addslashes($value);
    }
}

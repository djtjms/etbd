<?php
/**
 * Application Configuration
 * Loads environment variables and defines app constants
 */

// Prevent direct access
if (!defined('API_ROOT')) {
    define('API_ROOT', dirname(__DIR__));
}

// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse key=value
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove quotes if present
            $value = trim($value, '"\'');
            
            // Set environment variable
            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
    
    return true;
}

// Load .env file
loadEnv(API_ROOT . '/.env');

// Environment helper function
function env($key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        return $default;
    }
    
    // Handle boolean values
    switch (strtolower($value)) {
        case 'true':
        case '(true)':
            return true;
        case 'false':
        case '(false)':
            return false;
        case 'null':
        case '(null)':
            return null;
        case 'empty':
        case '(empty)':
            return '';
    }
    
    return $value;
}

// Application settings
define('APP_ENV', env('APP_ENV', 'production'));
define('APP_DEBUG', env('APP_DEBUG', false));
define('APP_URL', env('APP_URL', 'http://localhost'));
define('APP_TIMEZONE', env('APP_TIMEZONE', 'Asia/Dhaka'));

// Set timezone
date_default_timezone_set(APP_TIMEZONE);

// Error reporting based on environment
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// JWT settings
define('JWT_SECRET', env('JWT_SECRET', 'your-256-bit-secret-key-change-in-production'));
define('JWT_EXPIRY', (int) env('JWT_EXPIRY', 3600)); // 1 hour
define('JWT_REFRESH_EXPIRY', (int) env('JWT_REFRESH_EXPIRY', 604800)); // 7 days
define('JWT_ALGORITHM', 'HS256');

// Rate limiting
define('RATE_LIMIT_REQUESTS', (int) env('RATE_LIMIT_REQUESTS', 100));
define('RATE_LIMIT_WINDOW', (int) env('RATE_LIMIT_WINDOW', 3600)); // 1 hour

// File upload settings
define('UPLOAD_MAX_SIZE', (int) env('UPLOAD_MAX_SIZE', 5242880)); // 5MB
define('UPLOAD_ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
define('UPLOAD_DIR', API_ROOT . '/uploads');

// Pagination defaults
define('DEFAULT_PAGE_SIZE', 10);
define('MAX_PAGE_SIZE', 100);

// Security settings
define('PASSWORD_COST', 12); // bcrypt cost factor
define('CSRF_TOKEN_LENGTH', 32);

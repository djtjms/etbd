<?php
/**
 * API Entry Point / Router
 * Handles all API requests and routes them to appropriate endpoints
 */

// Define API root
define('API_ROOT', dirname(__DIR__));

// Load configuration
require_once API_ROOT . '/config/config.php';

// Autoload classes
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = API_ROOT . '/';
    
    if (strpos($class, $prefix) !== 0) {
        return;
    }
    
    $relativeClass = substr($class, strlen($prefix));
    $file = $baseDir . strtolower(str_replace('\\', '/', $relativeClass)) . '.php';
    
    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Includes\Database;
use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\RateLimiter;

// ============================================
// CORS Headers
// ============================================
$corsConfig = require API_ROOT . '/config/cors.php';

// Get origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if origin is allowed
if (in_array('*', $corsConfig['allowed_origins']) || in_array($origin, $corsConfig['allowed_origins'])) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (!empty($corsConfig['allowed_origins'])) {
    header("Access-Control-Allow-Origin: " . $corsConfig['allowed_origins'][0]);
}

header('Access-Control-Allow-Methods: ' . implode(', ', $corsConfig['allowed_methods']));
header('Access-Control-Allow-Headers: ' . implode(', ', $corsConfig['allowed_headers']));
header('Access-Control-Expose-Headers: ' . implode(', ', $corsConfig['exposed_headers']));

if ($corsConfig['supports_credentials']) {
    header('Access-Control-Allow-Credentials: true');
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Max-Age: ' . $corsConfig['max_age']);
    http_response_code(204);
    exit;
}

// ============================================
// Security Headers
// ============================================
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// ============================================
// Rate Limiting
// ============================================
try {
    $rateLimiter = new RateLimiter();
    
    // Check if IP is blocked
    if ($rateLimiter->isBlocked()) {
        Response::error('Your IP has been temporarily blocked', 403);
    }
    
    // Check rate limit
    if (!$rateLimiter->check('api')) {
        $rateLimiter->addHeaders('api');
        Response::tooManyRequests('Rate limit exceeded. Please try again later.');
    }
    
    $rateLimiter->addHeaders('api');
} catch (Exception $e) {
    // If rate limiter fails (e.g., no database), continue without it
    if (APP_DEBUG) {
        error_log("Rate limiter error: " . $e->getMessage());
    }
}

// ============================================
// Parse Request
// ============================================
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Remove query string
$uri = strtok($uri, '?');

// Remove base path if API is in subdirectory
$basePath = '/api';
if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

// Normalize URI
$uri = '/' . trim($uri, '/');

// Get request body for POST/PUT/PATCH
$input = [];
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
    } else {
        $input = $_POST;
    }
}

// Store request data globally
$GLOBALS['request'] = [
    'method' => $method,
    'uri' => $uri,
    'input' => $input,
    'query' => $_GET
];

// ============================================
// Route Definitions
// ============================================
$routes = [
    // Auth routes
    'POST /auth/login' => 'auth.php@login',
    'POST /auth/register' => 'auth.php@register',
    'POST /auth/logout' => 'auth.php@logout',
    'POST /auth/refresh' => 'auth.php@refresh',
    'GET /auth/me' => 'auth.php@me',
    
    // Blog routes
    'GET /blog' => 'blog.php@index',
    'GET /blog/{slug}' => 'blog.php@show',
    'POST /blog' => 'blog.php@store',
    'PUT /blog/{id}' => 'blog.php@update',
    'DELETE /blog/{id}' => 'blog.php@destroy',
    
    // Contact routes
    'POST /contact' => 'contact.php@store',
    'GET /contact' => 'contact.php@index',
    'GET /contact/{id}' => 'contact.php@show',
    'PUT /contact/{id}/read' => 'contact.php@markRead',
    'DELETE /contact/{id}' => 'contact.php@destroy',
    
    // Demo routes
    'GET /demo' => 'demo.php@index',
    'GET /demo/featured' => 'demo.php@featured',
    'GET /demo/{slug}' => 'demo.php@show',
    'POST /demo' => 'demo.php@store',
    'PUT /demo/{id}' => 'demo.php@update',
    'DELETE /demo/{id}' => 'demo.php@destroy',
    
    // Testimonial routes
    'GET /testimonials' => 'testimonials.php@index',
    'GET /testimonials/featured' => 'testimonials.php@featured',
    'POST /testimonials' => 'testimonials.php@store',
    'PUT /testimonials/{id}' => 'testimonials.php@update',
    'DELETE /testimonials/{id}' => 'testimonials.php@destroy',
    
    // Branding routes
    'GET /branding' => 'branding.php@show',
    'PUT /branding' => 'branding.php@update',
    
    // Health check
    'GET /health' => function() {
        Response::success(['status' => 'healthy', 'timestamp' => date('c')]);
    }
];

// ============================================
// Route Matching
// ============================================
function matchRoute(string $method, string $uri, array $routes): ?array {
    $routeKey = "$method $uri";
    
    // Direct match
    if (isset($routes[$routeKey])) {
        return ['handler' => $routes[$routeKey], 'params' => []];
    }
    
    // Pattern matching
    foreach ($routes as $pattern => $handler) {
        list($routeMethod, $routePath) = explode(' ', $pattern, 2);
        
        if ($routeMethod !== $method) {
            continue;
        }
        
        // Convert route pattern to regex
        $regex = preg_replace('/\{([a-z_]+)\}/', '(?P<$1>[^/]+)', $routePath);
        $regex = '#^' . $regex . '$#';
        
        if (preg_match($regex, $uri, $matches)) {
            // Extract named parameters
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            return ['handler' => $handler, 'params' => $params];
        }
    }
    
    return null;
}

// ============================================
// Execute Route
// ============================================
$match = matchRoute($method, $uri, $routes);

if (!$match) {
    Response::notFound('Endpoint not found');
}

$handler = $match['handler'];
$params = $match['params'];

// Store params globally
$GLOBALS['request']['params'] = $params;

// Execute handler
if (is_callable($handler)) {
    // Direct callable
    $handler();
} else {
    // File@method format
    list($file, $action) = explode('@', $handler);
    $filePath = API_ROOT . '/api/' . $file;
    
    if (!file_exists($filePath)) {
        Response::serverError('Handler not found');
    }
    
    // Define action for the included file
    define('API_ACTION', $action);
    
    require_once $filePath;
}

<?php
/**
 * CORS Configuration
 * Cross-Origin Resource Sharing settings
 */

return [
    // Allowed origins (comma-separated in .env)
    'allowed_origins' => array_filter(
        array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', '*')))
    ),
    
    // Allowed HTTP methods
    'allowed_methods' => [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],
    
    // Allowed headers
    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-CSRF-Token',
        'X-Api-Key'
    ],
    
    // Headers exposed to the browser
    'exposed_headers' => [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset'
    ],
    
    // Allow credentials (cookies, authorization headers)
    'supports_credentials' => true,
    
    // Preflight cache duration (seconds)
    'max_age' => 86400 // 24 hours
];

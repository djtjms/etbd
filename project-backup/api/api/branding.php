<?php
/**
 * Branding Settings Endpoints
 * Handles company branding configuration
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Includes\Database;

$auth = new Auth();
$db = Database::getInstance();
$action = API_ACTION;

switch ($action) {
    case 'show':
        handleShow($db);
        break;
    case 'update':
        handleUpdate($db, $auth);
        break;
    default:
        Response::notFound('Action not found');
}

/**
 * Get branding settings
 */
function handleShow(Database $db): void {
    $branding = $db->fetch("SELECT * FROM branding_settings LIMIT 1");
    
    if (!$branding) {
        // Return defaults
        $branding = [
            'logo_text' => 'engineersTech',
            'tagline' => 'Enterprise Tech Solutions for the Future',
            'primary_color' => '#90FFA3',
            'company_email' => 'info@engineerstechbd.com',
            'company_phone' => '+880 1234-567890',
            'company_address' => 'Dhaka, Bangladesh',
            'facebook_url' => null,
            'twitter_url' => null,
            'linkedin_url' => null,
            'whatsapp_number' => null,
            'logo_url' => null
        ];
    }
    
    Response::success($branding);
}

/**
 * Update branding settings (admin only)
 */
function handleUpdate(Database $db, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $input = $GLOBALS['request']['input'];
    
    // Validate input
    $validator = Validator::make($input, [
        'logo_text' => 'nullable|string|max:50',
        'logo_url' => 'nullable|url',
        'tagline' => 'nullable|string|max:200',
        'primary_color' => 'nullable|string|max:20',
        'company_email' => 'nullable|email|max:255',
        'company_phone' => 'nullable|phone',
        'company_address' => 'nullable|string|max:500',
        'facebook_url' => 'nullable|url',
        'twitter_url' => 'nullable|url',
        'linkedin_url' => 'nullable|url',
        'whatsapp_number' => 'nullable|phone'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    // Get existing branding
    $existing = $db->fetch("SELECT id FROM branding_settings LIMIT 1");
    
    // Filter allowed fields
    $allowedFields = [
        'logo_text', 'logo_url', 'tagline', 'primary_color',
        'company_email', 'company_phone', 'company_address',
        'facebook_url', 'twitter_url', 'linkedin_url', 'whatsapp_number'
    ];
    
    $data = array_intersect_key($input, array_flip($allowedFields));
    
    if (empty($data)) {
        Response::badRequest('No valid fields to update');
    }
    
    $data['updated_at'] = date('Y-m-d H:i:s');
    
    if ($existing) {
        // Update existing
        $set = implode(' = ?, ', array_keys($data)) . ' = ?';
        $db->query(
            "UPDATE branding_settings SET $set WHERE id = ?",
            array_merge(array_values($data), [$existing['id']])
        );
    } else {
        // Insert new
        $data['id'] = bin2hex(random_bytes(16));
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $db->query(
            "INSERT INTO branding_settings ($columns) VALUES ($placeholders)",
            array_values($data)
        );
    }
    
    // Return updated branding
    $branding = $db->fetch("SELECT * FROM branding_settings LIMIT 1");
    
    Response::success($branding, 'Branding settings updated successfully');
}

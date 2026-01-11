<?php
/**
 * Testimonials Endpoints
 * Handles testimonial CRUD operations
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Models\Testimonial;

$auth = new Auth();
$testimonialModel = new Testimonial();
$action = API_ACTION;

switch ($action) {
    case 'index':
        handleIndex($testimonialModel, $auth);
        break;
    case 'featured':
        handleFeatured($testimonialModel);
        break;
    case 'store':
        handleStore($testimonialModel, $auth);
        break;
    case 'update':
        handleUpdate($testimonialModel, $auth);
        break;
    case 'destroy':
        handleDestroy($testimonialModel, $auth);
        break;
    default:
        Response::notFound('Action not found');
}

/**
 * List testimonials
 */
function handleIndex(Testimonial $testimonialModel, Auth $auth): void {
    $query = $GLOBALS['request']['query'];
    $page = (int) ($query['page'] ?? 1);
    $perPage = (int) ($query['per_page'] ?? 10);
    
    // Admin sees all, public sees featured only in listing
    if ($auth->isAdmin()) {
        $result = $testimonialModel->getAll($page, $perPage);
        
        // Include stats for admin
        $stats = $testimonialModel->getStats();
        
        Response::success([
            'items' => $result['items'],
            'pagination' => [
                'total' => $result['total'],
                'per_page' => $result['per_page'],
                'current_page' => $result['page'],
                'last_page' => $result['last_page']
            ],
            'stats' => $stats
        ]);
    } else {
        $testimonials = $testimonialModel->getFeatured(20);
        Response::success($testimonials);
    }
}

/**
 * Get featured testimonials
 */
function handleFeatured(Testimonial $testimonialModel): void {
    $query = $GLOBALS['request']['query'];
    $limit = min((int) ($query['limit'] ?? 6), 12);
    $random = isset($query['random']) && $query['random'] === 'true';
    
    if ($random) {
        $testimonials = $testimonialModel->getRandomFeatured($limit);
    } else {
        $testimonials = $testimonialModel->getFeatured($limit);
    }
    
    Response::success($testimonials);
}

/**
 * Create testimonial (admin only)
 */
function handleStore(Testimonial $testimonialModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $input = $GLOBALS['request']['input'];
    
    // Validate input
    $validator = Validator::make($input, [
        'client_name' => 'required|string|min:2|max:100',
        'client_company' => 'nullable|string|max:100',
        'client_position' => 'nullable|string|max:100',
        'client_avatar' => 'nullable|url',
        'review' => 'required|string|min:10|max:1000',
        'rating' => 'nullable|integer|min:1|max:5',
        'is_featured' => 'nullable|boolean'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    $testimonial = $testimonialModel->create($input);
    
    if (!$testimonial) {
        Response::serverError('Failed to create testimonial');
    }
    
    Response::created($testimonial, 'Testimonial created successfully');
}

/**
 * Update testimonial (admin only)
 */
function handleUpdate(Testimonial $testimonialModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    $input = $GLOBALS['request']['input'];
    
    // Check if testimonial exists
    $existing = $testimonialModel->find($id);
    if (!$existing) {
        Response::notFound('Testimonial not found');
    }
    
    // Validate input
    $validator = Validator::make($input, [
        'client_name' => 'nullable|string|min:2|max:100',
        'client_company' => 'nullable|string|max:100',
        'client_position' => 'nullable|string|max:100',
        'client_avatar' => 'nullable|url',
        'review' => 'nullable|string|min:10|max:1000',
        'rating' => 'nullable|integer|min:1|max:5',
        'is_featured' => 'nullable|boolean'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    $testimonial = $testimonialModel->update($id, $input);
    
    if (!$testimonial) {
        Response::serverError('Failed to update testimonial');
    }
    
    Response::success($testimonial, 'Testimonial updated successfully');
}

/**
 * Delete testimonial (admin only)
 */
function handleDestroy(Testimonial $testimonialModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    
    // Check if testimonial exists
    $existing = $testimonialModel->find($id);
    if (!$existing) {
        Response::notFound('Testimonial not found');
    }
    
    $deleted = $testimonialModel->delete($id);
    
    if (!$deleted) {
        Response::serverError('Failed to delete testimonial');
    }
    
    Response::success(null, 'Testimonial deleted successfully');
}

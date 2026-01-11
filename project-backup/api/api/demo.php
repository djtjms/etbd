<?php
/**
 * Demo Project Endpoints
 * Handles demo project CRUD operations
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Models\DemoProject;

$auth = new Auth();
$demoModel = new DemoProject();
$action = API_ACTION;

switch ($action) {
    case 'index':
        handleIndex($demoModel, $auth);
        break;
    case 'featured':
        handleFeatured($demoModel);
        break;
    case 'show':
        handleShow($demoModel, $auth);
        break;
    case 'store':
        handleStore($demoModel, $auth);
        break;
    case 'update':
        handleUpdate($demoModel, $auth);
        break;
    case 'destroy':
        handleDestroy($demoModel, $auth);
        break;
    default:
        Response::notFound('Action not found');
}

/**
 * List demo projects
 */
function handleIndex(DemoProject $demoModel, Auth $auth): void {
    $query = $GLOBALS['request']['query'];
    $page = (int) ($query['page'] ?? 1);
    $perPage = (int) ($query['per_page'] ?? 12);
    $type = $query['type'] ?? null;
    
    // Admin can see all demos, public only sees published
    if ($auth->isAdmin()) {
        $status = $query['status'] ?? null;
        $conditions = [];
        if ($status) $conditions['status'] = $status;
        if ($type) $conditions['project_type'] = $type;
        
        $result = $demoModel->paginate($page, $perPage, $conditions, ['created_at' => 'DESC']);
    } else {
        if ($type) {
            $result = $demoModel->getByType($type, $page, $perPage);
        } else {
            $result = $demoModel->getPublished($page, $perPage);
        }
    }
    
    // Decode JSON fields
    foreach ($result['items'] as &$item) {
        $item['technologies'] = json_decode($item['technologies'] ?? '[]', true) ?: [];
        $item['screenshots'] = json_decode($item['screenshots'] ?? '[]', true) ?: [];
    }
    
    // Include type counts for filtering
    $typeCounts = $demoModel->getTypeCounts();
    
    Response::success([
        'items' => $result['items'],
        'pagination' => [
            'total' => $result['total'],
            'per_page' => $result['per_page'],
            'current_page' => $result['page'],
            'last_page' => $result['last_page']
        ],
        'types' => $typeCounts
    ]);
}

/**
 * Get featured demo projects
 */
function handleFeatured(DemoProject $demoModel): void {
    $query = $GLOBALS['request']['query'];
    $limit = min((int) ($query['limit'] ?? 6), 12);
    
    $demos = $demoModel->getFeatured($limit);
    
    // Decode JSON fields
    foreach ($demos as &$demo) {
        $demo['technologies'] = json_decode($demo['technologies'] ?? '[]', true) ?: [];
        $demo['screenshots'] = json_decode($demo['screenshots'] ?? '[]', true) ?: [];
    }
    
    Response::success($demos);
}

/**
 * Get single demo project by slug
 */
function handleShow(DemoProject $demoModel, Auth $auth): void {
    $slug = $GLOBALS['request']['params']['slug'] ?? '';
    
    $demo = $demoModel->findBySlug($slug, !$auth->isAdmin());
    
    if (!$demo) {
        Response::notFound('Demo project not found');
    }
    
    // Increment view count for published demos
    if ($demo['status'] === 'published') {
        $demoModel->incrementViews($demo['id']);
    }
    
    // Hide credentials from non-admins
    if (!$auth->isAdmin() && isset($demo['credentials'])) {
        unset($demo['credentials']);
    }
    
    Response::success($demo);
}

/**
 * Create demo project (admin only)
 */
function handleStore(DemoProject $demoModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $input = $GLOBALS['request']['input'];
    
    // Validate input
    $validator = Validator::make($input, [
        'title' => 'required|string|min:3|max:200',
        'slug' => 'nullable|slug|max:200',
        'description' => 'nullable|string|max:2000',
        'demo_url' => 'nullable|url',
        'thumbnail' => 'nullable|url',
        'screenshots' => 'nullable|array',
        'project_type' => 'nullable|in:website,mobile,desktop,other',
        'technologies' => 'nullable|array',
        'status' => 'nullable|in:draft,published',
        'is_featured' => 'nullable|boolean',
        'preview_mode' => 'nullable|in:screenshot,iframe,video',
        'allow_interaction' => 'nullable|boolean'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    $demo = $demoModel->create($input);
    
    if (!$demo) {
        Response::serverError('Failed to create demo project');
    }
    
    // Save credentials if provided
    if (!empty($input['credentials'])) {
        $demoModel->saveCredentials($demo['id'], $input['credentials']);
    }
    
    Response::created($demo, 'Demo project created successfully');
}

/**
 * Update demo project (admin only)
 */
function handleUpdate(DemoProject $demoModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    $input = $GLOBALS['request']['input'];
    
    // Check if demo exists
    $existing = $demoModel->find($id);
    if (!$existing) {
        Response::notFound('Demo project not found');
    }
    
    // Validate input
    $validator = Validator::make($input, [
        'title' => 'nullable|string|min:3|max:200',
        'slug' => 'nullable|slug|max:200',
        'description' => 'nullable|string|max:2000',
        'demo_url' => 'nullable|url',
        'thumbnail' => 'nullable|url',
        'screenshots' => 'nullable|array',
        'project_type' => 'nullable|in:website,mobile,desktop,other',
        'technologies' => 'nullable|array',
        'status' => 'nullable|in:draft,published',
        'is_featured' => 'nullable|boolean',
        'preview_mode' => 'nullable|in:screenshot,iframe,video',
        'allow_interaction' => 'nullable|boolean'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    $demo = $demoModel->update($id, $input);
    
    if (!$demo) {
        Response::serverError('Failed to update demo project');
    }
    
    // Update credentials if provided
    if (isset($input['credentials'])) {
        $demoModel->saveCredentials($id, $input['credentials']);
    }
    
    Response::success($demo, 'Demo project updated successfully');
}

/**
 * Delete demo project (admin only)
 */
function handleDestroy(DemoProject $demoModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    
    // Check if demo exists
    $existing = $demoModel->find($id);
    if (!$existing) {
        Response::notFound('Demo project not found');
    }
    
    $deleted = $demoModel->delete($id);
    
    if (!$deleted) {
        Response::serverError('Failed to delete demo project');
    }
    
    Response::success(null, 'Demo project deleted successfully');
}

<?php
/**
 * Blog Endpoints
 * Handles blog post CRUD operations
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Models\BlogPost;

$auth = new Auth();
$blogModel = new BlogPost();
$action = API_ACTION;

switch ($action) {
    case 'index':
        handleIndex($blogModel, $auth);
        break;
    case 'show':
        handleShow($blogModel, $auth);
        break;
    case 'store':
        handleStore($blogModel, $auth);
        break;
    case 'update':
        handleUpdate($blogModel, $auth);
        break;
    case 'destroy':
        handleDestroy($blogModel, $auth);
        break;
    default:
        Response::notFound('Action not found');
}

/**
 * List blog posts
 */
function handleIndex(BlogPost $blogModel, Auth $auth): void {
    $query = $GLOBALS['request']['query'];
    $page = (int) ($query['page'] ?? 1);
    $perPage = (int) ($query['per_page'] ?? 10);
    
    // Admin can see all posts, public only sees published
    if ($auth->isAdmin()) {
        $status = $query['status'] ?? null;
        $conditions = $status ? ['status' => $status] : [];
        $result = $blogModel->paginate($page, $perPage, $conditions, ['created_at' => 'DESC']);
    } else {
        $result = $blogModel->getPublished($page, $perPage);
    }
    
    Response::paginated(
        $result['items'],
        $result['total'],
        $result['page'],
        $result['per_page']
    );
}

/**
 * Get single blog post by slug
 */
function handleShow(BlogPost $blogModel, Auth $auth): void {
    $slug = $GLOBALS['request']['params']['slug'] ?? '';
    
    $post = $blogModel->findBySlug($slug, !$auth->isAdmin());
    
    if (!$post) {
        Response::notFound('Blog post not found');
    }
    
    // Get related posts
    $post['related'] = $blogModel->getRelated($post['id'], 3);
    
    Response::success($post);
}

/**
 * Create blog post (admin only)
 */
function handleStore(BlogPost $blogModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $input = $GLOBALS['request']['input'];
    
    // Validate input
    $validator = Validator::make($input, [
        'title' => 'required|string|min:3|max:200',
        'slug' => 'nullable|slug|max:200',
        'excerpt' => 'nullable|string|max:500',
        'content' => 'nullable|string',
        'featured_image' => 'nullable|url',
        'status' => 'nullable|in:draft,published',
        'seo_title' => 'nullable|string|max:60',
        'seo_description' => 'nullable|string|max:160',
        'seo_keywords' => 'nullable|array'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    // Add author
    $user = $auth->user();
    $input['author_id'] = $user['id'];
    
    $post = $blogModel->create($input);
    
    if (!$post) {
        Response::serverError('Failed to create blog post');
    }
    
    Response::created($post, 'Blog post created successfully');
}

/**
 * Update blog post (admin only)
 */
function handleUpdate(BlogPost $blogModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    $input = $GLOBALS['request']['input'];
    
    // Check if post exists
    $existing = $blogModel->find($id);
    if (!$existing) {
        Response::notFound('Blog post not found');
    }
    
    // Validate input
    $validator = Validator::make($input, [
        'title' => 'nullable|string|min:3|max:200',
        'slug' => 'nullable|slug|max:200',
        'excerpt' => 'nullable|string|max:500',
        'content' => 'nullable|string',
        'featured_image' => 'nullable|url',
        'status' => 'nullable|in:draft,published',
        'seo_title' => 'nullable|string|max:60',
        'seo_description' => 'nullable|string|max:160',
        'seo_keywords' => 'nullable|array'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    $post = $blogModel->update($id, $input);
    
    if (!$post) {
        Response::serverError('Failed to update blog post');
    }
    
    Response::success($post, 'Blog post updated successfully');
}

/**
 * Delete blog post (admin only)
 */
function handleDestroy(BlogPost $blogModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    
    // Check if post exists
    $existing = $blogModel->find($id);
    if (!$existing) {
        Response::notFound('Blog post not found');
    }
    
    $deleted = $blogModel->delete($id);
    
    if (!$deleted) {
        Response::serverError('Failed to delete blog post');
    }
    
    Response::success(null, 'Blog post deleted successfully');
}

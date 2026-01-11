<?php
/**
 * Contact Form Endpoints
 * Handles contact form submissions
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Includes\RateLimiter;
use App\Models\ContactSubmission;

$auth = new Auth();
$contactModel = new ContactSubmission();
$action = API_ACTION;

switch ($action) {
    case 'index':
        handleIndex($contactModel, $auth);
        break;
    case 'show':
        handleShow($contactModel, $auth);
        break;
    case 'store':
        handleStore($contactModel);
        break;
    case 'markRead':
        handleMarkRead($contactModel, $auth);
        break;
    case 'destroy':
        handleDestroy($contactModel, $auth);
        break;
    default:
        Response::notFound('Action not found');
}

/**
 * List contact submissions (admin only)
 */
function handleIndex(ContactSubmission $contactModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $query = $GLOBALS['request']['query'];
    $page = (int) ($query['page'] ?? 1);
    $perPage = (int) ($query['per_page'] ?? 20);
    $unreadOnly = isset($query['unread']) && $query['unread'] === 'true';
    
    if ($unreadOnly) {
        $result = $contactModel->paginate($page, $perPage, ['is_read' => 0], ['created_at' => 'DESC']);
    } else {
        $result = $contactModel->paginate($page, $perPage, [], ['created_at' => 'DESC']);
    }
    
    // Include stats
    $stats = $contactModel->getStats();
    
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
}

/**
 * Get single contact submission (admin only)
 */
function handleShow(ContactSubmission $contactModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    
    $submission = $contactModel->find($id);
    
    if (!$submission) {
        Response::notFound('Contact submission not found');
    }
    
    Response::success($submission);
}

/**
 * Submit contact form (public)
 */
function handleStore(ContactSubmission $contactModel): void {
    // Rate limit contact form submissions
    $rateLimiter = new RateLimiter(5, 3600); // 5 submissions per hour
    if (!$rateLimiter->check('contact:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
        Response::tooManyRequests('Too many submissions. Please try again later.');
    }
    
    $input = $GLOBALS['request']['input'];
    
    // Validate input
    $validator = Validator::make($input, [
        'name' => 'required|string|min:2|max:100',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|phone',
        'subject' => 'nullable|string|max:200',
        'message' => 'required|string|min:10|max:5000'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    // Check for spam (simple honeypot)
    if (!empty($input['website']) || !empty($input['url'])) {
        // Silently reject spam
        Response::success(null, 'Thank you for your message. We will get back to you soon.');
    }
    
    $submission = $contactModel->create($input);
    
    if (!$submission) {
        Response::serverError('Failed to submit contact form');
    }
    
    // TODO: Send notification email to admin
    
    Response::created([
        'id' => $submission['id']
    ], 'Thank you for your message. We will get back to you soon.');
}

/**
 * Mark submission as read (admin only)
 */
function handleMarkRead(ContactSubmission $contactModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    
    $submission = $contactModel->find($id);
    
    if (!$submission) {
        Response::notFound('Contact submission not found');
    }
    
    $updated = $contactModel->markAsRead($id);
    
    Response::success($updated, 'Marked as read');
}

/**
 * Delete submission (admin only)
 */
function handleDestroy(ContactSubmission $contactModel, Auth $auth): void {
    // Require admin
    if (!$auth->isAdmin()) {
        Response::forbidden('Admin access required');
    }
    
    $id = $GLOBALS['request']['params']['id'] ?? '';
    
    $submission = $contactModel->find($id);
    
    if (!$submission) {
        Response::notFound('Contact submission not found');
    }
    
    $deleted = $contactModel->delete($id);
    
    if (!$deleted) {
        Response::serverError('Failed to delete submission');
    }
    
    Response::success(null, 'Submission deleted successfully');
}

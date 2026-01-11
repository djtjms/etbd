<?php
/**
 * Consultation Endpoints
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Includes\RateLimiter;
use App\Models\ConsultationRequest;

$auth = new Auth();
$model = new ConsultationRequest();
$action = API_ACTION;

switch ($action) {
    case 'index':
        if (!$auth->isAdmin()) Response::forbidden('Admin access required');
        $query = $GLOBALS['request']['query'];
        $page = (int) ($query['page'] ?? 1);
        $perPage = (int) ($query['per_page'] ?? 20);
        $result = $model->paginate($page, $perPage, [], ['created_at' => 'DESC']);
        Response::paginated($result['items'], $result['total'], $result['page'], $result['per_page']);
        break;
        
    case 'store':
        $rateLimiter = new RateLimiter(5, 3600);
        if (!$rateLimiter->check('consultation:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
            Response::tooManyRequests('Too many requests. Please try again later.');
        }
        
        $input = $GLOBALS['request']['input'];
        $validator = Validator::make($input, [
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|phone',
            'interested_project' => 'nullable|string|max:200',
            'message' => 'nullable|string|max:2000'
        ]);
        
        if ($validator->fails()) {
            Response::unprocessable('Validation failed', $validator->errors());
        }
        
        $submission = $model->create($input);
        Response::created(['id' => $submission['id']], 'Consultation request submitted successfully');
        break;
        
    case 'markRead':
        if (!$auth->isAdmin()) Response::forbidden('Admin access required');
        $id = $GLOBALS['request']['params']['id'] ?? '';
        $result = $model->markAsRead($id);
        Response::success($result, 'Marked as read');
        break;
        
    case 'destroy':
        if (!$auth->isAdmin()) Response::forbidden('Admin access required');
        $id = $GLOBALS['request']['params']['id'] ?? '';
        $model->delete($id);
        Response::success(null, 'Deleted successfully');
        break;
        
    default:
        Response::notFound('Action not found');
}

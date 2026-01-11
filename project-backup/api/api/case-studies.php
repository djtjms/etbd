<?php
/**
 * Case Studies Endpoints
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Models\CaseStudy;

$auth = new Auth();
$model = new CaseStudy();
$action = API_ACTION;

switch ($action) {
    case 'index':
        $query = $GLOBALS['request']['query'];
        $page = (int) ($query['page'] ?? 1);
        $perPage = (int) ($query['per_page'] ?? 10);
        
        if ($auth->isAdmin()) {
            $result = $model->paginate($page, $perPage, [], ['created_at' => 'DESC']);
        } else {
            $result = $model->getPublished($page, $perPage);
        }
        
        Response::paginated($result['items'], $result['total'], $result['page'], $result['per_page']);
        break;
        
    case 'show':
        $slug = $GLOBALS['request']['params']['slug'] ?? '';
        $study = $model->findBySlug($slug, !$auth->isAdmin());
        
        if (!$study) Response::notFound('Case study not found');
        Response::success($study);
        break;
        
    case 'store':
        if (!$auth->isAdmin()) Response::forbidden('Admin access required');
        
        $input = $GLOBALS['request']['input'];
        $validator = Validator::make($input, [
            'title' => 'required|string|min:3|max:200',
            'client_name' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'results' => 'nullable|string',
            'technologies' => 'nullable|array',
            'featured_image' => 'nullable|url',
            'status' => 'nullable|in:draft,published'
        ]);
        
        if ($validator->fails()) {
            Response::unprocessable('Validation failed', $validator->errors());
        }
        
        $study = $model->create($input);
        Response::created($study, 'Case study created');
        break;
        
    case 'update':
        if (!$auth->isAdmin()) Response::forbidden('Admin access required');
        
        $id = $GLOBALS['request']['params']['id'] ?? '';
        $input = $GLOBALS['request']['input'];
        
        $study = $model->update($id, $input);
        if (!$study) Response::notFound('Case study not found');
        
        Response::success($study, 'Case study updated');
        break;
        
    case 'destroy':
        if (!$auth->isAdmin()) Response::forbidden('Admin access required');
        
        $id = $GLOBALS['request']['params']['id'] ?? '';
        $model->delete($id);
        Response::success(null, 'Case study deleted');
        break;
        
    default:
        Response::notFound('Action not found');
}

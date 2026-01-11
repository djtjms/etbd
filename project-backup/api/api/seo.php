<?php
/**
 * SEO Settings Endpoints
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Models\SeoSettings;

$auth = new Auth();
$model = new SeoSettings();
$action = API_ACTION;

switch ($action) {
    case 'index':
        $settings = $model->getAllSettings();
        Response::success($settings);
        break;
        
    case 'show':
        $pageName = $GLOBALS['request']['params']['page'] ?? '';
        $settings = $model->getByPage($pageName);
        
        if (!$settings) {
            Response::success([
                'page_name' => $pageName,
                'meta_title' => null,
                'meta_description' => null,
                'meta_keywords' => [],
                'og_image' => null
            ]);
        }
        
        Response::success($settings);
        break;
        
    case 'update':
        if (!$auth->isAdmin()) Response::forbidden('Admin access required');
        
        $pageName = $GLOBALS['request']['params']['page'] ?? '';
        $input = $GLOBALS['request']['input'];
        
        $validator = Validator::make($input, [
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|array',
            'og_image' => 'nullable|url'
        ]);
        
        if ($validator->fails()) {
            Response::unprocessable('Validation failed', $validator->errors());
        }
        
        $result = $model->upsert($pageName, $input);
        Response::success($result, 'SEO settings updated');
        break;
        
    default:
        Response::notFound('Action not found');
}

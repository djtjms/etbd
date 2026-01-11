<?php
/**
 * JSON Response Helper
 * Standardized API response formatting
 */

namespace App\Includes;

class Response {
    /**
     * Send success response
     */
    public static function success($data = null, string $message = 'Success', int $statusCode = 200): void {
        self::send([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }
    
    /**
     * Send created response (201)
     */
    public static function created($data = null, string $message = 'Created successfully'): void {
        self::success($data, $message, 201);
    }
    
    /**
     * Send no content response (204)
     */
    public static function noContent(): void {
        http_response_code(204);
        exit;
    }
    
    /**
     * Send error response
     */
    public static function error(string $message, int $statusCode = 400, $errors = null): void {
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        self::send($response, $statusCode);
    }
    
    /**
     * Send bad request error (400)
     */
    public static function badRequest(string $message = 'Bad request', $errors = null): void {
        self::error($message, 400, $errors);
    }
    
    /**
     * Send unauthorized error (401)
     */
    public static function unauthorized(string $message = 'Unauthorized'): void {
        self::error($message, 401);
    }
    
    /**
     * Send forbidden error (403)
     */
    public static function forbidden(string $message = 'Forbidden'): void {
        self::error($message, 403);
    }
    
    /**
     * Send not found error (404)
     */
    public static function notFound(string $message = 'Resource not found'): void {
        self::error($message, 404);
    }
    
    /**
     * Send method not allowed error (405)
     */
    public static function methodNotAllowed(string $message = 'Method not allowed'): void {
        self::error($message, 405);
    }
    
    /**
     * Send conflict error (409)
     */
    public static function conflict(string $message = 'Resource conflict'): void {
        self::error($message, 409);
    }
    
    /**
     * Send unprocessable entity error (422)
     */
    public static function unprocessable(string $message = 'Validation failed', $errors = null): void {
        self::error($message, 422, $errors);
    }
    
    /**
     * Send too many requests error (429)
     */
    public static function tooManyRequests(string $message = 'Too many requests'): void {
        self::error($message, 429);
    }
    
    /**
     * Send internal server error (500)
     */
    public static function serverError(string $message = 'Internal server error'): void {
        self::error($message, 500);
    }
    
    /**
     * Send paginated response
     */
    public static function paginated(array $data, int $total, int $page, int $perPage): void {
        $lastPage = ceil($total / $perPage);
        
        self::success([
            'items' => $data,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => $lastPage,
                'from' => ($page - 1) * $perPage + 1,
                'to' => min($page * $perPage, $total)
            ]
        ]);
    }
    
    /**
     * Send JSON response
     */
    private static function send(array $data, int $statusCode): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

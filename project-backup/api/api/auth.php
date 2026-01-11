<?php
/**
 * Authentication Endpoints
 * Handles login, register, logout, token refresh
 */

use App\Includes\Auth;
use App\Includes\Response;
use App\Includes\Validator;
use App\Includes\RateLimiter;
use App\Models\User;

$auth = new Auth();
$userModel = new User();
$action = API_ACTION;

switch ($action) {
    case 'login':
        handleLogin($auth);
        break;
    case 'register':
        handleRegister($auth, $userModel);
        break;
    case 'logout':
        handleLogout($auth);
        break;
    case 'refresh':
        handleRefresh($auth);
        break;
    case 'me':
        handleMe($auth);
        break;
    default:
        Response::notFound('Action not found');
}

/**
 * Handle user login
 */
function handleLogin(Auth $auth): void {
    $input = $GLOBALS['request']['input'];
    
    // Rate limit login attempts
    $rateLimiter = new RateLimiter(5, 300); // 5 attempts per 5 minutes
    if (!$rateLimiter->check('login:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
        Response::tooManyRequests('Too many login attempts. Please try again later.');
    }
    
    // Validate input
    $validator = Validator::make($input, [
        'email' => 'required|email|max:255',
        'password' => 'required|string|min:6'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    $result = $auth->login($input['email'], $input['password']);
    
    if (!$result) {
        Response::unauthorized('Invalid email or password');
    }
    
    Response::success($result, 'Login successful');
}

/**
 * Handle user registration
 */
function handleRegister(Auth $auth, User $userModel): void {
    $input = $GLOBALS['request']['input'];
    
    // Rate limit registrations
    $rateLimiter = new RateLimiter(3, 3600); // 3 registrations per hour
    if (!$rateLimiter->check('register:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
        Response::tooManyRequests('Too many registration attempts. Please try again later.');
    }
    
    // Validate input
    $validator = Validator::make($input, [
        'email' => 'required|email|max:255',
        'password' => 'required|string|min:8|max:128',
        'password_confirmation' => 'required|string',
        'full_name' => 'nullable|string|max:100'
    ]);
    
    if ($validator->fails()) {
        Response::unprocessable('Validation failed', $validator->errors());
    }
    
    // Check password confirmation
    if ($input['password'] !== $input['password_confirmation']) {
        Response::unprocessable('Validation failed', ['password' => ['Passwords do not match']]);
    }
    
    // Check if email exists
    if ($userModel->findByEmail($input['email'])) {
        Response::conflict('Email already registered');
    }
    
    try {
        $result = $userModel->createWithRole([
            'email' => $input['email'],
            'password' => $input['password'],
            'full_name' => $input['full_name'] ?? null
        ], 'user');
        
        if (!$result) {
            Response::serverError('Registration failed');
        }
        
        // Auto login after registration
        $loginResult = $auth->login($input['email'], $input['password']);
        
        Response::created($loginResult, 'Registration successful');
        
    } catch (Exception $e) {
        if (APP_DEBUG) {
            Response::serverError($e->getMessage());
        }
        Response::serverError('Registration failed');
    }
}

/**
 * Handle user logout
 */
function handleLogout(Auth $auth): void {
    if (!$auth->check()) {
        Response::unauthorized('Not authenticated');
    }
    
    $auth->logout();
    
    Response::success(null, 'Logged out successfully');
}

/**
 * Handle token refresh
 */
function handleRefresh(Auth $auth): void {
    $input = $GLOBALS['request']['input'];
    
    if (empty($input['refresh_token'])) {
        Response::badRequest('Refresh token is required');
    }
    
    $result = $auth->refresh($input['refresh_token']);
    
    if (!$result) {
        Response::unauthorized('Invalid or expired refresh token');
    }
    
    Response::success($result, 'Token refreshed successfully');
}

/**
 * Get current authenticated user
 */
function handleMe(Auth $auth): void {
    $user = $auth->user();
    
    if (!$user) {
        Response::unauthorized('Not authenticated');
    }
    
    // Remove sensitive fields
    unset($user['password']);
    
    Response::success($user);
}

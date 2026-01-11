<?php
/**
 * File Upload Endpoint
 */

use App\Includes\Auth;
use App\Includes\Response;

$auth = new Auth();

// Require authentication for uploads
if (!$auth->check()) {
    Response::unauthorized('Authentication required');
}

// Check if file was uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds server limit',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds form limit',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file',
        UPLOAD_ERR_EXTENSION => 'Upload blocked by extension'
    ];
    
    $error = $_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE;
    Response::badRequest($errorMessages[$error] ?? 'File upload failed');
}

$file = $_FILES['file'];

// Validate file size
if ($file['size'] > UPLOAD_MAX_SIZE) {
    Response::badRequest('File size exceeds limit of ' . (UPLOAD_MAX_SIZE / 1024 / 1024) . 'MB');
}

// Validate file type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, UPLOAD_ALLOWED_TYPES)) {
    Response::badRequest('File type not allowed. Allowed types: ' . implode(', ', UPLOAD_ALLOWED_TYPES));
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = bin2hex(random_bytes(16)) . '.' . strtolower($extension);

// Create upload directory if not exists
$uploadDir = UPLOAD_DIR . '/' . date('Y/m');
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$destination = $uploadDir . '/' . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    Response::serverError('Failed to save file');
}

// Generate URL
$relativePath = str_replace(API_ROOT, '', $destination);
$url = rtrim(APP_URL, '/') . '/api' . $relativePath;

Response::success([
    'url' => $url,
    'filename' => $filename,
    'size' => $file['size'],
    'mime_type' => $mimeType
], 'File uploaded successfully');

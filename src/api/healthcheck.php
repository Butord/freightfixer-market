
<?php
// Simple health check endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Get detailed server info
$server_info = [];
foreach ($_SERVER as $key => $value) {
    if (!is_array($value)) {
        $server_info[$key] = $value;
    }
}

// Indicate that the API is running
echo json_encode([
    'status' => 'ok',
    'message' => 'API server is running',
    'time' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server_info' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
    'http_host' => $_SERVER['HTTP_HOST'] ?? 'unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'environment' => [
        'CORS_ALLOW_ORIGIN' => getenv('CORS_ALLOW_ORIGIN') ?: 'not set',
        'SERVER_PORT' => getenv('SERVER_PORT') ?: 'not set'
    ]
]);

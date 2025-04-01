
<?php
// Simple health check endpoint
header('Content-Type: application/json');

// Indicate that the API is running
echo json_encode([
    'status' => 'ok',
    'message' => 'API server is running',
    'time' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server_info' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
]);

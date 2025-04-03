
<?php
// Файл для обробки CORS заголовків

// Отримати значення дозволеного origin з запиту
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Встановити заголовки CORS і типу вмісту
header('Content-Type: application/json');

// Set the specific origin that was received in the request
if (!empty($origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // If no origin header was provided, we'll use a default for local development
    header("Access-Control-Allow-Origin: http://localhost:8080");
}

// Always set credentials header
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Immediately respond to preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

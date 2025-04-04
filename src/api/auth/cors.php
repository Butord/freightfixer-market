
<?php
// Файл для обробки CORS заголовків

// Отримати значення дозволеного origin з запиту
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Встановити заголовки CORS і типу вмісту
header('Content-Type: application/json');

// Встановлюємо конкретний origin, який був отриманий у запиті
if (!empty($origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Якщо заголовок origin не надано, використовуємо значення за замовчуванням для локальної розробки
    header("Access-Control-Allow-Origin: http://localhost:8080");
}

// Завжди встановлюємо заголовок credentials
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Негайно відповідаємо на preflight запити
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

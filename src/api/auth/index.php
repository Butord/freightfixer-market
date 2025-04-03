
<?php
// Включити детальне журналювання помилок для налагодження
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_log("Auth request received: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

// Підключення файлів конфігурації
require_once __DIR__ . '/../db_config.php';
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/handlers.php';

// Завантажити конфіг з admin_secret_code
$config = require_once __DIR__ . '/../config.php';
error_log("Config loaded, secret code available: " . (isset($config['admin_secret_code']) ? "yes" : "no"));

// Отримати дію з URL
$action = isset($_GET['action']) ? $_GET['action'] : '';
error_log("Auth action: $action");

// Обробка різних дій аутентифікації
switch ($action) {
    case 'register':
        handleRegister($conn, $config);
        break;
    case 'login':
        handleLogin($conn);
        break;
    case 'me':
        getCurrentUser($conn);
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        break;
}

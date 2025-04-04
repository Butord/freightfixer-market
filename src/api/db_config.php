
<?php
// Включити обробку CORS
require_once __DIR__ . '/auth/cors.php';

// Включити журналювання помилок
ini_set('display_errors', 0);  // Вимкнено для продакшн
ini_set('log_errors', 1);
error_log("DB Connection attempt started");

// Функція для визначення шляху до конфігураційного файлу
function getConfigFilePath() {
    // Перевірка наявності локального файлу конфігурації
    $localConfigFile = __DIR__ . '/../../secrets/db_config.php';
    if (file_exists($localConfigFile)) {
        return $localConfigFile;
    }
    
    // Перевірка наявності файлу конфігурації за межами public_html
    // Типовий сценарій для шаред хостингу
    $parentDir = dirname(dirname(dirname(__FILE__)));
    $outsideConfigFile = $parentDir . '/db_config.php';
    if (file_exists($outsideConfigFile)) {
        return $outsideConfigFile;
    }
    
    // Повернути NULL, якщо файл конфігурації не знайдено
    return null;
}

// Спробувати отримати конфігурацію бази даних
$host = getenv('DB_HOST') ?: 'localhost';  // На шаред хостингу зазвичай localhost
$db = getenv('DB_NAME') ?: 'your_database';
$user = getenv('DB_USER') ?: '';
$pass = getenv('DB_PASS') ?: '';
$charset = 'utf8mb4';
$uploadDir = __DIR__ . '/uploads/';

// Завантаження конфігурації з файлу, якщо він існує
$configFile = getConfigFilePath();
if ($configFile !== null) {
    $dbConfig = require $configFile;
    if (is_array($dbConfig)) {
        if (isset($dbConfig['host'])) $host = $dbConfig['host'];
        if (isset($dbConfig['db'])) $db = $dbConfig['db'];
        if (isset($dbConfig['user'])) $user = $dbConfig['user'];
        if (isset($dbConfig['pass'])) $pass = $dbConfig['pass'];
    }
    error_log("Loaded database configuration from file: $configFile");
}

// Переконатися, що директорія для завантаження існує
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
    error_log("Created uploads directory: $uploadDir");
}

// Перевірити чи можемо ми з'єднатися з базою даних
try {
    // Журналювати спробу з'єднання без розкриття облікових даних
    error_log("Attempting to connect to MySQL: host=$host, db=$db, user=$user");
    
    // Для з'єднання mysqli
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        error_log("DB Connection failed: " . $conn->connect_error);
        // Не виходимо тут - дозволяємо скрипту продовжувати і елегантно обробляти помилку
    } else {
        error_log("DB Connection successful");
        // Встановити набір символів
        $conn->set_charset($charset);
    }
    
    // Для з'єднання PDO, якщо потрібно пізніше
    try {
        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, $user, $pass, $options);
        error_log("PDO connection successful");
        
        // Повернути з'єднання PDO для використання в інших файлах
        return $pdo;
        
    } catch (\PDOException $e) {
        // Повідомляти про помилки PDO тільки якщо запитується
        error_log("PDO Connection error: " . $e->getMessage());
        // Нам все ще потрібно повернути з'єднання mysqli, якщо PDO не вдається
        return $conn;
    }
} catch (Exception $e) {
    error_log("General exception during DB connection: " . $e->getMessage());
    
    // Відправити помилку у форматі JSON для узгодженості API, але без розкриття чутливої інформації
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please contact administrator.'
    ]);
    exit;
}

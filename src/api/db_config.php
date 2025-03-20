
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// If this is an OPTIONS request, respond with 200 Success
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Enable error logging
ini_set('display_errors', 1);  // Увімкнено для показу помилок (змініть на 0 в продакшн)
ini_set('log_errors', 1);
error_log("DB Connection attempt started");

// Database configuration
$host = 'localhost';
$db   = 'your_database';  // Змініть на реальну назву бази даних
$user = 'your_username';  // Змініть на реальне ім'я користувача
$pass = 'your_password';  // Змініть на реальний пароль
$charset = 'utf8mb4';
$uploadDir = __DIR__ . '/uploads/';

// Make sure upload directory exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
    error_log("Created uploads directory: $uploadDir");
}

// Test if we can connect to the database
try {
    // Виводимо інформацію про спробу підключення
    error_log("Attempting to connect to MySQL: host=$host, db=$db, user=$user");
    
    // For mysqli connection
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        error_log("DB Connection failed: " . $conn->connect_error);
        // Don't exit here - let the script continue and handle the error gracefully
    } else {
        error_log("DB Connection successful");
        // Set character set
        $conn->set_charset($charset);
    }
    
    // For PDO connection if needed later
    try {
        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, $user, $pass, $options);
        error_log("PDO connection successful");
        
        // Return the PDO connection for use in other files
        return $pdo;
        
    } catch (\PDOException $e) {
        // Only report PDO errors if requested
        error_log("PDO Connection error: " . $e->getMessage());
        // We still need to return the mysqli connection if PDO fails
        return $conn;
    }
} catch (Exception $e) {
    error_log("General exception during DB connection: " . $e->getMessage());
    
    // Send detailed error information for debugging (disable in production)
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

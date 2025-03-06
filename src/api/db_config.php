
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
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log("DB Connection attempt started");

$host = 'localhost';
$db   = 'your_database';
$user = 'your_username';
$pass = 'your_password';
$charset = 'utf8mb4';
$uploadDir = __DIR__ . '/uploads/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// For mysqli connection
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    error_log("DB Connection failed: " . $conn->connect_error);
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

error_log("DB Connection successful");

// Set character set
$conn->set_charset($charset);

// For PDO connection if needed later
try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, $user, $pass, $options);
    
} catch (\PDOException $e) {
    // Only report PDO errors if requested
    error_log("PDO Connection error: " . $e->getMessage());
    // We don't exit here as we're using mysqli as the primary connection
}

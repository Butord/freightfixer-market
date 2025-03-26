
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
ini_set('display_errors', 0);  // Вимкнено для продакшн (змінено з 1)
ini_set('log_errors', 1);
error_log("DB Connection attempt started");

// Try to get database configuration from environment variables
$host = getenv('DB_HOST') ?: 'localhost';
$db = getenv('DB_NAME') ?: 'your_database';
$user = getenv('DB_USER') ?: 'your_username';
$pass = getenv('DB_PASS') ?: 'your_password';
$charset = 'utf8mb4';
$uploadDir = __DIR__ . '/uploads/';

// Database credentials file (more secure than env vars in some setups)
$dbConfigFile = __DIR__ . '/../../secrets/db_config.php';
if (file_exists($dbConfigFile)) {
    $dbConfig = require $dbConfigFile;
    if (is_array($dbConfig)) {
        if (isset($dbConfig['host'])) $host = $dbConfig['host'];
        if (isset($dbConfig['db'])) $db = $dbConfig['db'];
        if (isset($dbConfig['user'])) $user = $dbConfig['user'];
        if (isset($dbConfig['pass'])) $pass = $dbConfig['pass'];
    }
    error_log("Loaded database configuration from file");
}

// Make sure upload directory exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
    error_log("Created uploads directory: $uploadDir");
}

// Test if we can connect to the database
try {
    // Log connection attempt without revealing credentials
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
    
    // Send error in JSON format for API consistency, but without revealing sensitive information
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please contact administrator.'
    ]);
    exit;
}

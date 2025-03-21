<?php
header('Content-Type: application/json');

// Enable detailed error logging for debugging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log("Auth request received: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

require_once 'db_config.php';
// Load the config with admin_secret_code
$config = require_once 'config.php';
error_log("Config loaded, secret code available: " . (isset($config['admin_secret_code']) ? "yes" : "no"));

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}

// Get the action from the URL
$action = isset($_GET['action']) ? $_GET['action'] : '';
error_log("Auth action: $action");

// Handle different authentication actions
switch ($action) {
    case 'register':
        handleRegister();
        break;
    case 'login':
        handleLogin();
        break;
    case 'me':
        getCurrentUser();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        break;
}

// Handle user registration
function handleRegister() {
    global $conn, $config;
    
    try {
        // Only accept POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            return;
        }
        
        // Get JSON data from request body
        $raw_data = file_get_contents('php://input');
        error_log("Raw data received: " . $raw_data);
        $data = json_decode($raw_data, true);
        
        if (!$data) {
            error_log("Invalid JSON received: " . $raw_data);
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
            return;
        }
        
        // Log received data for debugging (removing sensitive info)
        $log_data = $data;
        if (isset($log_data['password'])) $log_data['password'] = '[REDACTED]';
        if (isset($log_data['password_confirm'])) $log_data['password_confirm'] = '[REDACTED]';
        if (isset($log_data['adminSecretCode'])) $log_data['adminSecretCode'] = '[SECRET REDACTED]';
        error_log("Register data received: " . json_encode($log_data));
        
        // Validate required fields
        $requiredFields = ['name', 'email', 'password', 'password_confirm'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
                return;
            }
        }
        
        // Check if passwords match
        if ($data['password'] !== $data['password_confirm']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
            return;
        }
        
        // Database connection validation
        if (!$conn) {
            error_log("Database connection is null");
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection failed']);
            return;
        }
        
        // Check if email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $data['email']);
        if (!$stmt->execute()) {
            error_log("Failed to execute email check query: " . $stmt->error);
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
            return;
        }
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email already in use']);
            return;
        }
        
        // Set default role to 'user' if not specified
        $role = isset($data['role']) && $data['role'] === 'admin' ? 'admin' : 'user';
        
        // Check if admin exists - if no admins exist and this is an admin registration with secretCode, auto-approve
        $adminSecretCode = isset($data['adminSecretCode']) ? $data['adminSecretCode'] : '';
        $isFirstAdmin = false;
        
        if ($role === 'admin') {
            // Check if any admin exists
            $adminCheck = $conn->query("SELECT id FROM users WHERE role = 'admin' AND status = 'active'");
            if (!$adminCheck) {
                error_log("Failed to execute admin check query: " . $conn->error);
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
                return;
            }
            $isFirstAdmin = ($adminCheck->num_rows == 0);
            error_log("Admin check - isFirstAdmin: " . ($isFirstAdmin ? 'true' : 'false'));
            
            // Verify secret code for first admin
            $secretCodeValid = false;
            
            // Get admin secret code from config
            $adminSecretCodeConfig = $config['admin_secret_code'] ?? '';
            error_log("Admin secret from config: " . (!empty($adminSecretCodeConfig) ? 'found (length: ' . strlen($adminSecretCodeConfig) . ')' : 'not found'));
            
            if ($isFirstAdmin && !empty($adminSecretCode) && !empty($adminSecretCodeConfig)) {
                // Compare the received code with the configured code
                error_log("Comparing codes - received: '" . substr($adminSecretCode, 0, 3) . "***' (length: " . strlen($adminSecretCode) . ") vs config: '" . substr($adminSecretCodeConfig, 0, 3) . "***' (length: " . strlen($adminSecretCodeConfig) . ")");
                $secretCodeValid = ($adminSecretCode === $adminSecretCodeConfig);
                error_log("Secret code validation result: " . ($secretCodeValid ? 'valid' : 'invalid'));
            }
            
            // Set status based on admin validation
            if ($isFirstAdmin && $secretCodeValid) {
                $status = 'active'; // First admin with valid secret code is auto-activated
                error_log("First admin will be set to active status");
            } else {
                $status = 'pending'; // Regular admin registration needs approval
                error_log("Admin will be set to pending status");
            }
        } else {
            // Regular users are active by default
            $status = 'active';
        }
        
        // Hash the password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Insert the new user
        try {
            $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)");
            if (!$stmt) {
                error_log("Failed to prepare insert statement: " . $conn->error);
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
                return;
            }
            
            $stmt->bind_param("sssss", $data['name'], $data['email'], $hashedPassword, $role, $status);
            
            if (!$stmt->execute()) {
                error_log("Failed to execute user insert: " . $stmt->error);
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to register user: ' . $stmt->error]);
                return;
            }
            
            $userId = $stmt->insert_id;
            
            // Generate a simple token (in a real app, use a proper JWT library)
            $token = bin2hex(random_bytes(32));
            
            // Get the newly created user
            $stmt = $conn->prepare("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?");
            if (!$stmt) {
                error_log("Failed to prepare user select statement: " . $conn->error);
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
                return;
            }
            
            $stmt->bind_param("i", $userId);
            
            if (!$stmt->execute()) {
                error_log("Failed to execute user select: " . $stmt->error);
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to retrieve user: ' . $stmt->error]);
                return;
            }
            
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            
            if (!$user) {
                error_log("No user found after insert");
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'User was created but could not be retrieved']);
                return;
            }
            
            $message = $isFirstAdmin && $status === 'active' 
                ? 'First admin created successfully' 
                : ($role === 'admin' && $status === 'pending' 
                    ? 'Admin registration pending approval' 
                    : 'User registered successfully');
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => $message,
                'user' => $user,
                'token' => $token
            ]);
        } catch (Exception $e) {
            error_log("Exception during user registration: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
            return;
        }
    } catch (Exception $e) {
        error_log("Global exception during registration: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}

// Handle user login
function handleLogin() {
    global $conn;
    
    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }
    
    // Get JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        return;
    }
    
    // Validate required fields
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        return;
    }
    
    // Get user by email
    $stmt = $conn->prepare("SELECT id, name, email, password, role, status, created_at FROM users WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        return;
    }
    
    $user = $result->fetch_assoc();
    
    // Verify password
    if (!password_verify($data['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        return;
    }
    
    // Check if user is active
    if ($user['status'] !== 'active') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Your account is pending approval']);
        return;
    }
    
    // Remove password from user data
    unset($user['password']);
    
    // Generate a simple token (in a real app, use a proper JWT library)
    $token = bin2hex(random_bytes(32));
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token
    ]);
}

// Get current user data from token
function getCurrentUser() {
    global $conn;
    
    // Only accept GET requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }
    
    // Check for Authorization header
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    error_log("Auth header: " . ($authHeader ? substr($authHeader, 0, 20) . '...' : 'not found'));
    
    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No token provided']);
        return;
    }
    
    $token = $matches[1];
    error_log("Token extracted: " . substr($token, 0, 10) . '...');
    
    // For development purposes, we'll accept any token and return a mock user
    // In a real app, you would validate the token properly
    try {
        // Create a sample user for testing - ensure we have consistent data here
        $user = [
            'id' => 1,
            'name' => 'Адміністратор',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        error_log("getCurrentUser returning user data: " . json_encode($user));
        
        // Return a successful response with status code 200
        http_response_code(200);
        echo json_encode($user);
    } catch (Exception $e) {
        error_log("Error in getCurrentUser: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error getting user data: ' . $e->getMessage()]);
    }
}


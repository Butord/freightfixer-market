
<?php
header('Content-Type: application/json');
require_once 'db_config.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}

// Get the action from the URL
$action = isset($_GET['action']) ? $_GET['action'] : '';

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
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
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
        $isFirstAdmin = ($adminCheck->num_rows == 0);
        
        // Verify secret code for first admin (should be set in your environment)
        $secretCodeValid = false;
        
        // In a real application, you would store this in a secure environment variable
        // For this example, we're using a hardcoded value - CHANGE THIS in production!
        $correctSecretCode = "Butord098#"; // This should match your VITE_ADMIN_SECRET_CODE
        
        if ($isFirstAdmin && $adminSecretCode === $correctSecretCode) {
            $secretCodeValid = true;
        }
        
        // Set status based on admin validation
        if ($isFirstAdmin && $secretCodeValid) {
            $status = 'active'; // First admin with valid secret code is auto-activated
        } else {
            $status = 'pending'; // Regular admin registration needs approval
        }
    } else {
        // Regular users are active by default
        $status = 'active';
    }
    
    // Hash the password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Insert the new user
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $data['name'], $data['email'], $hashedPassword, $role, $status);
    
    if ($stmt->execute()) {
        $userId = $stmt->insert_id;
        
        // Generate a simple token (in a real app, use a proper JWT library)
        $token = bin2hex(random_bytes(32));
        
        // Get the newly created user
        $stmt = $conn->prepare("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        
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
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to register user: ' . $conn->error]);
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
    
    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No token provided']);
        return;
    }
    
    $token = $matches[1];
    
    // In a real app, you would validate the token here
    // For this example, we'll just return a mock user for any token
    // This is obviously not secure - use proper JWT validation in production
    
    // Here you would look up the user by their token
    // Mock user data for demonstration
    $mockUser = [
        'id' => 1,
        'name' => 'Test User',
        'email' => 'test@example.com',
        'role' => 'user',
        'status' => 'active',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    echo json_encode($mockUser);
}


<?php
header('Content-Type: application/json');
require_once 'db_config.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}

// Get user ID from URL if provided
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Basic authorization check
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

// In a real application, you would validate the token here
// For this example, we're just checking if it exists
$token = $matches[1];

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($id > 0) {
            getSingleUser($id);
        } else {
            getAllUsers();
        }
        break;
    case 'PUT':
        if ($id > 0) {
            updateUser($id);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
        }
        break;
    case 'DELETE':
        if ($id > 0) {
            deleteUser($id);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

// Get all users
function getAllUsers() {
    global $conn;
    
    $stmt = $conn->prepare("SELECT id, name, email, role, status, created_at FROM users ORDER BY id DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    $users = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($users);
}

// Get a single user
function getSingleUser($id) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        return;
    }
    
    $user = $result->fetch_assoc();
    echo json_encode($user);
}

// Update a user
function updateUser($id) {
    global $conn;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        return;
    }
    
    // Build update query based on provided fields
    $updateFields = [];
    $types = '';
    $params = [];
    
    if (isset($data['name'])) {
        $updateFields[] = 'name = ?';
        $types .= 's';
        $params[] = $data['name'];
    }
    
    if (isset($data['email'])) {
        $updateFields[] = 'email = ?';
        $types .= 's';
        $params[] = $data['email'];
    }
    
    if (isset($data['status']) && in_array($data['status'], ['active', 'pending'])) {
        $updateFields[] = 'status = ?';
        $types .= 's';
        $params[] = $data['status'];
    }
    
    if (isset($data['role']) && in_array($data['role'], ['user', 'admin'])) {
        $updateFields[] = 'role = ?';
        $types .= 's';
        $params[] = $data['role'];
    }
    
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        return;
    }
    
    // Add ID to parameters
    $types .= 'i';
    $params[] = $id;
    
    // Create query
    $query = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
    
    // Execute update
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        // Get updated user
        $stmt = $conn->prepare("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        echo json_encode($user);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update user: ' . $conn->error]);
    }
}

// Delete a user
function deleteUser($id) {
    global $conn;
    
    // Check if it's the last admin
    $stmt = $conn->prepare("SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin' AND status = 'active'");
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    if ($result['admin_count'] <= 1) {
        // Check if trying to delete an active admin
        $stmt = $conn->prepare("SELECT role, status FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        
        if ($user && $user['role'] === 'admin' && $user['status'] === 'active') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cannot delete the last active admin']);
            return;
        }
    }
    
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete user: ' . $conn->error]);
    }
}

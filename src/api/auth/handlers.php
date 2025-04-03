
<?php
// Обробники аутентифікації
require_once __DIR__ . '/utils.php';

/**
 * Обробка реєстрації нового користувача
 * 
 * @param mysqli $conn З'єднання з базою даних
 * @param array $config Конфігурація з секретним кодом
 * @return void
 */
function handleRegister($conn, $config) {
    try {
        // Приймаємо лише POST запити
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            return;
        }
        
        // Отримуємо JSON дані з тіла запиту
        $raw_data = file_get_contents('php://input');
        error_log("Raw data received: " . $raw_data);
        $data = json_decode($raw_data, true);
        
        if (!$data) {
            error_log("Invalid JSON received: " . $raw_data);
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
            return;
        }
        
        // Журналюємо отримані дані для налагодження (видаляючи чутливу інформацію)
        $log_data = $data;
        if (isset($log_data['password'])) $log_data['password'] = '[REDACTED]';
        if (isset($log_data['password_confirm'])) $log_data['password_confirm'] = '[REDACTED]';
        if (isset($log_data['adminSecretCode'])) $log_data['adminSecretCode'] = '[SECRET REDACTED]';
        error_log("Register data received: " . json_encode($log_data));
        
        // Валідуємо обов'язкові поля
        $requiredFields = ['name', 'email', 'password', 'password_confirm'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
                return;
            }
        }
        
        // Перевіряємо чи паролі співпадають
        if ($data['password'] !== $data['password_confirm']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
            return;
        }
        
        // Валідація з'єднання з базою даних
        if (!$conn) {
            error_log("Database connection is null");
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection failed']);
            return;
        }
        
        // Перевіряємо чи email вже існує
        $emailExists = checkEmailExists($conn, $data['email']);
        if ($emailExists) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email already in use']);
            return;
        }
        
        // Встановлюємо роль 'user' за замовчуванням, якщо не вказано
        $role = isset($data['role']) && $data['role'] === 'admin' ? 'admin' : 'user';
        
        // Перевіряємо права адміністратора
        $adminSecretCode = isset($data['adminSecretCode']) ? $data['adminSecretCode'] : '';
        $isFirstAdmin = isFirstAdmin($conn);
        error_log("Admin check - isFirstAdmin: " . ($isFirstAdmin ? 'true' : 'false'));
        
        // Встановлюємо статус користувача
        $status = 'active'; // За замовчуванням для звичайних користувачів
        
        if ($role === 'admin') {
            // Перевіряємо секретний код для першого адміністратора
            $secretCodeValid = isValidAdminSecretCode($adminSecretCode, $config);
            error_log("Secret code validation result: " . ($secretCodeValid ? 'valid' : 'invalid'));
            
            if ($isFirstAdmin && $secretCodeValid) {
                $status = 'active'; // Перший адмін з правильним кодом автоматично активується
                error_log("First admin will be set to active status");
            } else {
                $status = 'pending'; // Звичайна реєстрація адміна потребує підтвердження
                error_log("Admin will be set to pending status");
            }
        }
        
        // Створюємо нового користувача
        $userId = createUser($conn, $data, $role, $status);
        if (!$userId) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create user']);
            return;
        }
        
        // Отримуємо дані створеного користувача
        $user = getUserById($conn, $userId);
        if (!$user) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'User was created but could not be retrieved']);
            return;
        }
        
        // Генеруємо токен
        $tokenData = generateToken($user);
        
        // Формуємо повідомлення в залежності від ролі та статусу
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
            'token' => $tokenData['token'],
            'expires' => $tokenData['expires']
        ]);
        
    } catch (Exception $e) {
        error_log("Global exception during registration: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}

/**
 * Перевірка чи існує користувач з вказаним email
 * 
 * @param mysqli $conn З'єднання з базою даних
 * @param string $email Email для перевірки
 * @return bool True якщо email вже зареєстрований
 */
function checkEmailExists($conn, $email) {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        error_log("Failed to execute email check query: " . $stmt->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
        return true; // Повертаємо true щоб запобігти створенню користувача у випадку помилки
    }
    $result = $stmt->get_result();
    return $result->num_rows > 0;
}

/**
 * Створення нового користувача
 * 
 * @param mysqli $conn З'єднання з базою даних
 * @param array $data Дані користувача
 * @param string $role Роль користувача
 * @param string $status Статус користувача
 * @return int|false ID створеного користувача або false при помилці
 */
function createUser($conn, $data, $role, $status) {
    // Хешуємо пароль
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)");
        if (!$stmt) {
            error_log("Failed to prepare insert statement: " . $conn->error);
            return false;
        }
        
        $stmt->bind_param("sssss", $data['name'], $data['email'], $hashedPassword, $role, $status);
        
        if (!$stmt->execute()) {
            error_log("Failed to execute user insert: " . $stmt->error);
            return false;
        }
        
        return $stmt->insert_id;
    } catch (Exception $e) {
        error_log("Exception during user creation: " . $e->getMessage());
        return false;
    }
}

/**
 * Отримання даних користувача за ID
 * 
 * @param mysqli $conn З'єднання з базою даних
 * @param int $userId ID користувача
 * @return array|false Дані користувача або false при помилці
 */
function getUserById($conn, $userId) {
    $stmt = $conn->prepare("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?");
    if (!$stmt) {
        error_log("Failed to prepare user select statement: " . $conn->error);
        return false;
    }
    
    $stmt->bind_param("i", $userId);
    
    if (!$stmt->execute()) {
        error_log("Failed to execute user select: " . $stmt->error);
        return false;
    }
    
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

/**
 * Обробка входу користувача
 * 
 * @param mysqli $conn З'єднання з базою даних
 * @return void
 */
function handleLogin($conn) {
    // Приймаємо лише POST запити
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }
    
    // Отримуємо JSON дані з тіла запиту
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        return;
    }
    
    // Валідуємо обов'язкові поля
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        return;
    }
    
    // Отримуємо користувача за email
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
    
    // Перевіряємо пароль
    if (!password_verify($data['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        return;
    }
    
    // Перевіряємо чи активний користувач
    if ($user['status'] !== 'active') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Your account is pending approval']);
        return;
    }
    
    // Видаляємо пароль з даних користувача
    unset($user['password']);
    
    // Генеруємо токен
    $tokenData = generateToken($user);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user,
        'token' => $tokenData['token'],
        'expires' => $tokenData['expires']
    ]);
}

/**
 * Отримання даних поточного користувача за токеном
 * 
 * @param mysqli $conn З'єднання з базою даних
 * @return void
 */
function getCurrentUser($conn) {
    // Приймаємо лише GET запити
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }
    
    // Перевіряємо заголовок Authorization
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
    
    // Розкодовуємо та перевіряємо токен
    try {
        // Декодуємо токен з base64
        $tokenJson = base64_decode($token);
        if (!$tokenJson) {
            throw new Exception("Invalid token format");
        }
        
        $tokenData = json_decode($tokenJson, true);
        if (!$tokenData || !isset($tokenData['user_id']) || !isset($tokenData['exp'])) {
            throw new Exception("Invalid token data");
        }
        
        // Перевіряємо чи токен не прострочений
        if ($tokenData['exp'] < time()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Token expired']);
            return;
        }
        
        // Отримуємо дані користувача з бази за user_id з токена
        $userId = $tokenData['user_id'];
        $stmt = $conn->prepare("SELECT id, name, email, role, status, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception("User not found");
        }
        
        $user = $result->fetch_assoc();
        
        // Перевіряємо чи активний користувач
        if ($user['status'] !== 'active') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Your account is pending approval']);
            return;
        }
        
        // Повертаємо дані користувача
        http_response_code(200);
        echo json_encode($user);
        
    } catch (Exception $e) {
        error_log("Error verifying token: " . $e->getMessage());
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    }
}

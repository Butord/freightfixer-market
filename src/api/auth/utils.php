
<?php
// Допоміжні функції для аутентифікації

/**
 * Генерує JWT токен на основі даних користувача
 * 
 * @param array $userData Дані користувача
 * @param int $expiresIn Час дії токену в секундах
 * @return array Масив з токеном та часом закінчення
 */
function generateToken($userData, $expiresIn = 86400) {
    // Генерація токену з терміном дії (24 години за замовчуванням)
    $expiration = time() + $expiresIn;
    $tokenData = [
        'user_id' => $userData['id'],
        'email' => $userData['email'],
        'exp' => $expiration
    ];
    
    // Конвертуємо в JSON і кодуємо в base64
    $tokenJson = json_encode($tokenData);
    $token = base64_encode($tokenJson);
    
    return [
        'token' => $token,
        'expires' => $expiration
    ];
}

/**
 * Перевіряє чи є користувач першим адміністратором
 * 
 * @param mysqli $conn З'єднання з базою даних
 * @return bool True якщо немає жодного активного адміністратора
 */
function isFirstAdmin($conn) {
    $adminCheck = $conn->query("SELECT id FROM users WHERE role = 'admin' AND status = 'active'");
    if (!$adminCheck) {
        error_log("Failed to execute admin check query: " . $conn->error);
        return false;
    }
    return ($adminCheck->num_rows == 0);
}

/**
 * Перевіряє чи валідний секретний код адміністратора
 * 
 * @param string $providedCode Код наданий користувачем
 * @param array $config Конфігурація з секретним кодом
 * @return bool True якщо код правильний
 */
function isValidAdminSecretCode($providedCode, $config) {
    $adminSecretCodeConfig = $config['admin_secret_code'] ?? '';
    if (empty($providedCode) || empty($adminSecretCodeConfig)) {
        return false;
    }
    
    error_log("Comparing codes - received: '" . substr($providedCode, 0, 3) . "***' (length: " . 
        strlen($providedCode) . ") vs config: '" . substr($adminSecretCodeConfig, 0, 3) . 
        "***' (length: " . strlen($adminSecretCodeConfig) . ")");
        
    return ($providedCode === $adminSecretCodeConfig);
}

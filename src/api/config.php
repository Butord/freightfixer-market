<?php
/**
 * Configuration file for the application
 * This file contains sensitive information and should not be committed to version control
 */

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_log("Loading config.php file");

// Try to get admin secret code from environment variable first
$adminSecretCode = getenv('ADMIN_SECRET_CODE');
error_log("Admin secret code from env: " . ($adminSecretCode ? "found (length: " . strlen($adminSecretCode) . ")" : "not found"));

// Hardcoded fallback value (this is just for development, in production use environment variables)
if (empty($adminSecretCode)) {
    // Використовуємо більш безпечний метод для зберігання секретного коду
    // У продакшн середовищі цей код має бути встановлений через змінні середовища,
    // а не зберігатися у файлі
    $secretFile = __DIR__ . '/../../secrets/admin_code.secret';
    if (file_exists($secretFile)) {
        $adminSecretCode = trim(file_get_contents($secretFile));
        error_log("Admin secret loaded from secret file: " . (strlen($adminSecretCode) > 0 ? "success" : "failed"));
    } else {
        // Fallback для розробки
        $adminSecretCode = 'Butord098#';
        error_log("Using default admin secret code: " . substr($adminSecretCode, 0, 3) . "*** (length: " . strlen($adminSecretCode) . ")");
        
        // Create secrets directory if it doesn't exist
        if (!file_exists(__DIR__ . '/../../secrets')) {
            mkdir(__DIR__ . '/../../secrets', 0700, true);
        }
        
        // Save the secret to a file with restrictive permissions
        file_put_contents($secretFile, $adminSecretCode);
        chmod($secretFile, 0600); // Only readable by owner
        error_log("Created secret file with default code");
    }
}

// Create the configuration array
$config = [
    // Secret code for first admin registration
    'admin_secret_code' => $adminSecretCode,
    
    // Token settings
    'token_expiration' => 24 * 60 * 60, // 24 hours in seconds
    
    // Other configuration settings can be added here
];

// Log the secret code (first few characters only, for security)
$secretLength = strlen($adminSecretCode);
$visibleLength = min(3, $secretLength);
$maskedSecret = substr($adminSecretCode, 0, $visibleLength) . str_repeat('*', $secretLength - $visibleLength);
error_log("Admin secret code configured: $maskedSecret (length: $secretLength)");

// Make sure to return config array
return $config;

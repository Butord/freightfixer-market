
<?php
/**
 * Configuration file for the application
 * This file contains sensitive information and should not be committed to version control
 */

// Enable error reporting for debugging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log("Loading config.php file");

// Спочатку спробуємо отримати значення з змінної оточення
$adminSecretCode = getenv('ADMIN_SECRET_CODE');
error_log("Admin secret code from env: " . ($adminSecretCode ? "found" : "not found"));

// Якщо значення з оточення порожнє, використовуємо стандартне значення
if (empty($adminSecretCode)) {
    $adminSecretCode = 'Butord098#';
    error_log("Using default admin secret code");
}

// Create the configuration array
$config = [
    // Secret code for first admin registration
    'admin_secret_code' => $adminSecretCode,
    
    // Other configuration settings can be added here
];

// Log the secret code (first few characters only, for security)
$secretLength = strlen($adminSecretCode);
$visibleLength = min(3, $secretLength);
$maskedSecret = substr($adminSecretCode, 0, $visibleLength) . str_repeat('*', $secretLength - $visibleLength);
error_log("Admin secret code configured: $maskedSecret (length: $secretLength)");

// Make sure to return nothing if this file is included directly
return $config;

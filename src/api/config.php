
<?php
/**
 * Configuration file for the application
 * This file contains sensitive information and should not be committed to version control
 */

// Спочатку спробуємо отримати значення з змінної оточення
$adminSecretCode = getenv('ADMIN_SECRET_CODE');

// Якщо значення з оточення порожнє, використовуємо стандартне значення
if (empty($adminSecretCode)) {
    $adminSecretCode = 'Butord098#';
}

$config = [
    // Secret code for first admin registration
    'admin_secret_code' => $adminSecretCode,
    
    // Other configuration settings can be added here
];


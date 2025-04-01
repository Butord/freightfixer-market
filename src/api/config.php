<?php
// Configuration file for the API
return [
    // Admin secret code for first admin setup
    // This should be the same as the VITE_ADMIN_SECRET_CODE in frontend
    'admin_secret_code' => getenv('ADMIN_SECRET_CODE') ?: 'Butord098#',
    
    // Other configuration options
    'site_name' => 'My E-commerce Site',
    'support_email' => 'support@example.com',
    
    // Database backup settings
    'backup_enabled' => true,
    'backup_interval' => 'daily',
    
    // API version
    'api_version' => '1.0'
];

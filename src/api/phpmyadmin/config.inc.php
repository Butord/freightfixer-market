
<?php
/* Server parameters */
$cfg['Servers'][1]['host'] = 'database';
$cfg['Servers'][1]['port'] = '3306';
$cfg['Servers'][1]['connect_type'] = 'tcp';
$cfg['Servers'][1]['auth_type'] = 'cookie';
$cfg['Servers'][1]['user'] = 'root';
$cfg['Servers'][1]['password'] = 'rootpassword';

/* Directories for saving/loading files from server */
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';

/* Blowfish secret */
$cfg['blowfish_secret'] = 'aVerySecureRandomString123!'; // Replace with your secure random string

/* Theme settings */
$cfg['ThemeDefault'] = 'pmahomme';

/* Other settings */
$cfg['ExecTimeLimit'] = 600;
$cfg['MaxRows'] = 50;
$cfg['SendErrorReports'] = 'never';
$cfg['ShowPhpInfo'] = true;

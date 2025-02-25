
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'your_database';
$user = 'your_username';
$pass = 'your_password';
$charset = 'utf8mb4';
$uploadDir = __DIR__ . '/uploads/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
                $stmt->execute([$_GET['id']]);
                $category = $stmt->fetch();
                echo json_encode(['status' => 'success', 'data' => $category]);
            } else {
                $stmt = $pdo->query('SELECT * FROM categories ORDER BY name');
                $categories = $stmt->fetchAll();
                echo json_encode(['status' => 'success', 'data' => $categories]);
            }
            break;

        case 'POST':
            $name = $_POST['name'];
            $meta_title = $_POST['meta_title'] ?? '';
            $meta_description = $_POST['meta_description'] ?? '';
            $meta_keywords = $_POST['meta_keywords'] ?? '';
            $image_path = '';

            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['image'];
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = uniqid() . '.' . $ext;
                $filepath = $uploadDir . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    $image_path = '/uploads/' . $filename;
                }
            }

            $stmt = $pdo->prepare('INSERT INTO categories (name, image, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$name, $image_path, $meta_title, $meta_description, $meta_keywords]);
            $category_id = $pdo->lastInsertId();

            $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
            $stmt->execute([$category_id]);
            $category = $stmt->fetch();

            echo json_encode(['status' => 'success', 'data' => $category]);
            break;

        case 'PUT':
            if (isset($_GET['id'])) {
                parse_str(file_get_contents("php://input"), $_PUT);
                $id = $_GET['id'];
                
                $sets = [];
                $params = [];

                if (isset($_PUT['name'])) {
                    $sets[] = 'name = ?';
                    $params[] = $_PUT['name'];
                }

                if (isset($_PUT['meta_title'])) {
                    $sets[] = 'meta_title = ?';
                    $params[] = $_PUT['meta_title'];
                }

                if (isset($_PUT['meta_description'])) {
                    $sets[] = 'meta_description = ?';
                    $params[] = $_PUT['meta_description'];
                }

                if (isset($_PUT['meta_keywords'])) {
                    $sets[] = 'meta_keywords = ?';
                    $params[] = $_PUT['meta_keywords'];
                }

                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $file = $_FILES['image'];
                    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                    $filename = uniqid() . '.' . $ext;
                    $filepath = $uploadDir . $filename;
                    
                    if (move_uploaded_file($file['tmp_name'], $filepath)) {
                        $sets[] = 'image = ?';
                        $params[] = '/uploads/' . $filename;
                    }
                }

                $params[] = $id;
                $sql = 'UPDATE categories SET ' . implode(', ', $sets) . ' WHERE id = ?';
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);

                $stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
                $stmt->execute([$id]);
                $category = $stmt->fetch();

                echo json_encode(['status' => 'success', 'data' => $category]);
            }
            break;

        case 'DELETE':
            if (isset($_GET['id'])) {
                $id = $_GET['id'];

                // Перевіряємо, чи є товари в цій категорії
                $stmt = $pdo->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');
                $stmt->execute([$id]);
                $count = $stmt->fetchColumn();

                if ($count > 0) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Неможливо видалити категорію, яка містить товари'
                    ]);
                    exit;
                }

                // Отримуємо інформацію про категорію перед видаленням
                $stmt = $pdo->prepare('SELECT image FROM categories WHERE id = ?');
                $stmt->execute([$id]);
                $category = $stmt->fetch();

                // Видаляємо файл зображення, якщо він існує
                if ($category && $category['image']) {
                    $image_path = __DIR__ . $category['image'];
                    if (file_exists($image_path)) {
                        unlink($image_path);
                    }
                }

                // Видаляємо запис з бази даних
                $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
                $stmt->execute([$id]);

                echo json_encode(['status' => 'success']);
            }
            break;
    }
} catch (\PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

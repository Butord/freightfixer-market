
<?php
header('Content-Type: application/json');

$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

try {
    $pdo = require 'db_config.php';
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Отримання одного товару
                $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
                $stmt->execute([$_GET['id']]);
                $product = $stmt->fetch();
                echo json_encode($product);
            } else {
                // Отримання всіх товарів
                $stmt = $pdo->query('SELECT * FROM products ORDER BY id DESC');
                $products = $stmt->fetchAll();
                echo json_encode($products);
            }
            break;

        case 'POST':
            // Створення нового товару
            $name = $_POST['name'];
            $price = $_POST['price'];
            $description = $_POST['description'] ?? '';
            $category_id = $_POST['category_id'];
            $meta_title = $_POST['meta_title'] ?? '';
            $meta_description = $_POST['meta_description'] ?? '';
            $meta_keywords = $_POST['meta_keywords'] ?? '';
            $image_path = '';

            // Обробка завантаженого файлу
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['image'];
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = uniqid() . '.' . $ext;
                $filepath = $uploadDir . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    $image_path = '/uploads/' . $filename;
                }
            }

            $stmt = $pdo->prepare('INSERT INTO products (name, price, description, category_id, image, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$name, $price, $description, $category_id, $image_path, $meta_title, $meta_description, $meta_keywords]);
            $product_id = $pdo->lastInsertId();

            $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
            $stmt->execute([$product_id]);
            $product = $stmt->fetch();

            echo json_encode($product);
            break;

        case 'PUT':
            // Оновлення існуючого товару
            if (isset($_GET['id'])) {
                parse_str(file_get_contents("php://input"), $_PUT);
                $id = $_GET['id'];
                
                $sets = [];
                $params = [];

                if (isset($_PUT['name'])) {
                    $sets[] = 'name = ?';
                    $params[] = $_PUT['name'];
                }
                if (isset($_PUT['price'])) {
                    $sets[] = 'price = ?';
                    $params[] = $_PUT['price'];
                }
                if (isset($_PUT['description'])) {
                    $sets[] = 'description = ?';
                    $params[] = $_PUT['description'];
                }
                if (isset($_PUT['category_id'])) {
                    $sets[] = 'category_id = ?';
                    $params[] = $_PUT['category_id'];
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

                // Обробка завантаженого файлу
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
                $sql = 'UPDATE products SET ' . implode(', ', $sets) . ' WHERE id = ?';
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);

                $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
                $stmt->execute([$id]);
                $product = $stmt->fetch();

                echo json_encode($product);
            }
            break;

        case 'DELETE':
            // Видалення товару
            if (isset($_GET['id'])) {
                $id = $_GET['id'];

                // Отримуємо інформацію про товар перед видаленням
                $stmt = $pdo->prepare('SELECT image FROM products WHERE id = ?');
                $stmt->execute([$id]);
                $product = $stmt->fetch();

                // Видаляємо файл зображення, якщо він існує
                if ($product && $product['image']) {
                    $image_path = __DIR__ . $product['image'];
                    if (file_exists($image_path)) {
                        unlink($image_path);
                    }
                }

                // Видаляємо запис з бази даних
                $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
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

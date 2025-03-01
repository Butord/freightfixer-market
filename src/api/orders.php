
<?php
header('Content-Type: application/json');

try {
    $pdo = require 'db_config.php';
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get one order
                $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
                $stmt->execute([$_GET['id']]);
                $order = $stmt->fetch();
                
                // Get order items
                $stmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
                $stmt->execute([$order['id']]);
                $order['items'] = $stmt->fetchAll();
                
                echo json_encode($order);
            } else {
                // Get all orders
                $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
                $orders = $stmt->fetchAll();
                
                // Get items for each order
                foreach ($orders as &$order) {
                    $stmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
                    $stmt->execute([$order['id']]);
                    $order['items'] = $stmt->fetchAll();
                }
                
                echo json_encode($orders);
            }
            break;

        case 'POST':
            // Create new order
            $data = json_decode(file_get_contents('php://input'), true);
            
            $user_id = $data['user_id'] ?? null;
            $total = $data['total'];
            $status = 'new';  // Default status for new orders
            $delivery_method = $data['delivery_method'];
            $payment_method = $data['payment_method'] ?? 'cash';
            $city = $data['city'];
            $department = $data['department'];
            $customer_name = $data['customer_name'] ?? '';
            $customer_email = $data['customer_email'] ?? '';
            $customer_phone = $data['customer_phone'] ?? '';
            
            $pdo->beginTransaction();
            
            try {
                // Insert order
                $stmt = $pdo->prepare('INSERT INTO orders (user_id, total, status, delivery_method, payment_method, 
                                        city, department, customer_name, customer_email, customer_phone, created_at) 
                                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())');
                $stmt->execute([
                    $user_id, $total, $status, $delivery_method, $payment_method, 
                    $city, $department, $customer_name, $customer_email, $customer_phone
                ]);
                
                $order_id = $pdo->lastInsertId();
                
                // Insert order items
                foreach ($data['items'] as $item) {
                    $stmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, name, price, quantity) 
                                           VALUES (?, ?, ?, ?, ?)');
                    $stmt->execute([
                        $order_id, $item['id'], $item['name'], $item['price'], $item['quantity']
                    ]);
                }
                
                $pdo->commit();
                
                // Get the created order
                $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
                $stmt->execute([$order_id]);
                $order = $stmt->fetch();
                
                // Get order items
                $stmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
                $stmt->execute([$order_id]);
                $order['items'] = $stmt->fetchAll();
                
                echo json_encode($order);
            } catch (\Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
            break;

        case 'PUT':
            // Update order status
            if (isset($_GET['id'])) {
                $data = json_decode(file_get_contents('php://input'), true);
                $id = $_GET['id'];
                $status = $data['status'];
                
                $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
                $stmt->execute([$status, $id]);
                
                $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
                $stmt->execute([$id]);
                $order = $stmt->fetch();
                
                echo json_encode($order);
            }
            break;

        case 'DELETE':
            // Cancel order
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                
                $stmt = $pdo->prepare('UPDATE orders SET status = "cancelled" WHERE id = ?');
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

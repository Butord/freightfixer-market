
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `your_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `your_database`;

-- Categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('new','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'new',
  `delivery_method` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'cash',
  `city` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data for categories
INSERT INTO `categories` (`name`, `image`, `meta_title`, `meta_description`, `meta_keywords`) VALUES
('Електроніка', '/uploads/electronics.jpg', 'Електроніка - Інтернет-магазин', 'Купуйте електроніку за найкращими цінами', 'електроніка, гаджети, смартфони'),
('Одяг', '/uploads/clothing.jpg', 'Одяг - Інтернет-магазин', 'Стильний одяг за доступними цінами', 'одяг, мода, стиль');

-- Sample data for products
INSERT INTO `products` (`name`, `price`, `description`, `image`, `category_id`, `meta_title`, `meta_description`, `meta_keywords`) VALUES
('Смартфон XYZ', 12999.99, 'Потужний смартфон з великим екраном', '/uploads/smartphone.jpg', 1, 'Смартфон XYZ - Купити', 'Купити смартфон XYZ за найкращою ціною', 'смартфон, телефон, гаджет'),
('Футболка', 499.99, 'Стильна футболка з бавовни', '/uploads/tshirt.jpg', 2, 'Футболка - Купити', 'Купити стильну футболку за найкращою ціною', 'футболка, одяг, мода');

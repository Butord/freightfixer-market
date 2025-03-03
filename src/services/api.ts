
import { Product, Category, Order } from '@/types/api';

// Адреса API з урахуванням базового шляху
const API_URL = import.meta.env.VITE_API_URL || 'https://autoss-best.com/arm3/api';

class ApiService {
  // Товари
  static async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  static async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  }

  static async createProduct(productData: FormData): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: productData,
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  static async updateProduct(id: number, productData: FormData): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  }

  static async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }

  // Категорії
  static async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  static async getCategory(id: number): Promise<Category> {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  }

  static async createCategory(categoryData: FormData): Promise<Category> {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      body: categoryData,
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  }

  static async updateCategory(id: number, categoryData: FormData): Promise<Category> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  }

  static async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }
  }

  // Замовлення
  static async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  static async getOrder(id: number): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  }

  static async createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }

  static async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  }

  static async cancelOrder(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to cancel order');
  }
}

export default ApiService;

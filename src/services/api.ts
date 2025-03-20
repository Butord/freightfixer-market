
import { Product, Category, Order } from '@/types/api';
import { AuthResponse, LoginRequest, RegisterRequest, User, UserUpdateRequest } from '@/types/auth';

// Base API URL with trailing slash removed to avoid double slashes
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://autoss-best.com/arm3/api').replace(/\/$/, '');

/**
 * Helper to handle API response errors
 */
const handleApiResponse = async (response: Response) => {
  if (!response) {
    console.error('Empty response received');
    throw new Error('Не вдалося отримати відповідь від сервера');
  }

  // Check if response is ok before trying to parse JSON
  if (!response.ok) {
    // Try to parse JSON error response first
    try {
      const errorData = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.message || `Помилка сервера: ${response.status} ${response.statusText}`);
    } catch (jsonError) {
      // If response is not JSON, get as text
      try {
        const text = await response.text();
        console.error('Non-JSON error response:', text ? text.substring(0, 500) : '(empty response)'); // Log first 500 chars
      } catch (textError) {
        console.error('Could not read response body');
      }
      
      // Include the URL that failed in the error message
      const url = response.url || 'unknown URL';
      throw new Error(`Помилка сервера: ${response.status} ${response.statusText} при запиті до ${url}`);
    }
  }

  // Check for empty responses
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0') {
    console.error('Empty response body received');
    return { success: false, message: 'Сервер повернув порожню відповідь' };
  }

  // Check for non-JSON responses for successful responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    // If response is HTML or other non-JSON format, log it for debugging
    try {
      const text = await response.text();
      console.error('Non-JSON response received:', text ? text.substring(0, 500) : '(empty response)'); // Log first 500 chars
      
      // Include the URL that failed in the error message
      const url = response.url || 'unknown URL';
      throw new Error(`Неочікувана відповідь від сервера при запиті до ${url}. Перевірте консоль для деталей.`);
    } catch (textError) {
      console.error('Could not read response body');
      throw new Error('Не вдалося прочитати відповідь сервера');
    }
  }

  // Parse JSON response
  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new Error('Не вдалося розпарсити відповідь сервера');
  }
};

class ApiService {
  // Authentication methods
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('Login request URL:', `${API_BASE_URL}/auth.php?action=login`);
    const response = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include' // Include cookies with the request
    });
    
    return handleApiResponse(response);
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('Sending register request:', { ...userData, password: '[REDACTED]' });
    const url = `${API_BASE_URL}/auth.php?action=register`;
    console.log('API URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include' // Include cookies with the request
      });
      
      console.log('Register response status:', response.status);
      return handleApiResponse(response);
    } catch (error) {
      console.error('Network error during registration:', error);
      throw new Error(`Помилка мережі: ${error instanceof Error ? error.message : 'невідома помилка'}`);
    }
  }

  static async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleApiResponse(response);
  }

  // New methods for managing users
  static async getUsers(token: string): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Не вдалося отримати список користувачів');
    }
    
    return response.json();
  }

  static async updateUser(token: string, userData: UserUpdateRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Не вдалося оновити дані користувача');
    }
    
    return response.json();
  }

  static async deleteUser(token: string, id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Не вдалося видалити користувача');
    }
  }

  // Products
  static async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  static async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  }

  static async createProduct(productData: FormData): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: productData,
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  static async updateProduct(id: number, productData: FormData): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  }

  static async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  static async getCategory(id: number): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  }

  static async createCategory(categoryData: FormData): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: categoryData,
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  }

  static async updateCategory(id: number, categoryData: FormData): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  }

  static async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }
  }

  // Orders
  static async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  static async getOrder(id: number): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  }

  static async createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
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
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to cancel order');
  }
}

export default ApiService;

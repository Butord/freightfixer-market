
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';
import ApiConfig from './config';

const { API_BASE_URL, handleApiResponse } = ApiConfig;

const AuthApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const url = `${API_BASE_URL}/auth.php?action=login`;
    console.log('Login request URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Включити куки з запитом
      });
      
      return handleApiResponse(response);
    } catch (error) {
      console.error('Network error during login:', error);
      throw new Error(`Помилка мережі: ${error instanceof Error ? error.message : 'невідома помилка'}`);
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('Sending register request:', { ...userData, password: '[REDACTED]' });
    const url = `${API_BASE_URL}/auth.php?action=register`;
    console.log('API URL:', url);
    
    try {
      // Add more debugging information
      console.log('Sending with credentials mode: include');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include' // Include cookies with request
      });
      
      console.log('Register response status:', response.status);
      console.log('Register response headers:', {
        'content-type': response.headers.get('content-type'),
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
      });
      
      return handleApiResponse(response);
    } catch (error) {
      console.error('Network error during registration:', error);
      throw new Error(`Помилка мережі: ${error instanceof Error ? error.message : 'невідома помилка'}`);
    }
  },

  async getCurrentUser(token: string): Promise<User> {
    const url = `${API_BASE_URL}/auth.php?action=me`;
    console.log('Get current user URL:', url);
    console.log('Using token:', token ? `${token.substring(0, 10)}...` : 'No token');
    
    if (!token) {
      console.error('No token provided to getCurrentUser');
      throw new Error('Токен відсутній');
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error('getCurrentUser response not OK:', response.status, response.statusText);
        if (response.status === 401) {
          throw new Error('Токен не валідний або закінчився');
        }
        throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
      }
      
      // Спроба розібрати відповідь
      try {
        const data = await response.json();
        console.log('User data received:', data);
        return data;
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Помилка при отриманні даних користувача');
      }
    } catch (error) {
      console.error('getCurrentUser error:', error);
      throw error;
    }
  }
};

export default AuthApi;

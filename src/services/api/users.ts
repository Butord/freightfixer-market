
import { User, UserUpdateRequest } from '@/types/auth';
import ApiConfig from './config';

const { API_BASE_URL, handleApiResponse } = ApiConfig;

const UsersApi = {
  async getUsers(token: string): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Не вдалося отримати список користувачів');
    }
    
    return response.json();
  },

  async updateUser(token: string, userData: UserUpdateRequest): Promise<User> {
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
  },

  async deleteUser(token: string, id: number): Promise<void> {
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
};

export default UsersApi;

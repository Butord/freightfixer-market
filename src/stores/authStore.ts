import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ApiService from '@/services/api';
import { User, LoginRequest, RegisterRequest } from '@/types/auth';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await ApiService.login(credentials);
          
          if (response.user && response.user.role === 'admin' && response.user.status === 'pending') {
            set({ isLoading: false });
            toast.error('Ваш обліковий запис адміністратора очікує підтвердження');
            return { success: false, message: 'Ваш обліковий запис адміністратора очікує підтвердження' };
          }
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isAdmin: response.user && response.user.role === 'admin',
            isLoading: false,
          });
          toast.success('Успішний вхід!');
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Невідома помилка авторизації';
          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          return { success: false, message: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Registering user with role:', userData.role);
          
          const isFirstAdminSetup = userData.role === 'admin' && userData.adminSecretCode;
          
          let dataToSend = userData;
          
          if (isFirstAdminSetup) {
            dataToSend = {
              ...userData,
              adminSecretCode: userData.adminSecretCode
            };
            console.log('Sending admin registration with secret code');
          } 
          
          const response = await ApiService.register(dataToSend);
          console.log('Registration response:', response);
          
          if (!response) {
            set({ isLoading: false });
            console.error('Empty response from server');
            return { 
              success: false, 
              message: 'Помилка отримання даних від сервера' 
            };
          }
          
          if (response.success === false) {
            set({ isLoading: false });
            return { 
              success: false, 
              message: response.message || 'Помилка реєстрації' 
            };
          }
          
          if (!response.user) {
            set({ isLoading: false });
            console.error('Response missing user data:', response);
            return { 
              success: false, 
              message: 'Відповідь сервера не містить даних користувача' 
            };
          }
          
          if (response.user.status === 'pending') {
            toast.info('Ваш запит на створення облікового запису адміністратора надіслано. Очікуйте підтвердження.');
            set({ isLoading: false });
            return { 
              success: true, 
              message: 'Запит на створення адміністратора надіслано. Очікуйте підтвердження.' 
            };
          }
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isAdmin: response.user.role === 'admin',
            isLoading: false,
          });
          
          if (response.user.role === 'admin') {
            toast.success('Реєстрація адміністратора успішна!');
          } else {
            toast.success('Реєстрація успішна!');
          }
          
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Невідома помилка реєстрації';
          console.error('Registration error:', errorMessage);
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, message: errorMessage };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
        toast.info('Ви вийшли з системи');
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          console.log('No token found, skipping auth check');
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true });
        try {
          console.log('Checking auth with token:', token.substring(0, 10) + '...');
          const user = await ApiService.getCurrentUser(token);
          console.log('Got user from API:', user);
          
          if (!user || !user.id) {
            console.error('Invalid user data received:', user);
            throw new Error('Не вдалося отримати дані користувача');
          }
          
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            isLoading: false,
          });
          console.log('Auth state updated:', {
            authenticated: true,
            admin: user.role === 'admin',
            user: user
          });
        } catch (error) {
          console.error('Error checking auth:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Помилка авторизації',
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);


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
          
          // Перевіряємо, чи адміністратор активований
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
          
          // Перевіряємо, чи це реєстрація адміністратора з використанням спеціального коду
          const isFirstAdminSetup = userData.role === 'admin' && userData.adminSecretCode;
          
          // Відправляємо секретний код на сервер для першого адміністратора
          let dataToSend = userData;
          
          // Якщо це реєстрація першого адміністратора через AdminSetup, додаємо код
          if (isFirstAdminSetup) {
            dataToSend = {
              ...userData,
              adminSecretCode: userData.adminSecretCode
            };
            console.log('Sending admin registration with secret code');
          } 
          
          const response = await ApiService.register(dataToSend);
          console.log('Registration response:', response);
          
          // Перевіряємо чи є відповідь від сервера
          if (!response) {
            set({ isLoading: false });
            console.error('Empty response from server');
            return { 
              success: false, 
              message: 'Помилка отримання даних від сервера' 
            };
          }
          
          // Якщо відповідь успішна, але без даних користувача
          if (response.success === false) {
            set({ isLoading: false });
            return { 
              success: false, 
              message: response.message || 'Помилка реєстрації' 
            };
          }
          
          // Перевіряємо наявність користувача в відповіді
          if (!response.user) {
            set({ isLoading: false });
            console.error('Response missing user data:', response);
            return { 
              success: false, 
              message: 'Відповідь сервера не містить даних користувача' 
            };
          }
          
          // Перевіряємо статус користувача в відповіді, якщо він є
          if (response.user.status === 'pending') {
            toast.info('Ваш запит на створення облікового запису адміністратора надіслано. Очікуйте підтвердження.');
            set({ isLoading: false });
            return { 
              success: true, 
              message: 'Запит на створення адміністратора надіслано. Очікуйте підтвердження.' 
            };
          }
          
          // Якщо користувач активний, встановлюємо його дані
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isAdmin: response.user.role === 'admin',
            isLoading: false,
          });
          
          // Показуємо повідомлення про успіх
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
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await ApiService.getCurrentUser(token);
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

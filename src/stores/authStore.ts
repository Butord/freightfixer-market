
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
  
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
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
          if (response.user.role === 'admin' && response.user.status === 'pending') {
            set({ isLoading: false });
            toast.error('Ваш обліковий запис адміністратора очікує підтвердження');
            return;
          }
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isAdmin: response.user.role === 'admin',
            isLoading: false,
          });
          toast.success('Успішний вхід!');
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Невідома помилка авторизації',
          });
          toast.error(error instanceof Error ? error.message : 'Невідома помилка авторизації');
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Перевіряємо, чи це реєстрація адміністратора з використанням спеціального коду
          const isFirstAdminSetup = userData.role === 'admin' && userData.adminSecretCode === import.meta.env.VITE_ADMIN_SECRET_CODE;
          
          // Якщо є секретний код для першого адміністратора, видаляємо його з даних перед відправкою на сервер
          if (isFirstAdminSetup) {
            // Видаляємо секретний код з об'єкта перед відправкою на сервер
            const { adminSecretCode, ...dataToSend } = userData;
            const response = await ApiService.register(dataToSend);
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isAdmin: response.user.role === 'admin',
              isLoading: false,
            });
            toast.success('Реєстрація адміністратора успішна!');
          } else {
            const response = await ApiService.register(userData);
            
            // Перевіряємо, чи це реєстрація адміністратора без секретного коду
            if (userData.role === 'admin') {
              toast.info('Ваш запит на створення облікового запису адміністратора надіслано. Очікуйте підтвердження.');
              set({ isLoading: false });
              return;
            }
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isAdmin: response.user.role === 'admin',
              isLoading: false,
            });
            toast.success('Реєстрація успішна!');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Невідома помилка реєстрації',
          });
          toast.error(error instanceof Error ? error.message : 'Невідома помилка реєстрації');
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

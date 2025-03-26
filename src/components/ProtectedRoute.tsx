
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading, user, checkAuth, token, isTokenValid } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // Перевіряємо авторизацію при монтуванні компонента
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log('Verifying authentication in ProtectedRoute');
        // Перевіряємо чи токен ще валідний перед запитом до API
        if (!isTokenValid()) {
          console.log('Token is invalid or expired');
          setIsChecking(false);
          return;
        }
        await checkAuth();
      } catch (error) {
        console.error('Error in verifyAuth:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    if (token) {
      verifyAuth();
    } else {
      console.log('No token found in ProtectedRoute');
      setIsChecking(false);
    }
  }, [checkAuth, token, isTokenValid]);

  // Показуємо індикатор завантаження під час перевірки або завантаження даних
  if (isLoading || isChecking) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Завантаження...</p>
      </div>
    );
  }

  // Якщо потрібні права адміністратора, але користувач не адмін
  if (requireAdmin && !isAdmin) {
    console.log('Admin required but user is not admin, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Перевіряємо статус користувача (для адміністраторів)
  if (user?.role === 'admin' && user?.status === 'pending' && requireAdmin) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Очікування підтвердження</h1>
        <p className="text-lg text-center">
          Ваш обліковий запис адміністратора очікує підтвердження. 
          Будь ласка, зв'яжіться з головним адміністратором системи.
        </p>
      </div>
    );
  }

  // Якщо потрібна авторизація, але користувач не авторизований
  if (!isAuthenticated) {
    console.log('Authentication required but user is not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Якщо все ок, повертаємо вміст маршруту
  console.log('Protected route check passed, rendering content');
  return <Outlet />;
}

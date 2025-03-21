
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading, user, checkAuth, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  // Перевіряємо авторизацію при монтуванні компонента
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } finally {
        setIsChecking(false);
      }
    };
    
    if (token) {
      verifyAuth();
    } else {
      setIsChecking(false);
    }
  }, [checkAuth, token]);

  // Показуємо індикатор завантаження під час перевірки або завантаження даних
  if (isLoading || isChecking) {
    return <div className="flex justify-center items-center h-screen">Завантаження...</div>;
  }

  // Якщо потрібні права адміністратора, але користувач не адмін
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Перевіряємо статус користувача (для адміністраторів)
  if (user?.role === 'admin' && user?.status === 'pending' && requireAdmin) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Очікування підтвердження</h1>
        <p className="text-lg">
          Ваш обліковий запис адміністратора очікує підтвердження. 
          Будь ласка, зв'яжіться з головним адміністратором системи.
        </p>
      </div>
    );
  }

  // Якщо потрібна авторизація, але користувач не авторизований
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Якщо все ок, повертаємо вміст маршруту
  return <Outlet />;
}

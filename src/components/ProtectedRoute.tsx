
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();

  // Перевіряємо завантаження
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Завантаження...</div>;
  }

  // Якщо потрібні права адміністратора, але користувач не адмін
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Якщо потрібна авторизація, але користувач не авторизований
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Якщо все ок, повертаємо вміст маршруту
  return <Outlet />;
}

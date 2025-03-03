
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';

export default function UserMenu() {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Вхід
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="outline" size="sm">
            Реєстрація
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Мій акаунт</DropdownMenuLabel>
        <DropdownMenuItem disabled>
          {user?.name || 'Користувач'}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {user?.email || 'email@example.com'}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin">Адмін-панель</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/profile">Профіль</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders">Мої замовлення</Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout} className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Вийти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

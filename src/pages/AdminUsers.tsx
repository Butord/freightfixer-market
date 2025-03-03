
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import ApiService from '@/services/api';
import { User, UserUpdateRequest } from '@/types/auth';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (!token) return;
      const data = await ApiService.getUsers(token);
      setUsers(data);
    } catch (error) {
      toast.error('Помилка отримання списку користувачів');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleUpdateUser = async (user: User, updates: Partial<UserUpdateRequest>) => {
    try {
      if (!token) return;
      
      const updateData: UserUpdateRequest = {
        id: user.id,
        ...updates
      };
      
      await ApiService.updateUser(token, updateData);
      toast.success('Користувача оновлено');
      fetchUsers();
    } catch (error) {
      toast.error('Помилка оновлення користувача');
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      try {
        if (!token) return;
        await ApiService.deleteUser(token, id);
        toast.success('Користувача видалено');
        fetchUsers();
      } catch (error) {
        toast.error('Помилка видалення користувача');
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Керування користувачами</h1>
      
      {loading ? (
        <div className="flex justify-center">Завантаження...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Ім'я</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата створення</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role === 'admin' ? 'Адміністратор' : 'Користувач'}</TableCell>
                  <TableCell>
                    {user.status === 'pending' ? (
                      <span className="text-yellow-500">Очікує підтвердження</span>
                    ) : (
                      <span className="text-green-500">Активний</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateUser(user, { status: 'active' })}
                        >
                          Підтвердити
                        </Button>
                      )}
                      
                      {user.role === 'user' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateUser(user, { role: 'admin' })}
                        >
                          Зробити адміном
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateUser(user, { role: 'user' })}
                        >
                          Зробити користувачем
                        </Button>
                      )}
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

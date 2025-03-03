
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import ApiService from '@/services/api';
import { User, UserUpdateRequest, RegisterRequest } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New admin form state
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

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
  
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newAdminPassword !== newAdminConfirmPassword) {
      toast.error('Паролі не співпадають');
      return;
    }
    
    setIsCreatingAdmin(true);
    
    try {
      const adminData: RegisterRequest = {
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        password_confirm: newAdminConfirmPassword,
        role: 'admin'
      };
      
      await ApiService.register(adminData);
      toast.success('Запит на створення адміністратора надіслано');
      
      // Reset form
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminConfirmPassword('');
      setIsDialogOpen(false);
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      toast.error('Помилка створення адміністратора');
      console.error(error);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Керування користувачами</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Створити адміністратора</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Створити нового адміністратора</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="adminName">Ім'я</Label>
                <Input
                  id="adminName"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="adminEmail">Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="adminPassword">Пароль</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="adminConfirmPassword">Підтвердіть пароль</Label>
                <Input
                  id="adminConfirmPassword"
                  type="password"
                  value={newAdminConfirmPassword}
                  onChange={(e) => setNewAdminConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Скасувати
                </Button>
                <Button type="submit" disabled={isCreatingAdmin}>
                  {isCreatingAdmin ? 'Створення...' : 'Створити'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
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

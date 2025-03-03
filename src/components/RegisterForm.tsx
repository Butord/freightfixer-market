
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register({
        name,
        email,
        password,
        password_confirm: confirmPassword,
        role
      });
      
      if (role === 'admin') {
        navigate('/login');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Ім'я</Label>
          <Input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Підтвердіть пароль</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="role">Роль</Label>
          <Select value={role} onValueChange={(value) => setRole(value as 'user' | 'admin')}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Виберіть роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Користувач</SelectItem>
              <SelectItem value="admin">Адміністратор</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
        </Button>
        
        <div className="text-center text-sm mt-4">
          <p>
            Вже маєте обліковий запис?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Увійти
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

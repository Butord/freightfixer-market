
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

export default function AdminSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { register } = useAuthStore();
  
  // Get the secret code from env (for display hint, not for auto-filling)
  const adminSecretCodeEnv = import.meta.env.VITE_ADMIN_SECRET_CODE || '';
  
  useEffect(() => {
    console.log('Admin setup component loaded, secret code config available:', 
      adminSecretCodeEnv ? 'yes' : 'no');
    
    // If there's a code in the env var, log its first few characters for debugging
    if (adminSecretCodeEnv) {
      const visibleLength = Math.min(3, adminSecretCodeEnv.length);
      const maskedCode = adminSecretCodeEnv.substring(0, visibleLength) + 
        '*'.repeat(adminSecretCodeEnv.length - visibleLength);
      console.log('Admin code hint:', maskedCode, '(length:', adminSecretCodeEnv.length, ')');
    }
  }, [adminSecretCodeEnv]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    
    if (!secretCode) {
      setError('Секретний код обов\'язковий для реєстрації першого адміністратора');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting to register admin with secret code');
      const result = await register({
        name,
        email,
        password,
        password_confirm: confirmPassword,
        role: 'admin',
        adminSecretCode: secretCode
      });
      
      console.log('Registration result:', result);
      
      if (result.success) {
        toast.success('Перший адміністратор успішно створений!');
        navigate('/login');
      } else {
        setError(result.message || 'Виникла помилка під час налаштування адміністратора');
        toast.error(result.message || 'Виникла помилка під час налаштування адміністратора');
      }
    } catch (error) {
      console.error('Admin setup error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Виникла помилка під час налаштування адміністратора';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Налаштування першого адміністратора</h1>
      
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <Alert className="mb-6 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertTitle>Важлива інформація</AlertTitle>
          <AlertDescription>
            Для налаштування першого адміністратора потрібен секретний код, який має бути встановлений 
            у змінній оточення <code>ADMIN_SECRET_CODE</code> на сервері.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Помилка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
            <Label htmlFor="secretCode">Секретний код адміністратора</Label>
            <Input 
              id="secretCode" 
              type="password" 
              value={secretCode} 
              onChange={(e) => setSecretCode(e.target.value)} 
              required 
            />
            <p className="text-sm text-gray-500 mt-1">
              Введіть секретний код для налаштування першого адміністратора сайту.
              Код має бути встановлений у змінній оточення ADMIN_SECRET_CODE на сервері.
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Реєстрація...' : 'Створити адміністратора'}
          </Button>
        </form>
      </div>
    </div>
  );
}

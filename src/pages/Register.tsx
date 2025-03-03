
import RegisterForm from '@/components/RegisterForm';

export default function Register() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Реєстрація нового користувача</h1>
      <RegisterForm />
    </div>
  );
}

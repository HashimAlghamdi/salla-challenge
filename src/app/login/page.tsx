import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | متجر تجريبي',
  description: 'تسجيل الدخول إلى حسابك',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-8">
      <LoginForm />
    </div>
  );
}

import { Metadata } from 'next';
import LoginForm from './LoginForm';
import { Suspense } from 'react';
import Loader from '../components/Loader';

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
    <Suspense fallback={<Loader />}>
      <LoginForm />
    </Suspense>
  );
}

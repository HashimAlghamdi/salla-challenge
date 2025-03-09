import { Suspense } from 'react';
import { fetchWithAuth } from '@/app/utils/serverFetch';
import { Cart } from '@/interfaces/Cart';
import { Metadata } from 'next';
import CartDetails from './CartDetails';
import Loader from '@/app/components/Loader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'سلة المشتريات',
  description: 'عرض وإدارة سلة المشتريات الخاصة بك',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'سلة المشتريات | متجر التجربة الجميلة',
    description: 'عرض وإدارة سلة المشتريات الخاصة بك',
    type: 'website',
  },
};

async function getCartData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    redirect('/login?redirect=/cart');
  }

  try {
    const cart = await fetchWithAuth<Cart>('/cart/');
    return { cart, error: null };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      cart: null,
      error: 'Failed to load cart. Please try again later.',
    };
  }
}

export default async function CartPage() {
  const { cart, error } = await getCartData();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loader className="w-1/3 h-[60vh]" />}>
      <CartDetails initialData={cart} />
    </Suspense>
  );
}

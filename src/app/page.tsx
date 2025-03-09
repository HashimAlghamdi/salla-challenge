import { Suspense } from 'react';
import { publicFetch } from '@/app/utils/serverFetch';
import { Product } from '@/interfaces/Product';
import { Category } from '@/interfaces/Category';
import { Metadata } from 'next';
import ClientHomePage from './ClientHomePage';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

export const metadata: Metadata = {
  title: 'متجر تجريبي | الصفحة الرئيسية',
  description: 'تسوق أحدث المنتجات في متجرنا',
  openGraph: {
    title: 'متجر تجريبي | الصفحة الرئيسية',
    description: 'تسوق أحدث المنتجات في متجرنا',
    images: ['https://cdn.salla.network/images/logo/logo-square.png'],
  },
};

async function getInitialData() {
  try {
    const [products, categories] = await Promise.all([
      publicFetch<Product[]>('/product/'),
      publicFetch<Category[]>('/category/'),
    ]);

    return {
      products: products || [],
      categories: categories || [],
      error: null,
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      products: [],
      categories: [],
      error: 'Failed to load initial data. Please try again later.',
    };
  }
}

export default async function HomePage() {
  const { products, categories, error } = await getInitialData();

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <Suspense fallback={<Loader className="w-1/3 h-[60vh]" />}>
      <ClientHomePage initialData={{ products, categories }} />
    </Suspense>
  );
}

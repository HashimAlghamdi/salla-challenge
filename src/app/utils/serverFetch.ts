import { cookies } from 'next/headers';
import { env } from '@/config/env';

export async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    const response = await fetch(`${env.API_URL}${endpoint}/?token=${token?.value}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    // Log the response status and URL for debugging
    console.log(`Fetching ${endpoint}: Status ${response.status}`);

    if (!response.ok) {
      // Try to get error message from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Return empty arrays if data is null or undefined
    if (!data && endpoint.includes('/product')) return [] as unknown as T;
    if (!data && endpoint.includes('/categories')) return [] as unknown as T;

    return data;
  } catch (error) {
    console.error('Server fetch error:', error);
    // Return empty arrays as fallback for specific endpoints
    if (endpoint.includes('/product')) return [] as unknown as T;
    if (endpoint.includes('/category')) return [] as unknown as T;
    throw error;
  }
}
export async function publicFetch<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${env.API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Return empty arrays as fallback
    if (!data && endpoint.includes('/product/')) return [] as unknown as T;
    if (!data && endpoint.includes('/category/')) return [] as unknown as T;

    return data;
  } catch (error) {
    console.error('Public fetch error:', error);
    // Return empty arrays as fallback for specific endpoints
    if (endpoint.includes('/product/')) return [] as unknown as T;
    if (endpoint.includes('/category/')) return [] as unknown as T;
    throw error;
  }
}

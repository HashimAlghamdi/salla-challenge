import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export const getServerAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
};

export const isServerTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 > Date.now() : false;
  } catch {
    return false;
  }
};

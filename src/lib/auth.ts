import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getSessionStoreId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adaptiq_session')?.value;
  
  if (!token) return null;

  try {
    const secretKey = new TextEncoder().encode(process.env.SHOPIFY_API_SECRET || 'fallback_secret');
    const { payload } = await jwtVerify(token, secretKey);
    return payload.storeId as string;
  } catch (err) {
    return null;
  }
}

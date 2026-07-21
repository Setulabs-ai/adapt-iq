'use server';

import { cookies } from 'next/headers';

export async function authenticate(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Simple mock auth for demo purposes. 
  // In a real app, you would verify this against Supabase Auth:
  // const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (email && password === 'setulabs2026') {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', 'mock_secure_token', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return { success: true };
  } else {
    return { error: 'Invalid credentials. Hint: use password setulabs2026' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

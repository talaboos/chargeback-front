import NextAuth from 'next-auth';
import { authOptions } from '@/services/auth';

function handler(req, context) {
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');
  if (host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return NextAuth(authOptions)(req, context);
}

export { handler as GET, handler as POST };

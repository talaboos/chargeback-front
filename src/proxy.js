import { NextResponse } from 'next/server';

export default async function proxy(req) {
  const session = !!req.cookies.get(
    process.env.NEXT_PUBLIC_NEXTAUTH_AUTH_SESSION_FILD,
  );
  if (!session) {
    return NextResponse.redirect(new URL('/login/verification', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home/:path*',
    '/home',
    '/settings',
    '/ai-assistant',
    '/ai-assistant/:path*',
  ],
};

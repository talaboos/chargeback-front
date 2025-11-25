import { NextResponse } from 'next/server';

export default async function proxy(req) {
  const session = !!req.cookies.get('__Secure-next-auth.session-token');
  if (!session) {
    return NextResponse.redirect(new URL('/login/verification', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/home'],
};

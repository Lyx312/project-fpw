import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function authMiddleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('userToken')?.value;
  console.log(token);
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    jwt.verify(token, jwtSecret);
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const authConfig = {
  matcher: ['/detail/:path*'],
};
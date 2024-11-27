import { NextRequest } from 'next/server';
import { authMiddleware } from './middlewares/authMiddleware';

export function middleware(req: NextRequest) {
  
  return authMiddleware(req);

}

export const config = {
  matcher: [
    '/detail/:path*',
  ],
};
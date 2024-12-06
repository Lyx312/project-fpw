import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './middlewares/authMiddleware';



export function middleware(req: NextRequest) {
  
  return authMiddleware(req);

  return NextResponse.next();

}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

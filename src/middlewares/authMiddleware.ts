import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/assets",
  "/posts",
]

const CLIENT_ROUTES = [
  "/detail",
]

const FREELANCER_ROUTES = [
  "",
]

const ADMIN_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/category",
  "/admin/country",
  "/admin/transaction",
  "/admin/application/:id" //not sure if this is how it's written here
]

const isPublicRoute = (url: URL) => {
  return PUBLIC_ROUTES.find((route) => url.pathname.startsWith(route)) || url.pathname == "/";
}

export async function authMiddleware(request: NextRequest) {
  const { nextUrl } = request;

  if (isPublicRoute(nextUrl)) {
    console.log('public route');
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('userToken')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  try {
    const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    await jwtVerify(token, jwtSecret);
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
    
}
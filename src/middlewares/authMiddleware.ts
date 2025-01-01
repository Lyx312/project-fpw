import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/assets",
  "/posts",
  "/profile",
  "/pfp",
]

const USER_ROUTES = [
  "/my-profile",
  "/chat",
]

const CLIENT_ROUTES = [
  "/client",
]

const FREELANCER_ROUTES = [
  "/freelancer",
]

const ADMIN_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/category",
  "/admin/country",
  "/admin/transaction",
  "/admin/application/:id" //not sure if this is how it's written here
]

const checkRoute = (ROUTES: Array<string>, url: URL) => {
  return ROUTES.find((route) => url.pathname.startsWith(route));
}

export async function authMiddleware(request: NextRequest) {
  const { nextUrl } = request;

  if (checkRoute(PUBLIC_ROUTES, nextUrl) || nextUrl.pathname == '/') {
    // console.log('public route');
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
    const { payload } = await jwtVerify(token, jwtSecret);

    if (checkRoute(USER_ROUTES, nextUrl)) {
      return NextResponse.next();
    }

    if (payload.role === 'admin') {
      if (!ADMIN_ROUTES.find((route) => nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', nextUrl));
      }
    } else if (payload.role === 'client') {
      if (!CLIENT_ROUTES.find((route) => nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', nextUrl));
      }
    } else if (payload.role === 'freelancer') {
      if (!FREELANCER_ROUTES.find((route) => nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', nextUrl));
      }
    }

  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
    
}
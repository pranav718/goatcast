import {NextResponse} from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest){
    if(request.nextUrl.pathname.startsWith('/admin')){
        const isAuthenticated = request.cookies.get('admin-auth');

        if(!isAuthenticated || isAuthenticated.value !== 'true'){
            return NextResponse.redirect(new URL('/login', request.url));

        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*'
}
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { EloFrontRoutesEnum } from 'elo/front/react/Shared';

/* Routing middleware */

// Match all paths
export const config = {
  matcher: ['/chat/:path*', '/login'],
  //Object.values(EloFrontRoutesEnum),
};

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies?.get('sessionToken');

  if (
    !sessionToken &&
    request.nextUrl?.pathname.startsWith(EloFrontRoutesEnum.chat)
  ) {
    console.log('ºº REDIRECT TO LOGIN');
    return NextResponse.redirect(
      new URL(EloFrontRoutesEnum.login, request.url)
    );
  }
}

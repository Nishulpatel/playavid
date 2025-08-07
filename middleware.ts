import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
        
      //use for authenticated user

      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register")
        )
          return true;

        if (pathname == "/" || pathname.startsWith("/api/video")) {
          return true;
        }

        return !!token;
      },
    },
  }
);

//Snippit from hitesh
// middleware will run in order of matching pages

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * -next/static (static files)
     * -_next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder */

    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

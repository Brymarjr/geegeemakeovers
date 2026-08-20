import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect the dashboard routes
  if (pathname.startsWith("/dashboard")) {
    
    // Allow public access to the login page
    if (pathname === "/dashboard/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Force password change if the flag is active
      if (payload.requiresChange && pathname !== "/dashboard/setup-password") {
        return NextResponse.redirect(new URL("/dashboard/setup-password", request.url));
      }

      // Prevent accessing the setup page if they have already changed their password
      if (!payload.requiresChange && pathname === "/dashboard/setup-password") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // If the token is invalid or expired, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/dashboard/login", request.url));
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
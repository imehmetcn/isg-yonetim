import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // Korumalı rotalar
  const protectedPaths = [
    "/dashboard",
    "/risk-assessment",
    "/trainings",
    "/audits",
    "/documents",
    "/equipment",
    "/personnel",
    "/reports",
    "/profile",
    "/settings",
    "/notifications",
  ];

  const path = request.nextUrl.pathname;

  // Auth sayfalarına erişim kontrolü
  if ((path === "/auth/login" || path === "/auth/register") && token) {
    // Kullanıcı zaten giriş yapmışsa son ziyaret edilen sayfaya veya dashboard'a yönlendir
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl) {
      return NextResponse.redirect(new URL(decodeURI(callbackUrl), request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Korumalı bir sayfaya erişim kontrolü
  const isProtectedPath = protectedPaths.some(
    protectedPath => path === protectedPath || path.startsWith(`${protectedPath}/`)
  );

  if (isProtectedPath && !token) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Ana sayfaya erişim kontrolü
  if (path === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

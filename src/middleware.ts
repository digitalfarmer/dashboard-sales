export { default } from "next-auth/middleware";

export const config = { 
  // Rute mana saja yang harus login?
  matcher: ["/dashboard/:path*", "/pivot/:path*"] 
};
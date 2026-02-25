import { withAuth } from "next-auth/middleware";

// Kita bungkus secara eksplisit ke dalam fungsi default
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Lindungi semua route di dashboard dan pivot
  matcher: [
    "/dashboard/:path*", 
    "/pivot/:path*",
    "/api/protected/:path*"
  ],
};
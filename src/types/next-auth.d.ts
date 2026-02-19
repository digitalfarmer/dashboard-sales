import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    kodeCabang: string;
  }
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    kodeCabang: string;
  }
}
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        console.log("credentials:", credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log("Нет email или password");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
        console.log("user:", user);
        if (!user) {
          console.log("Пользователь не найден");
          return null;
        }

        const passwordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        console.log("passwordValid:", passwordValid);
        if (!passwordValid) {
          console.log("Пароль неверный");
          return null;
        }
        console.log("Успешная авторизация");
        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

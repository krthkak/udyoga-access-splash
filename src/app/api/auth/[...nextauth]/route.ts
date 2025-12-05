import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          role: true,
          status: true,
          email: true,
          id: true,
          first_name: true,
        },
      });

      if (dbUser) {
        token.role = dbUser.role;
        token.status = dbUser.status;
        token.id = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.first_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const adminEmail = await prisma.adminEmail.findUnique({
        where: { email: user.email! },
      });
      const collegeAdminEmail = await prisma.collegeAdmin.findUnique({
        where: { email: user.email! },
      });

      if (adminEmail) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "admin", status: "verified" },
        });
      }
      if (collegeAdminEmail) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "college-admin", status: "verified" },
        });
      }
    },
  },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

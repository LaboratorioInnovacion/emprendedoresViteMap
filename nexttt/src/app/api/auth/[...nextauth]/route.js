import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prisma.js";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password || !user.activo) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          rol: user.rol,
          emprendedorId: user.emprendedorId, // 👈 Añadido aquí
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.emprendedorId = user.emprendedorId; // 👈 Añadido aquí
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.rol = token.rol;
        session.user.emprendedorId = token.emprendedorId; // 👈 Añadido aquí
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "../../../../lib/prisma.js";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await prisma.usuario.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password || !user.activo) return null;

//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) return null;

//         return {
//           id: user.id,
//           email: user.email,
//           rol: user.rol,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.rol = user.rol;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session?.user) {
//         session.user.id = token.id;
//         session.user.rol = token.rol;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/login", // redirige al login personalizado
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// // /app/api/auth/[...nextauth]/route.ts (si usás App Router)
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// // import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "../../../../lib/prisma.js";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(Credentials, req) {
//         return null;
//       },
//     }),
//   ],
//   // callbacks: {
//   //   async session({ session, user }) {
//   //     // Inyecta el rol desde Prisma
//   //     if (session?.user) {
//   //       session.user.id = user.id;
//   //       session.user.rol = user.rol; // esto es clave
//   //     }
//   //     return session;
//   //   },
//   // },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// // nexttt/src/app/api/auth/[...nextauth]/route.js
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "../../../../lib/prisma";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         const user = await prisma.usuario.findUnique({
//           where: { email: credentials.email }
//         });
//         if (!user || !user.activo) return null;
//         const valid = await bcrypt.compare(credentials.password, user.password);
//         if (!valid) return null;
//         return { id: user.id, email: user.email, rol: user.rol };
//       }
//     })
//   ],
//   session: {
//     strategy: "jwt"
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) token.rol = user.rol;
//       return token;
//     },
//     async session({ session, token }) {
//       if (token?.rol) session.user.rol = token.rol;
//       return session;
//     }
//   },
//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/login"
//   }
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

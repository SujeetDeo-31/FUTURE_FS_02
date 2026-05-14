
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Fallback values for prototype robustness
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';
const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Simple check for prototype demo
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return { id: '1', name: 'Admin User', email: ADMIN_EMAIL };
        }

        // Check against hashed password if provided in env
        if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 20) {
          try {
            const isMatch = await bcrypt.compare(credentials.password, process.env.ADMIN_PASSWORD);
            if (isMatch && credentials.email === ADMIN_EMAIL) {
              return { id: '1', name: 'Admin User', email: ADMIN_EMAIL };
            }
          } catch (e) {
            console.error("Auth error", e);
          }
        }

        return null;
      },
    }),
  ],
  secret: SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
};

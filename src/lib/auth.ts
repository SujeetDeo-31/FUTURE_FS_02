import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Prevent crashes if env vars are missing
        if (!adminEmail || !adminPassword) {
          return null;
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email !== adminEmail) {
          return null;
        }

        try {
          // 1. Try direct bcrypt comparison if it's already a hash
          if (adminPassword.startsWith('$2')) {
            const isMatch = await bcrypt.compare(credentials.password, adminPassword);
            if (isMatch) {
              return { id: '1', name: 'Admin User', email: adminEmail };
            }
          }

          // 2. Try decoding from base64 (common for some CI/CD setups)
          try {
            const decoded = Buffer.from(adminPassword, 'base64').toString('utf-8');
            if (decoded.startsWith('$2')) {
              const isMatch = await bcrypt.compare(credentials.password, decoded);
              if (isMatch) {
                return { id: '1', name: 'Admin User', email: adminEmail };
              }
            }
          } catch (e) {
            // Silently fail if not base64
          }

          // 3. Last resort: plain text (only useful for initial dev setup)
          if (credentials.password === adminPassword) {
            return { id: '1', name: 'Admin User', email: adminEmail };
          }

          return null;
        } catch (error) {
          console.error('Authentication Error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

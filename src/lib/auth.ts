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

        if (!adminEmail || !adminPassword) {
          console.error('Auth Configuration Error: ADMIN_EMAIL or ADMIN_PASSWORD not set.');
          return null;
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email !== adminEmail) {
          return null;
        }

        try {
          let hashedPassword = adminPassword;
          // Robust check for base64 vs raw hash
          if (!adminPassword.startsWith('$2')) {
            hashedPassword = Buffer.from(adminPassword, 'base64').toString('utf-8');
          }

          const isMatch = await bcrypt.compare(credentials.password, hashedPassword);

          if (!isMatch) {
            return null;
          }

          return {
            id: '1',
            name: 'Admin User',
            email: adminEmail,
          };
        } catch (error) {
          console.error('Bcrypt comparison failed:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-stability',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
  },
};
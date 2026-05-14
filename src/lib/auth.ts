
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.password) {
          throw new Error('Invalid credentials');
        }

        const { username, password } = credentials;

        if (username !== process.env.ADMIN_USERNAME) {
          throw new Error('Invalid username');
        }

        const isPasswordMatch = await bcrypt.compare(
          password,
          process.env.ADMIN_PASSWORD as string
        );

        if (!isPasswordMatch) {
          throw new Error('Invalid password');
        }

        return { id: '1', name: 'Admin', email: 'admin@example.com' };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + '/dashboard';
    },
  },
};

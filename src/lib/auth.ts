import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET = process.env.NEXTAUTH_SECRET;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !SECRET) {
  throw new Error(
    'ADMIN_EMAIL, ADMIN_PASSWORD, and NEXTAUTH_SECRET must be set'
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },

        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email !== ADMIN_EMAIL) {
          return null;
        }

        const decodedPassword = Buffer.from(
          ADMIN_PASSWORD,
          'base64'
        ).toString('utf-8');

        const isMatch = await bcrypt.compare(
          credentials.password,
          decodedPassword
        );

        if (!isMatch) {
          return null;
        }

        return {
          id: '1',
          name: 'Admin User',
          email: ADMIN_EMAIL,
        };
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
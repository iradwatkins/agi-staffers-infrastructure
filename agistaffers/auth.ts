import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { sendVerificationRequest } from '@/lib/email/magic-link'
import Google from 'next-auth/providers/google'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true, // Fix UntrustedHost error
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    {
      id: 'gmail-magic-link',
      name: 'Email',
      type: 'email',
      from: process.env.GMAIL_USER,
      server: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
      maxAge: 10 * 60, // Magic links are valid for 10 minutes
      sendVerificationRequest,
    },
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-email',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
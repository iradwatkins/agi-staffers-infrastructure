import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut 
} = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // In production, fetch user from database
        // For now, use mock user
        const mockUser = {
          id: '1',
          email: 'iradwatkins@gmail.com',
          name: 'Ira D. Watkins',
          // In production, password would be hashed
          password: 'Iw2006js!321',
        }
        
        if (credentials.email === mockUser.email && 
            credentials.password === mockUser.password) {
          return {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
          }
        }
        
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
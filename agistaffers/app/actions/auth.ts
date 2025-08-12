'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export async function sendMagicLink(
  email: string,
  callbackUrl: string = '/admin'
) {
  try {
    await signIn('gmail-magic-link', {
      email,
      redirectTo: callbackUrl,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { 
        success: false, 
        error: 'Failed to send magic link. Please try again.' 
      }
    }
    throw error
  }
}

export async function signOutUser() {
  try {
    await signOut({ redirectTo: '/login' })
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}
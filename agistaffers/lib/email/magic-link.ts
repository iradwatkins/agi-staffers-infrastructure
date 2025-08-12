import { sendEmail } from './gmail-client'
import { getMagicLinkEmailHtml, getMagicLinkEmailText } from './templates'
import type { Theme } from 'next-auth'

export async function sendVerificationRequest(params: {
  identifier: string
  url: string
  provider: {
    server?: string
    from?: string
    maxAge?: number
  }
  theme?: Theme
}) {
  const { identifier: to, url } = params
  const { host } = new URL(url)

  try {
    const result = await sendEmail({
      to,
      subject: `Sign in to ${host}`,
      html: getMagicLinkEmailHtml({ url, host }),
      text: getMagicLinkEmailText({ url, host }),
    })

    if (!result.success) {
      throw new Error(`Failed to send magic link email: ${result.error}`)
    }

    console.log(`Magic link email sent to ${to}`)
  } catch (error) {
    console.error('Error sending magic link:', error)
    throw new Error('Failed to send magic link email')
  }
}
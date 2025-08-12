import { createTransport } from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

export function getGmailTransporter(): Transporter {
  if (!transporter) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.')
    }

    transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  return transporter
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  const mailTransporter = getGmailTransporter()
  
  const mailOptions = {
    from: `AGI Staffers <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  }

  try {
    const result = await mailTransporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
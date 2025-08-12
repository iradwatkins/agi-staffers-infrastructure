export function getMagicLinkEmailHtml({ url, host }: { url: string; host: string }) {
  const escapedHost = host.replace(/\./g, '&#8203;.')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to ${escapedHost}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(to bottom, #f3f4f6, #e5e7eb); min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 20px 20px 20px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: inline-block; margin-bottom: 20px;">
                <div style="color: white; font-size: 32px; font-weight: bold; line-height: 60px; text-align: center;">A</div>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">Welcome to AGI Staffers</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; color: #6b7280;">Sign in to your account</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                Click the button below to sign in to your AGI Staffers account. This magic link will expire in 10 minutes.
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td align="center" style="padding: 0 40px 30px 40px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: white; text-decoration: none; border-radius: 8px;">
                      Sign in to AGI Staffers
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Alternative link -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                Or copy and paste this URL into your browser:
              </p>
              <p style="margin: 10px 0 0 0; padding: 12px; background: #f9fafb; border-radius: 6px; font-size: 13px; line-height: 20px; color: #4b5563; word-break: break-all;">
                ${url}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #9ca3af; text-align: center;">
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 13px; line-height: 20px; color: #9ca3af; text-align: center;">
                © ${new Date().getFullYear()} AGI Staffers. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export function getMagicLinkEmailText({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}

Click the link below to sign in to your AGI Staffers account:

${url}

This link will expire in 10 minutes.

If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} AGI Staffers. All rights reserved.`
}
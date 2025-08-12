import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Sparkles } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center space-y-1">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="text-base">
            A sign-in link has been sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              Click the magic link in your email to sign in to AGI Staffers. The link will expire in 10 minutes.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Didn't receive the email?</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check your spam or junk folder</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Make sure you entered the correct email address</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Try requesting a new magic link</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
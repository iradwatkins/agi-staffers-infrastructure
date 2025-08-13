'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/hooks/useLanguage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Lock, Mail, Shield, AlertCircle, Bot } from 'lucide-react'

export default function AdminLoginPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simple validation for demo
      if (email === 'admin@agistaffers.com' && password === 'admin123') {
        // Simulate successful login
        router.push('/admin')
      } else {
        setError(t?.adminLoginPage?.invalidCredentials || 'Invalid credentials. Use admin@agistaffers.com / admin123')
      }
    } catch (err) {
      setError(t?.loginPage?.unexpectedError || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Card className="w-full max-w-md mx-4 backdrop-blur-xl border-border/50 relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <Bot className="h-10 w-10 text-blue-500 mr-3" />
            <span className="text-3xl font-bold text-foreground">
              AGI STAFFERS
            </span>
          </div>
          <CardTitle className="text-2xl text-center">
            {t?.adminLoginPage?.adminPortal || 'Admin Portal'}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t?.adminLoginPage?.adminSignInDescription || 'Sign in to access the admin dashboard'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-600 dark:text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {!requiresTwoFactor ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t?.adminLoginPage?.email || 'Email'}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t?.adminLoginPage?.emailPlaceholder || 'admin@example.com'}
                      required
                      className="pl-10 bg-background border-border placeholder:text-muted-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t?.adminLoginPage?.password || 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t?.adminLoginPage?.passwordPlaceholder || 'Enter your password'}
                      required
                      className="pl-10 bg-background border-border placeholder:text-muted-foreground focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-border data-[state=checked]:bg-blue-500"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {t?.adminLoginPage?.rememberMe || 'Remember me for 30 days'}
                  </Label>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">
                  {t?.adminLoginPage?.twoFactorCode || 'Two-Factor Authentication Code'}
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder={t?.adminLoginPage?.twoFactorPlaceholder || 'Enter 6-digit code'}
                    required
                    maxLength={6}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter the code from your authenticator app
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t?.adminLoginPage?.signingIn || 'Signing in...'}
                </span>
              ) : (
                t?.adminLoginPage?.signIn || 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t?.adminLoginPage?.adminAccessOnly || 'Admin access only. Customer login at'}{' '}
              <a href="https://agistaffers.com/login" className="text-blue-500 hover:text-blue-400">
                {t?.adminLoginPage?.customerLoginAt || 'agistaffers.com'}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
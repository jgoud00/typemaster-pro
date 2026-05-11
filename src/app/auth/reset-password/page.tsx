import { resetPassword } from '@/app/auth/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
  const params = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-black tracking-tight">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Enter your email and we&apos;ll send you a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-white/80">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="bg-white/8 border-white/20 focus:border-primary/60 text-white placeholder:text-text-muted" 
                placeholder="you@example.com" 
              />
            </div>
            
            {params?.error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                {params.error}
              </div>
            )}
            {params?.message && (
              <div className="p-3 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center font-medium">
                {params.message}
              </div>
            )}
            
            <div className="flex flex-col gap-3 pt-2">
              <Button formAction={resetPassword} variant="default" className="w-full font-bold h-12 text-md">
                Send Reset Link
              </Button>
              <Link href="/login">
                <Button variant="ghost" className="w-full text-muted-foreground gap-2" type="button">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

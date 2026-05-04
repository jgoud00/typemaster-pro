import { login, signup } from '@/app/auth/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
  const params = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-black text-primary tracking-tight">Aloo Type</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Log in to save your stats and climb the leaderboard.
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
                className="bg-black/20 border-white/10 focus:border-primary/50 text-white" 
                placeholder="you@example.com" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-white/80">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-black/20 border-white/10 focus:border-primary/50 text-white" 
                placeholder="••••••••"
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
            
            <div className="flex flex-col gap-3 pt-4">
              <Button formAction={login} variant="default" className="w-full font-bold h-12 text-md">
                Log In
              </Button>
              <Button formAction={signup} variant="secondary" className="w-full font-bold h-12 text-md bg-white/5 hover:bg-white/10 text-white border border-white/10">
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

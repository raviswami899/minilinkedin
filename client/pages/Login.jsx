import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to home
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    //   <div className="w-full max-w-md">
    //     <div className="text-center mb-8">
    //       <h1 className="text-3xl font-bold text-primary mb-2">MiniLinkedin</h1>
    //       <p className="text-muted-foreground">Welcome back to your professional community</p>
    //     </div>

    //     <Card className="shadow-xl border-0">
    //       <CardHeader className="space-y-1">
    //         <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
    //         <CardDescription>
    //           Enter your email and password to access your account
    //         </CardDescription>
    //       </CardHeader>
    //       <form onSubmit={handleSubmit}>
    //         <CardContent className="space-y-4">
    //           {error && (
    //             <Alert variant="destructive">
    //               <AlertDescription>{error}</AlertDescription>
    //             </Alert>
    //           )}
              
    //           <div className="space-y-2">
    //             <Label htmlFor="email">Email</Label>
    //             <div className="relative">
    //               <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
    //               <Input
    //                 id="email"
    //                 type="email"
    //                 placeholder="Enter your email"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 className="pl-10"
    //                 required
    //               />
    //             </div>
    //           </div>
              
    //           <div className="space-y-2">
    //             <Label htmlFor="password">Password</Label>
    //             <div className="relative">
    //               <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
    //               <Input
    //                 id="password"
    //                 type="password"
    //                 placeholder="Enter your password"
    //                 value={password}
    //                 onChange={(e) => setPassword(e.target.value)}
    //                 className="pl-10"
    //                 required
    //               />
    //             </div>
    //           </div>
    //         </CardContent>
            
    //         <CardFooter className="flex flex-col space-y-4">
    //           <Button 
    //             type="submit" 
    //             className="w-full" 
    //             disabled={loading}
    //           >
    //             {loading ? (
    //               <>
    //                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    //                 Signing in...
    //               </>
    //             ) : (
    //               'Sign in'
    //             )}
    //           </Button>
              
    //           <p className="text-center text-sm text-muted-foreground">
    //             Don't have an account?{' '}
    //             <Link 
    //               to="/register" 
    //               className="font-medium text-primary hover:underline"
    //             >
    //               Sign up
    //             </Link>
    //           </p>
    //         </CardFooter>
    //       </form>
    //     </Card>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6">
  <div className="w-full max-w-md">
    <div className="text-center mb-6">
      <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2">MiniLinkedIn</h1>
      <p className="text-base text-muted-foreground">Connect. Share. Grow.</p>
    </div>

    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold text-primary">Sign In</CardTitle>
        <CardDescription className="text-sm">
          Enter your credentials to continue
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full rounded-full text-base " disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
</div>

  );
}

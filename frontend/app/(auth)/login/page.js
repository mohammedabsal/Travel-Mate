'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: '/dashboard'
      });

      if (result?.error) {
        toast.error('Invalid credentials');
        return;
      }

      window.location.href = '/dashboard';
    });
  });

  return (
    <div className="grid min-h-screen place-items-center px-6 py-10">
      <Card className="w-full max-w-md rounded-3xl bg-slate-900/95 backdrop-blur border-slate-700 p-8">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-2xl text-white mb-4">Login Screen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <Input
                placeholder="Email"
                type="email"
                {...register('email')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2"
              />
            </div>

            {/* Password Field */}
            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register('password')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2"
              />
            </div>

            {/* Login Button */}
            <Button
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold"
              type="submit"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Login Button'}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400">
            <Link href="/forgot-password" className="hover:text-slate-300 transition-colors">
              Forgot password?
            </Link>
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
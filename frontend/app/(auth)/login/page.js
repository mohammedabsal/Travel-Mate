'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="w-full max-w-md rounded-[2rem] bg-white/80 backdrop-blur dark:bg-slate-950/70">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue planning your trips.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Email" type="email" {...register('email')} />
            <Input placeholder="Password" type="password" {...register('password')} />
            <Button className="w-full" type="submit" disabled={isPending}>{isPending ? 'Signing in...' : 'Sign in'}</Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <Link href="/forgot-password">Forgot password?</Link>
            <Link href="/signup">Create account</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
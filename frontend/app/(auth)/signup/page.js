'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signupSchema } from '@/lib/validations';
import { signupAction } from '@/actions/auth-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await signupAction(values);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      window.location.href = '/login';
    });
  });

  return (
    <div className="grid min-h-screen place-items-center px-6 py-10">
      <Card className="w-full max-w-md rounded-[2rem] bg-white/80 backdrop-blur dark:bg-slate-950/70">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Set up secure access to your travel workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Full name" {...register('name')} />
            <Input placeholder="Email" type="email" {...register('email')} />
            <Input placeholder="Password" type="password" {...register('password')} />
            <Button className="w-full" type="submit" disabled={isPending}>{isPending ? 'Creating account...' : 'Create account'}</Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
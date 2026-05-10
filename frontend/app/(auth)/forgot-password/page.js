'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="grid min-h-screen place-items-center px-6 py-10">
      <Card className="w-full max-w-md rounded-[2rem] bg-white/80 backdrop-blur dark:bg-slate-950/70">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>We will wire email delivery next. For now this is the UI shell.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
          <Button className="w-full" onClick={() => toast.success(`Reset link would be sent to ${email || 'your email'}`)}>Send reset link</Button>
        </CardContent>
      </Card>
    </div>
  );
}
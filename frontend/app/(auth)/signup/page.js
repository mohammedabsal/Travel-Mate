'use client';

import Link from 'next/link';
import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signupSchema } from '@/lib/validations';
import { signupAction } from '@/actions/auth-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { register, handleSubmit } = useForm({ resolver: zodResolver(signupSchema) });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await signupAction({
        firstName: values.firstName,
        lastName: values.lastName,
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        phone: values.phone,
        city: values.city,
        country: values.country,
        bio: values.bio,
        image: photoPreview || values.image
      });

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
      <Card className="w-full max-w-2xl rounded-3xl bg-slate-900/95 backdrop-blur border-slate-700 p-8">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-2xl text-white mb-4">Registration (Screen 2)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex justify-center mb-8">
              <label className="cursor-pointer">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center bg-slate-800 hover:bg-slate-700 transition-colors overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-sm">Photo</span>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* First Name and Last Name - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                {...register('firstName')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2"
              />
              <Input
                placeholder="Last Name"
                {...register('lastName')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2"
              />
            </div>

            {/* Email and Phone - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Email Address"
                type="email"
                {...register('email')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2"
              />
              <Input
                placeholder="Phone Number"
                type="tel"
                {...register('phone')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2"
              />
            </div>

            {/* City and Country - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="City"
                {...register('city')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2"
              />
              <Input
                placeholder="Country"
                {...register('country')}
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

            {/* Additional Information - Wider Textarea */}
            <div>
              <Textarea
                placeholder="Additional Information ...."
                {...register('bio')}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg py-2 resize-none"
                rows={4}
              />
            </div>

            {/* Register Users Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold"
              type="submit"
              disabled={isPending}
            >
              {isPending ? 'Creating account...' : 'Register Users'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
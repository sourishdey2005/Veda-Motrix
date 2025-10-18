
import Image from 'next/image';
import Link from 'next/link';
import { SignupForm } from '@/components/signup-form';
import { VedaMotrixLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DemoCredentialCard } from '@/components/credential-card';

export default function SignupPage() {
  const signupBg = PlaceHolderImages.find(img => img.id === 'signup-bg');
  
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-[400px] gap-6 px-4">
          <div className="grid gap-2 text-center mb-6">
             <VedaMotrixLogo className="h-12 w-12 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Join VEDA-MOTRIX AI and take control of your vehicle's health.
            </p>
          </div>

          <SignupForm />

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login/user" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {signupBg && (
           <Image
            src={signupBg.imageUrl}
            alt="Lush green grass with sunlight"
            fill
            data-ai-hint={signupBg.imageHint}
            className="h-full w-full object-cover"
          />
        )}
         <div className="absolute top-6 right-6 z-10">
          <DemoCredentialCard />
        </div>
      </div>
    </div>
  );
}


import Image from 'next/image';
import { SignupForm } from '@/components/signup-form';
import { VedaMotrixLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DemoCredentialCard } from '@/components/credential-card';

export default function SignupPage() {
  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');
  
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-full max-w-[400px] gap-6 px-4">
          <div className="grid gap-2 text-center mb-6">
             <VedaMotrixLogo className="h-12 w-12 mx-auto" />
            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Join VEDA-MOTRIX AI and take control of your vehicle's health.
            </p>
          </div>

          <SignupForm />

        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginBg && (
           <Image
            src={loginBg.imageUrl}
            alt="Abstract AI background"
            width="1920"
            height="1080"
            data-ai-hint={loginBg.imageHint}
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        )}
      </div>

       <div className="fixed top-6 right-6 z-10 hidden lg:block">
          <DemoCredentialCard />
      </div>
    </div>
  );
}

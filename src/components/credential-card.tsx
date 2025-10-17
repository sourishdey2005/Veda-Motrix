
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Fingerprint, Info, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CredentialCardProps {
  role: string;
  email: string;
  password?: string;
}

export function CredentialCard({ role, email, password }: CredentialCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const handleFlip = () => setIsFlipped(!isFlipped);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${fieldName} Copied`,
        description: `${text} has been copied to your clipboard.`,
      });
    }, (err) => {
      toast({
        title: "Copy Failed",
        description: "Could not copy text.",
        variant: "destructive",
      });
    });
  };


  return (
    <div className="perspective-1000">
       <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
      <div
        className={cn(
          'relative h-48 w-full transform-style-3d transition-transform duration-700',
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        {/* Front of the card */}
        <div className="absolute backface-hidden h-full w-full">
          <Card className="h-full flex flex-col justify-between text-center">
            <CardHeader>
              <CardTitle className="text-base">{role} Access</CardTitle>
            </CardHeader>
            <CardContent>
              <Fingerprint className="mx-auto h-12 w-12 text-primary" />
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleFlip}>
                <Info className="mr-2" />
                View Credentials
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute backface-hidden h-full w-full rotate-y-180">
           <Card className="h-full flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base">{role} Credentials</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 text-xs">
                <div>
                    <p className="font-semibold">Email:</p>
                    <p className="font-mono bg-muted p-1 rounded cursor-pointer" onClick={() => copyToClipboard(email, 'Email')}>{email}</p>
                </div>
                 {password && (
                    <div>
                        <p className="font-semibold">Password:</p>
                        <p className="font-mono bg-muted p-1 rounded cursor-pointer" onClick={() => copyToClipboard(password, 'Password')}>{password}</p>
                    </div>
                 )}
              <Button variant="secondary" size="sm" className="w-full mt-2" onClick={handleFlip}>
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

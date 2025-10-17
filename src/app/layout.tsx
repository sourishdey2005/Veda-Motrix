import type {Metadata} from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import {AuthProvider} from '@/hooks/use-auth';
import {Toaster} from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-code' });


export const metadata: Metadata = {
  title: 'VEDA-MOTRIX AI',
  description: 'VEDA-MOTRIX AI – Knowledge in Motion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceCodePro.variable} font-body antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

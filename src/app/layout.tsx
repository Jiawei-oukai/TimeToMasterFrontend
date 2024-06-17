"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from './AuthContext';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <meta name="theme-color" content="#fff" />
          <title>Timetomaster</title>
          <meta name="description" content="time to master app" />
        </head>
        <body className={inter.className}>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </body>
      </html>
    </AuthProvider>
  );
}



// src/app/page.tsx
"use client";
import React from 'react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useAuth } from './AuthContext';

const HomePage = () => {
  // const router = useRouter();
  // const { isAuthenticated } = useAuth();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  return (
    <>
    <div>Welcome to the Home Page</div>
    <a href='/login'>login</a>
    </>
  
);
};

export default HomePage;

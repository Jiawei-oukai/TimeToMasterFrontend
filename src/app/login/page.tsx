"use client";
import React from 'react';
import SignInForm from '@/components/SignInForm';
import { DEFAULT_EMAIL, DEFAULT_PASSWORD } from '@/app/login/constants';

export default function LoginPage () {

  return (
    <SignInForm
      defaultEmail={DEFAULT_EMAIL}
      defaultPassword={DEFAULT_PASSWORD}
    />
  );
};
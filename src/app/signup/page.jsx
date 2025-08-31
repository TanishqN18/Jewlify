'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-200 dark:from-black dark:to-gray-900">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white hover:opacity-90',
          },
        }}
        redirectUrl="/"
      />
    </div>
  );
}

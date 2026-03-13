'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    if (hasLoggedIn) {
      router.replace('/login/verification');
    } else {
      router.replace('/onboarding/1');
    }
  }, [router]);

  return null;
}

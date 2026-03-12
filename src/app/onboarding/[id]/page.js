'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';

import OnboardingStep from '@/templates/onboarding/step';

import styles from './page.module.scss';

const steps = {
  1: {
    title: 'Take control of your subscriptions',
    subtitle:
      'Track recurring payments, spot forgotten plans, and stop wasting money.',
    next: '/onboarding/2',
  },
  2: {
    title: 'Discover hidden and forgotten subscriptions',
    subtitle:
      'We help you uncover recurring charges that quietly drain your budget.',
    next: '/onboarding/3',
  },
  3: {
    title: 'See what to keep and what to cancel',
    subtitle:
      'Get a clearer view of your subscriptions, renewals, and potential savings.',
    next: '/login/verification',
  },
};

export default function Onboarding({ params }) {
  const { id } = use(params);
  const step = steps[id];

  if (!step) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <OnboardingStep
          step={Number(id)}
          totalSteps={3}
          title={step.title}
          subtitle={step.subtitle}
          next={step.next}
        />
      </main>
    </div>
  );
}

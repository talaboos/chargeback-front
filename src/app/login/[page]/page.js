'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';

import Logo from '@/components/Logo';
import Login from '@/templates/login/login';
import Email from '@/templates/login/email';
import ExistingUser from '@/templates/login/existing';
import NewUser from '@/templates/login/new';

import { useIndent } from '@/hooks/useIndent';

import styles from './page.module.scss';

const pages = {
  start: {
    heading: 'Nice to meet you!',
    subheading: 'Already have an account?',
    templates: <Login />,
  },
  verification: {
    heading: 'Enter your email to log in',
    subheading: 'Your email will not be shared or used for marketing purposes.',
    templates: <Email />,
  },
  signin: {
    heading: 'Enter your password',
    templates: <ExistingUser />,
  },
  signup: {
    heading: 'Create password',
    templates: <NewUser />,
  },
};

export default function Home({ params }) {
  const { page } = use(params);

  if (!page || !pages[page]) {
    notFound();
  }

  const { top } = useIndent();

  return (
    <div className={styles.page} style={{ height: `${top}px` }}>
      <header className={styles.header}>
        <Logo />
        {pages[page].heading && (
          <div className={styles.heading}>
            {pages[page].heading}
            {pages[page].subheading && <span>{pages[page].subheading}</span>}
          </div>
        )}
      </header>
      <main className={styles.main}>{pages[page].templates}</main>
    </div>
  );
}

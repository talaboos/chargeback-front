'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';

import Back from '@/components/Controls/Back';
import About from '@/templates/onboarding/about';

import styles from './page.module.scss';

const pages = {
  about: {
    heading: 'Heading about',
    subheading: 'Subheading about',
    templates: <About />,
  },
};

export default function Home({ params }) {
  // const { getAnswer } = useOnboardingAnswers();

  const { id } = use(params);

  if (!id || !pages[id]) {
    notFound();
  }

  // let url = id;

  // if (id === '1') {
  //   const lastPage = getAnswer('page');
  //   url = lastPage;
  // }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {id !== 'customize' && <Back />}
        {pages[id].heading && (
          <div
            className={styles.heading}
            style={id === 'customize' ? { color: '#fff', paddingTop: '0' } : {}}
          >
            {pages[id].heading}
            {pages[id].subheading && <span>{pages[id].subheading}</span>}
          </div>
        )}
      </header>
      <main className={styles.main}>{pages[id].templates}</main>
    </div>
  );
}

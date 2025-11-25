'use client';

import Link from 'next/link';

import styles from './button.module.scss';

export default function Outline({ children, url, ...rest }) {
  return (
    <Link href={url} className={styles.outline} {...rest}>
      {children}
    </Link>
  );
}

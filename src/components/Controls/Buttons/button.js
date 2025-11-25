import Link from 'next/link';

import styles from './button.module.scss';

export default function Button({
  url,
  disable = false,
  loading = false,
  children,
  rf = null,
  ...rest
}) {
  return (
    <Link
      href={url}
      className={`${styles.button} ${disable && styles.disable} ${loading && styles.loading}`}
      ref={rf}
      {...rest}
    >
      {!loading && children}
    </Link>
  );
}

import styles from './button.module.scss';

export default function Common({
  disable = false,
  loading = false,
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`${styles.common} ${disable && styles.disable} ${loading && styles.loading}`}
      {...rest}
    >
      {!loading && children}
    </button>
  );
}

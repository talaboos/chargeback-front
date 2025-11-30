import styles from './button.module.scss';

export default function SocialNetwork({
  url,
  children,
  icon,
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      href={url}
      aria-label="Login"
      className={`${styles.network}`}
      onClick={onClick}
      {...rest}
    >
      {icon}
      {children && children}
    </button>
  );
}

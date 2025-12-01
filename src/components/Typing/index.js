import styles from './typing.module.scss';

export default function Typing() {
  return (
    <div className={styles.message}>
      <div className={styles.typing}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

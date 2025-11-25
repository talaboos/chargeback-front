import Common from '@/components/Controls/Buttons/common';

import styles from './modal.module.scss';

export default function StoriesModal() {
  return (
    <div className={styles.stories}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
      >
        <path
          d="M24.1751 34.7998C22.3251 34.7998 20.8501 36.2998 20.8501 38.1498C20.8501 39.9998 22.3501 41.4748 24.1751 41.4748C26.0251 41.4748 27.5251 39.9748 27.5251 38.1498C27.5251 36.2998 26.0251 34.7998 24.1751 34.7998Z"
          fill="#6361F3"
        />
        <path
          d="M40.475 5H19.525C10.425 5 5 10.425 5 19.525V40.45C5 49.575 10.425 55 19.525 55H40.45C49.55 55 54.975 49.575 54.975 40.475V19.525C55 10.425 49.575 5 40.475 5ZM42.8 24.5C42.8 26.025 42.15 27.375 41.05 28.175C40.35 28.675 39.5 28.95 38.6 28.95C38.075 28.95 37.55 28.85 37 28.675L31.275 26.775C31.25 26.775 31.2 26.75 31.175 26.725V38.125C31.175 41.975 28.025 45.125 24.175 45.125C20.325 45.125 17.175 41.975 17.175 38.125C17.175 34.275 20.325 31.125 24.175 31.125C25.4 31.125 26.525 31.475 27.525 32V21.575V20.05C27.525 18.525 28.175 17.175 29.275 16.375C30.4 15.575 31.875 15.375 33.325 15.875L39.05 17.775C41.2 18.5 42.825 20.75 42.825 23V24.5H42.8Z"
          fill="#6361F3"
        />
      </svg>
      <div>Enjoy unlimited listening and real emotion</div>
      <span>Listen without limits — go Premium for full access</span>
      <Common
        style={{
          background:
            'linear-gradient(90deg, #F04A8B 0%, #6361F3 100%), #6361F3',
          height: '54px',
          width: '100%',
          fontSize: '16px',
          color: '#fff',
          fontWeight: '500',
        }}
      >
        Become Premium
      </Common>
    </div>
  );
}

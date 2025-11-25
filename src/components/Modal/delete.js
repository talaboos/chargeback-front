import { useState } from 'react';
import { useAtom } from 'jotai/index';
import { signOut } from 'next-auth/react';

import Common from '@/components/Controls/Buttons/common';

import { modalAtom } from '@/state/atoms/modalAtom';
import { deleteUser } from '@/action/deleteUser';

import styles from './modal.module.scss';

export default function DeleteModal() {
  const [, setModal] = useAtom(modalAtom);
  const [loading, setLoading] = useState(false);

  const onDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const { status } = await deleteUser();
    if (status === 'success') {
      signOut();
    } else {
      console.error('Something is wrong');
    }
    setLoading(false);
  };

  return (
    <div className={styles.delete}>
      <div>Delete your account?</div>
      <span>
        Are you sure you want to delete your account and all related data?
      </span>
      <Common
        style={{
          background: '#FFE2EE',
          height: '54px',
          width: '100%',
          fontSize: '16px',
          color: '#DA226B',
          fontWeight: '700',
          marginBottom: '8px',
        }}
        loading={loading}
        onClick={(e) => onDelete(e)}
      >
        Delete
      </Common>
      <Common
        onClick={() => setModal({ open: false })}
        style={{
          background: '#F4F4F4',
          height: '54px',
          width: '100%',
          fontSize: '16px',
          color: '#1A1A2E',
          fontWeight: '700',
        }}
      >
        Cancel
      </Common>
    </div>
  );
}

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import Communication from '@/components/Room/Сommunication';
import Message from '@/components/Room/Message';
import TapBar from '@/components/TapBar';

import { authOptions } from '@/services/auth';
import getChatHistory from '@/action/getChatHistory';

import styles from './page.module.scss';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login/2');
  }

  const { user } = session;

  if (!user || !user?.chatId || !user?.id) {
    redirect('/login/2');
  }

  const { chatId, id } = user;

  const response = await getChatHistory(chatId);
  const data = response?.data ?? [];

  const sortData = data.sort((a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;

    return 0;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>AI Assistant</div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <Communication data={sortData} user={id} />
          <Message id={chatId} />
        </div>
        <TapBar current="assistant" />
      </main>
    </div>
  );
}

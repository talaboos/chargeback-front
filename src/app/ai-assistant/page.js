import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import Communication from '@/components/Room/Сommunication';
import Message from '@/components/Room/Message';
import TapBar from '@/components/TapBar';

import { authOptions } from '@/services/auth';
import getChatHistory from '@/action/getChatHistory';

import styles from './page.module.scss';

const sortData = [
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message',
    id: '1',
  },
  {
    message_type: 'txt',
    sender_type: 'bot',
    content: 'This is mock answer',
    id: '2',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '3',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '4',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '5',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '6',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '7',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '8',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '9',
  },
  {
    message_type: 'txt',
    sender_type: 'user',
    content: 'This is mock message 2',
    id: '10',
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login/2');
  }

  const { user } = session;

  if (!user || !user?.id) {
    redirect('/login/2');
  }

  const { id } = user;

  const data = await getChatHistory(id);

  console.log('data', data, id);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>AI Assistant</div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <Communication data={sortData} id={id} />
          <Message id={id} />
        </div>
        <TapBar current="assistant" />
      </main>
    </div>
  );
}

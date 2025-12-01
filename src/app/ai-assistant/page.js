//import TapBar from '@/components/TapBar';
import Communication from '@/components/Room/Сommunication';
import Message from '@/components/Room/Message';

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
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>AI Assistant</div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <Communication data={sortData} id={1} user={2} />
          <Message />
        </div>
      </main>
    </div>
  );
}

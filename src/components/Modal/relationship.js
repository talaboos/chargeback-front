// import { useRouter } from 'next/navigation';
// import { useAtom } from 'jotai/index';

// import Common from '@/components/Controls/Buttons/common';
import Loader from '@/components/Loader';
import RadioButton from '@/components/RadioButtons';

import { setSetting } from '@/action/setSetting';
import { useFetch } from '@/hooks/useFetch';
// import { deleteCharacter } from '@/action/deleteCharacters';
// import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './modal.module.scss';

export default function RelationshipModal({ avatar, name, id }) {
  // const [, setModal] = useAtom(modalAtom);
  // const router = useRouter();
  const { data, isLoading, mutate } = useFetch(`/api/chats/settings?id=${id}`);
  // const [isPending, startTransition] = useTransition();

  const setRelationshipMutation = async (param) => {
    const res = await setSetting(id, { relations_type: param });

    return { ...res };
  };

  const onSetRelationship = async (param) => {
    const upd = { ...data, relations_type: param };
    const options = {
      optimisticData: upd,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    await mutate(setRelationshipMutation(param), options);
  };

  // const onDelite = () => {
  //   startTransition(async () => {
  //     await deleteCharacter(id);
  //     setModal({
  //       open: false,
  //     });
  //     router.push('/ai-assistant');
  //   });
  // };

  return (
    <div className={styles.relationship}>
      <div className={styles.top}>
        {avatar}
        {name}
      </div>
      <div className={styles.about}>Relationship</div>
      <div className={styles.select}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <RadioButton
              id="relationshipFriends"
              value="casual"
              name="relationship"
              onChange={() => onSetRelationship('casual')}
              checked={data?.relations_type === 'casual'}
            >
              <div className={styles.radio}>
                <span>Friends</span>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 0C5.388 0 0 5.388 0 12C0 18.612 5.388 24 12 24C18.612 24 24 18.612 24 12C24 5.388 18.612 0 12 0ZM17.736 9.24L10.932 16.044C10.764 16.212 10.536 16.308 10.296 16.308C10.056 16.308 9.828 16.212 9.66 16.044L6.264 12.648C5.916 12.3 5.916 11.724 6.264 11.376C6.612 11.028 7.188 11.028 7.536 11.376L10.296 14.136L16.464 7.968C16.812 7.62 17.388 7.62 17.736 7.968C18.084 8.316 18.084 8.88 17.736 9.24Z"
                      fill="#6361F3"
                    />
                  </svg>
                </div>
              </div>
            </RadioButton>
            <RadioButton
              id="relationshipPartners"
              value="romantic"
              name="relationship"
              onChange={() => onSetRelationship('romantic')}
              checked={data?.relations_type === 'romantic'}
            >
              <div className={styles.radio}>
                <span>Romantic Partners</span>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 0C5.388 0 0 5.388 0 12C0 18.612 5.388 24 12 24C18.612 24 24 18.612 24 12C24 5.388 18.612 0 12 0ZM17.736 9.24L10.932 16.044C10.764 16.212 10.536 16.308 10.296 16.308C10.056 16.308 9.828 16.212 9.66 16.044L6.264 12.648C5.916 12.3 5.916 11.724 6.264 11.376C6.612 11.028 7.188 11.028 7.536 11.376L10.296 14.136L16.464 7.968C16.812 7.62 17.388 7.62 17.736 7.968C18.084 8.316 18.084 8.88 17.736 9.24Z"
                      fill="#6361F3"
                    />
                  </svg>
                </div>
              </div>
            </RadioButton>
          </>
        )}
      </div>
      {/* <Common */}
      {/*  style={{ */}
      {/*    background: '#FFE2EE', height: '54px', width: '100%', fontSize: '16px', color: '#DA226B', fontWeight: '700', */}
      {/*  }} */}
      {/*  loading={isPending} */}
      {/*  onClick={onDelite} */}
      {/* > */}
      {/*  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"> */}
      {/*    <path d="M14.5465 3.48671C13.4731 3.38004 12.3998 3.30004 11.3198 3.24004V3.23337L11.1731 2.36671C11.0731 1.75337 10.9265 0.833374 9.36646 0.833374H7.61979C6.06646 0.833374 5.91979 1.71337 5.81312 2.36004L5.67312 3.21337C5.05312 3.25337 4.43312 3.29337 3.81312 3.35337L2.45312 3.48671C2.17312 3.51337 1.97312 3.76004 1.99979 4.03337C2.02646 4.30671 2.26646 4.50671 2.54646 4.48004L3.90646 4.34671C7.39979 4.00004 10.9198 4.13337 14.4531 4.48671C14.4731 4.48671 14.4865 4.48671 14.5065 4.48671C14.7598 4.48671 14.9798 4.29337 15.0065 4.03337C15.0265 3.76004 14.8265 3.51337 14.5465 3.48671Z" fill="#DA226B" /> */}
      {/*    <path d="M13.3202 5.42663C13.1602 5.25996 12.9402 5.16663 12.7135 5.16663H4.28683C4.06016 5.16663 3.83349 5.25996 3.68016 5.42663C3.52683 5.59329 3.44016 5.81996 3.45349 6.05329L3.86683 12.8933C3.94016 13.9066 4.03349 15.1733 6.36016 15.1733H10.6402C12.9668 15.1733 13.0602 13.9133 13.1335 12.8933L13.5468 6.05996C13.5602 5.81996 13.4735 5.59329 13.3202 5.42663ZM9.60682 11.8333H7.38683C7.11349 11.8333 6.88683 11.6066 6.88683 11.3333C6.88683 11.06 7.11349 10.8333 7.38683 10.8333H9.60682C9.88016 10.8333 10.1068 11.06 10.1068 11.3333C10.1068 11.6066 9.88016 11.8333 9.60682 11.8333ZM10.1668 9.16663H6.83349C6.56016 9.16663 6.33349 8.93996 6.33349 8.66663C6.33349 8.39329 6.56016 8.16663 6.83349 8.16663H10.1668C10.4402 8.16663 10.6668 8.39329 10.6668 8.66663C10.6668 8.93996 10.4402 9.16663 10.1668 9.16663Z" fill="#DA226B" /> */}
      {/*  </svg> */}
      {/*  {' '} */}
      {/*  Clear Chat History */}
      {/* </Common> */}
    </div>
  );
}

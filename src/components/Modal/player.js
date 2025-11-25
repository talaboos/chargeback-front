'use client';

import { useState } from 'react';
import Image from 'next/image';
import AudioPlayer from 'react-h5-audio-player';

import 'react-h5-audio-player/lib/styles.css';

import './common.css';
import styles from './modal.module.scss';

export default function PlayerModal({ props, onClick = () => {} }) {
  const { description, title, thumbnail_url, audio_url, is_favourite, id } =
    props;

  const [favorite, setFavorite] = useState(is_favourite);

  const onPassClick = (e) => {
    setFavorite((prev) => !prev);
    onClick(id, favorite, e);
  };

  return (
    <div className={styles.player}>
      <div className={styles.info}>
        <div className={styles.pic}>
          <Image
            src={thumbnail_url}
            width={200}
            height={200}
            priority
            alt={title}
          />
          <button
            type="button"
            aria-label="Favorite"
            className={styles.favorite}
            onClick={(e) => onPassClick(e)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
            >
              <rect
                x="2.8"
                y="2.8"
                width="48.4"
                height="48.4"
                rx="24.2"
                fill="white"
              />
              <rect
                x="2.8"
                y="2.8"
                width="48.4"
                height="48.4"
                rx="24.2"
                stroke="#F4F4F4"
                strokeWidth="4.4"
              />
              <path
                d="M31.44 18.1001C29.63 18.1001 28.01 18.9801 27 20.3301C25.99 18.9801 24.37 18.1001 22.56 18.1001C19.49 18.1001 17 20.6001 17 23.6901C17 24.8801 17.19 25.9801 17.52 27.0001C19.1 32.0001 23.97 34.9901 26.38 35.8101C26.72 35.9301 27.28 35.9301 27.62 35.8101C30.03 34.9901 34.9 32.0001 36.48 27.0001C36.81 25.9801 37 24.8801 37 23.6901C37 20.6001 34.51 18.1001 31.44 18.1001Z"
                fill={favorite ? '#DA226B' : '#E3E3E3'}
              />
            </svg>
          </button>
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <AudioPlayer
        src={audio_url}
        progressJumpSteps={{
          forward: 10000,
          backward: 10000,
        }}
        customIcons={{
          play: (
            <Image
              src="/play-ico.png"
              width="33"
              height="33"
              alt="Play"
              priority
            />
          ),
          rewind: (
            <Image
              src="/skip-previous.png"
              width="27"
              height="27"
              alt="Play"
              priority
            />
          ),
          forward: (
            <Image
              src="/skip-next.png"
              width="27"
              height="27"
              alt="Play"
              priority
            />
          ),
        }}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        className={styles.playerBox}
      />
    </div>
  );
}

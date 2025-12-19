import Image from 'next/image';

import { DEFAULT_BLUR_DATA_URL } from '@/constants/blur-data-url';

export default function BackgroundImage(props) {
  return (
    <Image
      alt="Background image"
      blurDataURL={DEFAULT_BLUR_DATA_URL}
      placeholder="blur"
      width={780}
      height={1688}
      style={{ objectFit: 'cover', position: 'absolute' }}
      {...props}
    />
  );
}

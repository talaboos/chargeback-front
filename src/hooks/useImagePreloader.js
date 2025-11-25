'use client';

import { preload } from 'react-dom';
import { getImageProps } from 'next/image';

export const useImagePreloader = (option) => {
  const common = {
    alt: 'Img',
    sizes: '100vw',
    quality: 90,
    priority: false,
  };

  const {
    props: { src, ...props },
  } = getImageProps({ ...common, ...option });
  preload(src, {
    as: 'image',
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
    fetchPriority: props.fetchPriority,
  });
};

export default useImagePreloader;

import { headers } from 'next/headers';

export const serverDeviceType = async () => {
  const headersList = await headers();
  const userAgent = headersList?.get('user-agent');

  // prettier-ignore
  if (/android/ig.test(userAgent)) {
    return 'android';
  }

  // prettier-ignore
  if (/iPad|iPhone|iPod/ig.test(userAgent)) {
    return 'ios';
  }

  return 'desktop';
};

export default serverDeviceType;

import { isObject } from '@/utils/isObject';
import { isBoolean } from '@/utils/isBoolean';

export const isResponseOk = (response) => {
  if (isObject(response)) {
    const objectResponse = response;

    if ('ok' in objectResponse && isBoolean(objectResponse?.ok)) {
      return Boolean(objectResponse?.ok);
    }

    if ('exception' in objectResponse || objectResponse?.status === 'error') {
      return false;
    }
  }

  return true;
};

export default isResponseOk;

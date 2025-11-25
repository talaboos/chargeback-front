import { isObject } from '@/utils/isObject';
import { isBoolean } from '@/utils/isBoolean';

export const isResponseOk = (response) => {
  if (isObject(response)) {
    const objectResponse = response;

    if ('ok' in objectResponse && isBoolean(objectResponse?.ok)) {
      return Boolean(objectResponse?.ok);
    }
  }

  return true;
};

export default isResponseOk;

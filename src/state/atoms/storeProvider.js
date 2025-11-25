'use client';

import { Provider } from 'jotai';

export default function StoreProvider({ children }) {
  return <Provider>{children}</Provider>;
}

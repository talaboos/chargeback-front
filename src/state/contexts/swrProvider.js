'use client';

import { SWRConfig } from 'swr';

export default function SwrProvider({ children }) {
  return <SWRConfig>{children}</SWRConfig>;
}

import useSWR from 'swr';

import fetcher from '@/utils/fetcher';

export const useFetch = (url, param, method, query) => {
  const { data, error, isLoading, mutate } = useSWR(
    [url, JSON.stringify(query)],
    ([url, method, query]) => fetcher(url, method, query),
    param,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useFetch;

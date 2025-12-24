import useSWRMutation from 'swr/mutation';

const sendRequest = (url) =>
  fetch(url, {
    method: 'GET',
  }).then((res) => res.json());

const useMutationFetch = (url) => {
  const { trigger, isMutating } = useSWRMutation(url, sendRequest);

  return { trigger, isMutating };
};

export default useMutationFetch;

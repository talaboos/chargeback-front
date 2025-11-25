const fetcher = (url, method, query) =>
  fetch(url, {
    method: method || 'GET',
    ...(query && { body: query }),
  }).then((r) => r.json());

export default fetcher;

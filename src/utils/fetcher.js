const fetcher = async (url, method, query) => {
  const r = await fetch(url, {
    method: method || 'GET',
    ...(query && { body: query }),
  });

  if (r.status === 401) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  return r.json();
};

export default fetcher;

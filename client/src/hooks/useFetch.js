import { useState, useEffect, useCallback } from 'react';

export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.resolve()
      .then(fetcher)
      .then(setData)
      .catch((e) => setError(e.message || 'Something went wrong'))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => { reload(); }, [reload]);
  return { data, loading, error, reload };
}
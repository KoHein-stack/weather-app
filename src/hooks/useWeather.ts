import { useCallback, useState } from 'react';

export default function useWeather<TArgs extends unknown[], TResult>(fetcher: (...args: TArgs) => Promise<TResult>) {
  const [data, setData] = useState<TResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setLoading(true);
      setError('');
      try {
        const result = await fetcher(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetcher]
  );

  return { data, loading, error, execute, setData };
}

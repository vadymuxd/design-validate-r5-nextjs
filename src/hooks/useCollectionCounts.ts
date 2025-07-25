import { useState, useEffect } from 'react';

interface CollectionCounts {
  Methods: number;
  Tools: number;
  Frameworks: number;
  Metrics: number;
  Cases: number;
}

export function useCollectionCounts() {
  const [counts, setCounts] = useState<CollectionCounts>({
    Methods: 0,
    Tools: 0,
    Frameworks: 0,
    Metrics: 0,
    Cases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const response = await fetch('/api/collections/counts');
        const result = await response.json();

        if (result.success) {
          setCounts(result.data);
        } else {
          setError('Failed to fetch collection counts');
        }
      } catch (err) {
        setError('Error fetching collection counts');
        console.error('Error fetching collection counts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return { counts, loading, error };
}

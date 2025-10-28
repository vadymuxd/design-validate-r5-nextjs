import { useState, useEffect } from 'react';

interface ContentAnalyticsData {
  id: number;
  content: string;
  initial_score: number;
  current_score: number;
  percentage: number;
}

interface ContentAnalyticsResponse {
  analytics: ContentAnalyticsData[];
  totalScore: number;
  summary: {
    methods: number;
    metrics: number;
    tools: number;
    frameworks: number;
    cases: number;
  };
}

interface UseContentAnalyticsReturn {
  data: ContentAnalyticsData[];
  summary: ContentAnalyticsResponse['summary'] | null;
  totalScore: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useContentAnalytics = (): UseContentAnalyticsReturn => {
  const [data, setData] = useState<ContentAnalyticsData[]>([]);
  const [summary, setSummary] = useState<ContentAnalyticsResponse['summary'] | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/analytics/content');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ContentAnalyticsResponse = await response.json();
      
      setData(result.analytics || []);
      setSummary(result.summary || null);
      setTotalScore(result.totalScore || 0);

    } catch (err) {
      console.error('Error fetching content analytics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    summary,
    totalScore,
    isLoading,
    error,
    refetch: fetchData,
  };
};
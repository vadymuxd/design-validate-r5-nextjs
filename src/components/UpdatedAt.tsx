'use client';

import { useEffect, useState } from 'react';

export function UpdatedAt() {
  const [lastUpdate, setLastUpdate] = useState<string>('Loading...');

  useEffect(() => {
    async function fetchLastCommitDate() {
      try {
        const response = await fetch('/api/last-commit');
        const data = await response.json();
        
        if (data.lastCommitDate) {
          const date = new Date(data.lastCommitDate);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          setLastUpdate(formattedDate);
        }
      } catch (error) {
        console.error('Error fetching last commit date:', error);
        setLastUpdate('Failed to load update date');
      }
    }

    fetchLastCommitDate();
  }, []);

  return (
    <p className="annotation text-[var(--foreground)]">
      Updated: {lastUpdate}
    </p>
  );
} 
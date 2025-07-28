'use client';

import React from 'react';
import CollectionCard from './CollectionCard';
import { useCollectionCounts } from '@/hooks/useCollectionCounts';

const collections = [
  {
    title: 'Methods',
    href: '/methods',
  },
  {
    title: 'Metrics',
    href: '/metrics',
  },
  {
    title: 'Tools',
    href: '/tools',
  },
  {
    title: 'Frameworks',
    href: '/frameworks',
  },
  { 
    title: 'Cases', 
    href: '/cases',
  },
];

export function CollectionGrid() {
  const { counts, loading, error } = useCollectionCounts();

  if (error) {
    console.error('Error loading collection counts:', error);
  }

  return (
    <div className="flex flex-wrap justify-center w-full gap-[2px]">
      {collections.map((collection) => (
        <div 
          key={collection.title} 
          className="w-full sm:w-auto sm:min-w-[200px] sm:flex-shrink-0"
        >
          <CollectionCard
            title={collection.title}
            href={collection.href}
            count={loading ? 0 : counts[collection.title as keyof typeof counts]}
          />
        </div>
      ))}
    </div>
  );
}

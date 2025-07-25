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
    <div className="flex flex-col sm:flex-row justify-center w-full">
      {collections.map((collection, index) => (
        <div 
          key={collection.title} 
          className={`${index > 0 ? "mt-[-1px] sm:mt-0 sm:ml-[-1px]" : ""} w-full sm:w-auto`}
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

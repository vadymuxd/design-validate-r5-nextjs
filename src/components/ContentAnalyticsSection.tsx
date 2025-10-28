'use client';

import React from 'react';
import { ContentBarChart } from './ContentBarChart';
import { useContentAnalytics } from '@/hooks/useContentAnalytics';

export const ContentAnalyticsSection: React.FC = () => {
  const { data, isLoading, error } = useContentAnalytics();

  return (
    <section className="bg-black py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="h1 text-white mb-6">Content</h2>
          <p className="body text-white max-w-3xl mx-auto">
            We are validating community interest to components of design measuring. 
            Below is the most updated distribution of user interest to each of the collections.
          </p>
        </div>
        
        <div className="flex justify-center">
          {error ? (
            <div className="text-center">
              <p className="text-white opacity-70">
                Unable to load analytics data at this time.
              </p>
            </div>
          ) : (
            <ContentBarChart data={data} isLoading={isLoading} />
          )}
        </div>
      </div>
    </section>
  );
};
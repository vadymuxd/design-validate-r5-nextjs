'use client';

import React from 'react';
import Image from 'next/image';

export const Feedback: React.FC = () => {
  const submitFeedback = async (sentiment: 'LIKE' | 'DISLIKE') => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentiment }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Refresh the page to update the counts
      window.location.reload();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={() => submitFeedback('LIKE')}
        className="hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Image
          src="/icons/like.svg"
          alt="Like"
          width={24}
          height={31}
          priority
        />
      </button>
      <button 
        onClick={() => submitFeedback('DISLIKE')}
        className="hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Image
          src="/icons/dislike.svg"
          alt="Dislike"
          width={24}
          height={31}
          priority
        />
      </button>
    </div>
  );
}; 
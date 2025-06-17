'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ToastMessage } from './ToastMessage';

export const Feedback: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const submitFeedback = async (sentiment: 'LIKE' | 'DISLIKE') => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentiment,
          category: 'tools',
          component: 'general feedback',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setToastMessage("Thanks for feedback!");
      setShowToast(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setToastMessage("Failed to submit feedback. Please try again.");
      setShowToast(true);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
    setToastMessage("");
  };

  return (
    <>
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

      <ToastMessage
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </>
  );
}; 
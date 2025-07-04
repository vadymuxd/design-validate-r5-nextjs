'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ToastMessage } from './ToastMessage';

interface FeedbackProps {
  collectionSlug: string;
  methodSlug?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ collectionSlug, methodSlug }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastVariant('default');
    setShowToast(true);
  };

  const showWarningToast = (message: string) => {
    setToastMessage(message);
    setToastVariant('warning');
    setShowToast(true);
  };

  const submitFeedback = async (sentiment: 'LIKE' | 'DISLIKE') => {
    try {
      const response = await fetch('/api/app-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentiment,
          collection_slug: collectionSlug,
          method_slug: methodSlug,
        }),
      });

      if (response.status === 409) {
        showWarningToast('You have already provided feedback here!');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      showSuccessToast("Thanks for your feedback!");
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showWarningToast("Failed to submit feedback. Please try again.");
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
        variant={toastVariant}
      />
    </>
  );
}; 
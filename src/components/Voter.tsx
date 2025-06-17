import React, { useState } from 'react';
import Image from 'next/image';
import { ToastMessage } from './ToastMessage';

interface VoterProps {
  direction: 'up' | 'down';
  count: number;
  toolName: string;
  onVoteUpdate?: (showSuccessToast: () => void) => void;
  background?: 'grey' | 'white';
}

export const Voter: React.FC<VoterProps> = ({
  direction,
  count,
  toolName,
  onVoteUpdate,
  background = 'grey'
}) => {
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

  const handleVote = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentiment: direction === 'up' ? 'LIKE' : 'DISLIKE',
          category: 'tools',
          component: toolName
        }),
      });

      if (response.status === 409) {
        // Duplicate vote error
        showWarningToast('You have already voted for this!');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      onVoteUpdate?.(() => showSuccessToast("Thanks for feedback!"));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showWarningToast("Failed to submit feedback. Please try again.");
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
    setToastMessage("");
    setToastVariant('default');
  };

  const getIcon = () => {
    return direction === 'up' 
      ? '/icons/Arrow=Direction=Arrow up-right.svg'
      : '/icons/Arrow=Direction=Arrow down-left.svg';
  };

  const getBgColor = () => {
    return background === 'grey' ? 'bg-[#F2F2F7]' : 'bg-[#FFFFFF]';
  };
  
  return (
    <>
      <button
        onClick={handleVote}
        className={`flex items-center justify-start gap-1 px-3 py-1.5 rounded-lg w-full ${getBgColor()} hover:cursor-pointer`}
      >
        <div className="flex-shrink-0">
          <Image
            src={getIcon()}
            alt={direction === 'up' ? 'Upvote' : 'Downvote'}
            width={20}
            height={20}
          />
        </div>
        <span className="font-['Inter'] font-medium text-base leading-normal text-[#000000]">
          {count}
        </span>
      </button>
      <ToastMessage
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
        variant={toastVariant}
      />
    </>
  );
}; 
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
  const [isLoading, setIsLoading] = useState(false);

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
    if (isLoading) return; // Prevent multiple clicks while loading
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const getLoaderColor = () => {
    return direction === 'up' ? '#77DB95' : '#FF3654';
  };
  
  return (
    <>
      <style jsx>{`
        .voter-loader-container {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .voter-loader {
          width: 15px;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 2px solid ${getLoaderColor()};
          animation:
            voter-loader-1 0.8s infinite linear alternate,
            voter-loader-2 1.6s infinite linear;
        }
        @keyframes voter-loader-1{
           0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
           12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
           25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
           50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
           62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
           75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
           100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
        }
        @keyframes voter-loader-2{ 
          0%    {transform:scaleY(1)  rotate(0deg)}
          49.99%{transform:scaleY(1)  rotate(135deg)}
          50%   {transform:scaleY(-1) rotate(0deg)}
          100%  {transform:scaleY(-1) rotate(-135deg)}
        }
      `}</style>
    <button
        onClick={handleVote}
        disabled={isLoading}
        className={`flex items-center justify-start gap-1 px-3 py-1.5 rounded-lg w-full ${getBgColor()} ${isLoading ? 'cursor-not-allowed opacity-80' : 'hover:cursor-pointer'}`}
    >
        <div className="flex-shrink-0">
          {isLoading ? (
            <div className="voter-loader-container">
              <div className="voter-loader"></div>
            </div>
          ) : (
        <Image
          src={getIcon()}
          alt={direction === 'up' ? 'Upvote' : 'Downvote'}
              width={20}
              height={20}
        />
          )}
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
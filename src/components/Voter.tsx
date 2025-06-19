import React from 'react';
import Image from 'next/image';

interface VoterProps {
  direction: 'up' | 'down';
  count: number;
  onClick: () => void;
  background?: 'grey' | 'white';
  isLoading?: boolean;
}

export const Voter: React.FC<VoterProps> = ({
  direction,
  count,
  onClick,
  background = 'grey',
  isLoading = false,
}) => {
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
        @keyframes voter-loader-1 {
          0% {
            clip-path: polygon(
              50% 50%,
              0 0,
              50% 0%,
              50% 0%,
              50% 0%,
              50% 0%,
              50% 0%
            );
          }
          12.5% {
            clip-path: polygon(
              50% 50%,
              0 0,
              50% 0%,
              100% 0%,
              100% 0%,
              100% 0%,
              100% 0%
            );
          }
          25% {
            clip-path: polygon(
              50% 50%,
              0 0,
              50% 0%,
              100% 0%,
              100% 100%,
              100% 100%,
              100% 100%
            );
          }
          50% {
            clip-path: polygon(
              50% 50%,
              0 0,
              50% 0%,
              100% 0%,
              100% 100%,
              50% 100%,
              0% 100%
            );
          }
          62.5% {
            clip-path: polygon(
              50% 50%,
              100% 0,
              100% 0%,
              100% 0%,
              100% 100%,
              50% 100%,
              0% 100%
            );
          }
          75% {
            clip-path: polygon(
              50% 50%,
              100% 100%,
              100% 100%,
              100% 100%,
              100% 100%,
              50% 100%,
              0% 100%
            );
          }
          100% {
            clip-path: polygon(
              50% 50%,
              50% 100%,
              50% 100%,
              50% 100%,
              50% 100%,
              50% 100%,
              0% 100%
            );
          }
        }
        @keyframes voter-loader-2 {
          0% {
            transform: scaleY(1) rotate(0deg);
          }
          49.99% {
            transform: scaleY(1) rotate(135deg);
          }
          50% {
            transform: scaleY(-1) rotate(0deg);
          }
          100% {
            transform: scaleY(-1) rotate(-135deg);
          }
        }
      `}</style>
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`flex items-center justify-start gap-1 px-3 py-1.5 rounded-lg w-full ${getBgColor()} ${
          isLoading ? 'cursor-not-allowed opacity-80' : 'hover:cursor-pointer'
        }`}
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
        <span className="body text-[var(--color-black)]">{count}</span>
      </button>
    </>
  );
}; 
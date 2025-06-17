import React, { useState } from 'react';

interface LinkProps {
  variant: 'recommend' | 'dont-recommend' | 'visit-site';
  onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({ variant, onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const getIcon = () => {
    switch (variant) {
      case 'recommend':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H5.83331M14.1666 5.83334V14.1667" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'dont-recommend':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M14.1666 5.83334L5.83331 14.1667M5.83331 14.1667H14.1666M5.83331 14.1667V5.83334" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'visit-site':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667M12.5 2.5H17.5M17.5 2.5V7.5M17.5 2.5L8.33333 11.6667" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  const getText = () => {
    switch (variant) {
      case 'recommend':
        return 'Recommend';
      case 'dont-recommend':
        return "Don't recommend";
      case 'visit-site':
        return 'Visit site';
    }
  };

  const handleClick = async () => {
    if (variant === 'recommend' || variant === 'dont-recommend') {
      if (isLoading) return; // Prevent multiple clicks while loading
      setIsLoading(true);
      try {
        await onClick?.();
      } finally {
        setIsLoading(false);
      }
    } else {
      onClick?.();
    }
  };

  const shouldShowLoader = isLoading && (variant === 'recommend' || variant === 'dont-recommend');

  return (
    <>
      <style jsx>{`
        .link-loader-container {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .link-loader {
          width: 15px;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 2px solid #007AFF;
          animation:
            link-loader-1 0.8s infinite linear alternate,
            link-loader-2 1.6s infinite linear;
        }
        @keyframes link-loader-1{
           0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
           12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
           25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
           50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
           62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
           75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
           100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
        }
        @keyframes link-loader-2{ 
          0%    {transform:scaleY(1)  rotate(0deg)}
          49.99%{transform:scaleY(1)  rotate(135deg)}
          50%   {transform:scaleY(-1) rotate(0deg)}
          100%  {transform:scaleY(-1) rotate(-135deg)}
        }
      `}</style>
      <button
        onClick={handleClick}
        disabled={shouldShowLoader}
        className={`flex items-center gap-1 font-medium text-base ${shouldShowLoader ? 'cursor-not-allowed opacity-80' : 'hover:cursor-pointer'}`}
        style={{ color: 'var(--color-link)' }}
      >
        <div className="w-5 h-5">
          {shouldShowLoader ? (
            <div className="link-loader-container">
              <div className="link-loader"></div>
            </div>
          ) : (
            getIcon()
          )}
        </div>
        <span>{getText()}</span>
      </button>
    </>
  );
}; 
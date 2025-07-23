import React from 'react';

interface LinkProps {
  variant: 'recommend' | 'dont-recommend' | 'visit-site' | 'feedback';
  onClick?: () => void;
  isLoading?: boolean;
}

export const Link: React.FC<LinkProps> = ({ variant, onClick, isLoading = false }) => {
  const getIcon = () => {
    switch (variant) {
      case 'recommend':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H5.83331M14.1666 5.83334V14.1667"
              stroke="var(--color-green)"
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
              stroke="var(--color-red)"
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
              stroke="var(--color-black)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'feedback':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.56944 14.8612H7.22222C4.44444 14.8612 3.05556 14.1668 3.05556 10.6945V7.22225C3.05556 4.44447 4.44444 3.05559 7.22222 3.05559H12.7778C15.5556 3.05559 16.9444 4.44447 16.9444 7.22225V10.6945C16.9444 13.4723 15.5556 14.8612 12.7778 14.8612H12.4306C12.2153 14.8612 12.0069 14.9654 11.875 15.1389L10.8333 16.5278C10.375 17.1389 9.625 17.1389 9.16667 16.5278L8.125 15.1389C8.01389 14.9862 7.76389 14.8612 7.56944 14.8612Z"
              stroke="var(--color-white)"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.52777 7.22217H13.4722"
              stroke="var(--color-white)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.52777 10.6945H10.6944"
              stroke="var(--color-white)"
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
        return 'Learn more';
      case 'feedback':
        return 'Feedback to improve';
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
        onClick={onClick}
        disabled={shouldShowLoader}
        className={`flex items-center gap-1 label-default ${shouldShowLoader ? 'cursor-not-allowed opacity-80' : 'hover:cursor-pointer'}`}
        style={{ color: variant === 'feedback' ? 'var(--color-white)' : 'var(--color-black)' }}
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
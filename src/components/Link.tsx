import React from 'react';

interface LinkProps {
  variant: 'recommend' | 'dont-recommend' | 'visit-site' | 'view-case' | 'feedback' | 'suggest-more' | 'join-discord' | 'join-slack';
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
      case 'view-case':
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
      case 'suggest-more':
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
      case 'join-discord':
        return (
          <svg width="20" height="20" viewBox="0 0 25 24" fill="none">
            <g clipPath="url(#clip0_discord_link)">
              <path
                d="M20.8303 4.22781C19.2767 3.50093 17.6156 2.97267 15.8789 2.67188C15.6656 3.05749 15.4164 3.57614 15.2446 3.98873C13.3985 3.71109 11.5693 3.71109 9.75716 3.98873C9.58539 3.57614 9.33055 3.05749 9.11536 2.67188C7.37681 2.97267 5.71376 3.50287 4.16019 4.23166C1.02664 8.96686 0.177189 13.5845 0.601917 18.1365C2.68025 19.6885 4.69441 20.6313 6.67457 21.2483C7.16349 20.5754 7.59953 19.8601 7.97518 19.1063C7.25975 18.8344 6.57453 18.499 5.92707 18.1095C6.09884 17.9822 6.26686 17.8492 6.42918 17.7123C10.3782 19.5594 14.6689 19.5594 18.5707 17.7123C18.735 17.8492 18.903 17.9822 19.0728 18.1095C18.4235 18.5009 17.7364 18.8363 17.021 19.1082C17.3966 19.8601 17.8308 20.5774 18.3216 21.2502C20.3036 20.6333 22.3197 19.6905 24.398 18.1365C24.8964 12.8595 23.5467 8.28434 20.8303 4.22781ZM8.51318 15.337C7.32772 15.337 6.35555 14.2303 6.35555 12.8826C6.35555 11.535 7.30696 10.4264 8.51318 10.4264C9.71942 10.4264 10.6916 11.533 10.6708 12.8826C10.6727 14.2303 9.71942 15.337 8.51318 15.337ZM16.4867 15.337C15.3013 15.337 14.3291 14.2303 14.3291 12.8826C14.3291 11.535 15.2805 10.4264 16.4867 10.4264C17.693 10.4264 18.6651 11.533 18.6444 12.8826C18.6444 14.2303 17.693 15.337 16.4867 15.337Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_discord_link">
                <rect width="24" height="24" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        );
      case 'join-slack':
        return (
          <svg width="20" height="20" viewBox="0 0 25 24" fill="none">
            <path
              d="M15.2679 16.7422C14.0492 16.7422 13.061 15.8011 13.061 14.6406C13.061 13.48 14.0492 12.5389 15.2679 12.5389H20.7931C22.0118 12.5389 23 13.48 23 14.6406C23 15.8011 22.0118 16.7422 20.7931 16.7422H15.2679ZM15.2679 17.7994C16.4858 17.7994 17.4734 18.7398 17.4734 19.8997C17.4734 21.0596 16.4858 22 15.2679 22C14.0506 22 13.0631 21.0609 13.0624 19.9017V17.7994H15.2679ZM17.4762 9.36277C17.4762 10.5233 16.4879 11.4644 15.2693 11.4644C14.0506 11.4644 13.0624 10.5233 13.0624 9.36277V4.10165C13.0624 2.94111 14.0506 2 15.2693 2C16.4879 2 17.4762 2.94111 17.4762 4.10165V9.36277ZM18.5862 9.36277C18.5869 8.20356 19.5738 7.26379 20.791 7.26379C22.0083 7.26379 22.9958 8.20423 22.9958 9.3641C22.9958 10.5233 22.0097 11.4631 20.7931 11.4644H18.5855L18.5862 9.36277ZM9.72722 7.26112C10.9431 7.26446 11.9278 8.20356 11.9278 9.3621C11.9278 10.5206 10.9431 11.4604 9.72722 11.4631H4.20267C2.98683 11.4597 2.0021 10.5206 2.0021 9.3621C2.0021 8.20356 2.98683 7.26379 4.20267 7.26112H9.72722ZM9.72722 6.20196C8.51137 6.20063 7.52595 5.26152 7.52595 4.10298C7.52595 2.94377 8.51277 2.004 9.73002 2.004C10.9473 2.004 11.9327 2.94311 11.9341 4.10098V6.20129L9.72722 6.20196ZM7.52034 14.6392C7.52385 13.4814 8.50997 12.5436 9.72652 12.5436C10.9431 12.5436 11.9299 13.4814 11.9327 14.6392V19.901C11.9292 21.0589 10.9431 21.9967 9.72652 21.9967C8.50997 21.9967 7.52315 21.0589 7.52034 19.901V14.6392ZM6.40815 14.6392C6.40745 15.7978 5.42062 16.7369 4.20408 16.7369C2.98753 16.7369 2 15.7971 2 14.6379C2 13.4787 2.98613 12.5396 4.20267 12.5389H6.40815V14.6392Z"
              fill="currentColor"
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
      case 'view-case':
        return 'View case';
      case 'feedback':
        return 'Feedback to improve';
      case 'suggest-more':
        return 'Suggest more';
      case 'join-discord':
        return 'Join Discord';
      case 'join-slack':
        return 'Join Slack';
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
  style={{ color: (variant === 'feedback' || variant === 'suggest-more' || variant === 'join-discord' || variant === 'join-slack') ? 'var(--color-white)' : 'var(--color-black)' }}
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
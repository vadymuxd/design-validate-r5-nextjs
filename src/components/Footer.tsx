'use client';

import Link from 'next/link';
import { UpdatedAt } from './UpdatedAt';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import LottieAnimation from './LottieAnimation';
import cubeBlackAnimation from '../../public/gifs/black_3_cubes.json';
import { FeedbackPopup } from './FeedbackPopup';

interface FooterProps {
  noBorder?: boolean;
}

export const Footer = ({ noBorder = false }: FooterProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'discord' | 'slack'>('discord');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isCommunity = pathname === '/community';

  const handleDiscordClick = () => {
    setSelectedPlatform('discord');
    setShowFeedbackPopup(true);
  };

  const handleSlackClick = () => {
    setSelectedPlatform('slack');
    setShowFeedbackPopup(true);
  };
  return (
  <div className={`bg-black flex flex-col md:flex-row items-center justify-center gap-8 md:gap-9 w-full py-12 ${noBorder ? '' : 'border-t border-[var(--color-grey-darkest)]'}`}>
      <div className="flex items-center h-full">
        <button
          className="label-mini bg-transparent text-white rounded-[24px] px-1.5 py-1 border-white cursor-pointer flex items-center gap-1 h-full hover:text-[var(--color-red)] transition-colors duration-200"
          style={{ fontWeight: 600, border: 'none', padding: 0 }}
          onClick={() => setShowPopup(true)}
          type="button"
        >
          <div className="w-1.5 h-1.5 bg-[var(--color-red)] rounded-full"></div>
          <span className="flex items-center h-full">Beta</span>
        </button>
      </div>
      <div className="flex items-center h-full">
        <Link href="/about#contact-form">
          <span
            className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200 flex items-center h-full`}
          >
            Feedback
          </span>
        </Link>
      </div>
      {isHome && (
        <div className="flex items-center h-full">
          <Link href="/about">
            <span
              className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200 flex items-center h-full`}
            >
              About
            </span>
          </Link>
        </div>
      )}
      {isHome && (
        <div className="flex items-center h-full">
          <Link href="/community">
            <span
              className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200 flex items-center h-full`}
            >
              Community
            </span>
          </Link>
        </div>
      )}
      {!isCommunity && (
        <>
          <div className="flex items-center h-full">
            <button
              onClick={handleDiscordClick}
              className="text-white hover:text-[var(--color-red)] transition-colors duration-200 flex items-center cursor-pointer"
              aria-label="Join us on Discord"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <g clipPath="url(#clip0_discord)">
                  <path
                    d="M20.8303 4.22781C19.2767 3.50093 17.6156 2.97267 15.8789 2.67188C15.6656 3.05749 15.4164 3.57614 15.2446 3.98873C13.3985 3.71109 11.5693 3.71109 9.75716 3.98873C9.58539 3.57614 9.33055 3.05749 9.11536 2.67188C7.37681 2.97267 5.71376 3.50287 4.16019 4.23166C1.02664 8.96686 0.177189 13.5845 0.601917 18.1365C2.68025 19.6885 4.69441 20.6313 6.67457 21.2483C7.16349 20.5754 7.59953 19.8601 7.97518 19.1063C7.25975 18.8344 6.57453 18.499 5.92707 18.1095C6.09884 17.9822 6.26686 17.8492 6.42918 17.7123C10.3782 19.5594 14.6689 19.5594 18.5707 17.7123C18.735 17.8492 18.903 17.9822 19.0728 18.1095C18.4235 18.5009 17.7364 18.8363 17.021 19.1082C17.3966 19.8601 17.8308 20.5774 18.3216 21.2502C20.3036 20.6333 22.3197 19.6905 24.398 18.1365C24.8964 12.8595 23.5467 8.28434 20.8303 4.22781ZM8.51318 15.337C7.32772 15.337 6.35555 14.2303 6.35555 12.8826C6.35555 11.535 7.30696 10.4264 8.51318 10.4264C9.71942 10.4264 10.6916 11.533 10.6708 12.8826C10.6727 14.2303 9.71942 15.337 8.51318 15.337ZM16.4867 15.337C15.3013 15.337 14.3291 14.2303 14.3291 12.8826C14.3291 11.535 15.2805 10.4264 16.4867 10.4264C17.693 10.4264 18.6651 11.533 18.6444 12.8826C18.6444 14.2303 17.693 15.337 16.4867 15.337Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_discord">
                    <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
          <div className="flex items-center h-full">
            <button
              onClick={handleSlackClick}
              className="text-white hover:text-[var(--color-red)] transition-colors duration-200 flex items-center cursor-pointer"
              aria-label="Join us on Slack"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path
                  d="M15.2679 16.7422C14.0492 16.7422 13.061 15.8011 13.061 14.6406C13.061 13.48 14.0492 12.5389 15.2679 12.5389H20.7931C22.0118 12.5389 23 13.48 23 14.6406C23 15.8011 22.0118 16.7422 20.7931 16.7422H15.2679ZM15.2679 17.7994C16.4858 17.7994 17.4734 18.7398 17.4734 19.8997C17.4734 21.0596 16.4858 22 15.2679 22C14.0506 22 13.0631 21.0609 13.0624 19.9017V17.7994H15.2679ZM17.4762 9.36277C17.4762 10.5233 16.4879 11.4644 15.2693 11.4644C14.0506 11.4644 13.0624 10.5233 13.0624 9.36277V4.10165C13.0624 2.94111 14.0506 2 15.2693 2C16.4879 2 17.4762 2.94111 17.4762 4.10165V9.36277ZM18.5862 9.36277C18.5869 8.20356 19.5738 7.26379 20.791 7.26379C22.0083 7.26379 22.9958 8.20423 22.9958 9.3641C22.9958 10.5233 22.0097 11.4631 20.7931 11.4644H18.5855L18.5862 9.36277ZM9.72722 7.26112C10.9431 7.26446 11.9278 8.20356 11.9278 9.3621C11.9278 10.5206 10.9431 11.4604 9.72722 11.4631H4.20267C2.98683 11.4597 2.0021 10.5206 2.0021 9.3621C2.0021 8.20356 2.98683 7.26379 4.20267 7.26112H9.72722ZM9.72722 6.20196C8.51137 6.20063 7.52595 5.26152 7.52595 4.10298C7.52595 2.94377 8.51277 2.004 9.73002 2.004C10.9473 2.004 11.9327 2.94311 11.9341 4.10098V6.20129L9.72722 6.20196ZM7.52034 14.6392C7.52385 13.4814 8.50997 12.5436 9.72652 12.5436C10.9431 12.5436 11.9299 13.4814 11.9327 14.6392V19.901C11.9292 21.0589 10.9431 21.9967 9.72652 21.9967C8.50997 21.9967 7.52315 21.0589 7.52034 19.901V14.6392ZM6.40815 14.6392C6.40745 15.7978 5.42062 16.7369 4.20408 16.7369C2.98753 16.7369 2 15.7971 2 14.6379C2 13.4787 2.98613 12.5396 4.20267 12.5389H6.40815V14.6392Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </>
      )}
      <div className="flex items-center h-full">
        <UpdatedAt />
      </div>

      {showPopup && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] z-[100]" onClick={() => setShowPopup(false)}></div>
          
          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" onClick={() => setShowPopup(false)}>
            <div 
              className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cube Animation */}
              <div className="flex justify-center mb-6">
                <LottieAnimation
                  animationData={cubeBlackAnimation}
                  className="w-48 h-48"
                  speed={0.5}
                />
              </div>
              
              {/* Headline */}
              <h3 className="h3 text-black mb-4">We are working on it</h3>
              
              {/* Body text */}
              <p className="body text-black mb-8">
                This platform is in the early stages of its MVP. At this point, our focus is on validating which types of content generate the most interest, rather than showcasing a polished collection of high-quality items with good UX. You may likely encounter bugs or errors along the way. We greatly appreciate your feedback - please report anything that seems off, or simply engage with the sections you find most interesting.
              </p>
              
              {/* Button */}
              <Button
                variant="filled-black"
                onClick={() => {
                  setShowPopup(false);
                  window.location.href = '/about#contact-form';
                }}
                style={{ width: '100%', padding: '12px 24px' }}
              >
                Share feedback
              </Button>
            </div>
          </div>
        </>
      )}

      {showFeedbackPopup && (
        <FeedbackPopup
          isOpen={showFeedbackPopup}
          onClose={() => setShowFeedbackPopup(false)}
          cardType={selectedPlatform}
          source="footer"
        />
      )}
    </div>
  );
}; 
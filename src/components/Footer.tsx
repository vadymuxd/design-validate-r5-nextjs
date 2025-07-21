'use client';

import Link from 'next/link';
import { UpdatedAt } from './UpdatedAt';
import { useState } from 'react';
import { Button } from './Button';
import LottieAnimation from './LottieAnimation';
import cubeBlackAnimation from '../../public/gifs/black_3_cubes.json';

export const Footer = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-9 w-full">
      <Link href="/about#contact-form">
        <span
          className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          Contact
        </span>
      </Link>
      <Link href="/about">
        <span
          className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          About
        </span>
      </Link>
      <Link href="/community">
        <span
          className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          Community
        </span>
      </Link>

      <button
        className="label-mini bg-transparent text-white rounded-[24px] px-1.5 py-1 border border-white cursor-pointer flex items-center gap-1"
        style={{ fontWeight: 600 }}
        onClick={() => setShowPopup(true)}
        type="button"
      >
        <div className="w-1.5 h-1.5 bg-[var(--color-red)] rounded-full"></div>
        beta
      </button>

      <UpdatedAt />

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
                variant="primary"
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
    </div>
  );
}; 
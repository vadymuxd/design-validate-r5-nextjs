'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { FeedbackPopup } from '@/components/FeedbackPopup';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { useState, useRef } from 'react';

export default function CommunityPage() {
  const [isInterested, setIsInterested] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<'viewer' | 'contributor' | 'partner'>('viewer');
  const cardsRef = useRef<HTMLDivElement>(null);

  const handleInterestedClick = () => {
    if (!isInterested) {
      setIsInterested(true);
      
      // Scroll to cards section after a brief delay to ensure state update
      setTimeout(() => {
        if (cardsRef.current) {
          cardsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } else {
      // Toggle back to not interested state
      setIsInterested(false);
    }
  };

  const handleCardClick = (cardType: 'viewer' | 'contributor' | 'partner') => {
    setSelectedCardType(cardType);
    setShowFeedbackPopup(true);
  };

  return (
    <>
    <main 
      className="page-container"
      style={{
        background: 'linear-gradient(to bottom, #000000 10%, #162026 100%)'
      }}
    >
      {/* Main Content Container */}
      <div className="text-white">
        <div className="w-full mx-auto flex flex-col items-center">
          
          {/* A. GIF Container - copied from Tools page */}
          <div className="w-full max-w-[730px] flex flex-col items-center justify-center gap-4 mb-8">
            <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image 
                src="/gifs/cat.gif" 
                alt="Community" 
                width={320}
                height={300}
                style={{
                  width: '100%',
                  maxWidth: 320,
                  height: 320,
                  objectFit: 'cover',
                  display: 'block',
                  position: 'absolute',
                  left: 0,
                  top: -40
                }}
                unoptimized
              />
            </div>
          </div>

          {/* B. Headline */}
          <h1 className="h1 mb-8 text-center">Community coming soon</h1>

          {/* C. Description Text */}
          <p className="body text-[var(--foreground)] text-center max-w-[520px] mb-8 px-4 sm:px-8">
            We want to build a community of insights-driven designers who will spread the knowledge and improve how design is validated in practice. Let us know if you want to be a part of it.
          </p>

          {/* D. Button */}
          <div className="w-full max-w-[200px] mb-16">
            <Button
              variant={isInterested ? "ghost-white" : "filled-white"}
              onClick={handleInterestedClick}
              className="w-full whitespace-nowrap"
            >
              {isInterested ? "I am interested as ..." : "I am interested"}
            </Button>
          </div>

          {/* E. 3 Cards Container */}
          <div ref={cardsRef} className="w-full max-w-[1280px] pb-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ContentCard
                icon={
                  <Image 
                    src="/icons/Viewer.svg" 
                    alt="Viewer" 
                    width={24} 
                    height={24}
                    className="w-6 h-6"
                  />
                }
                title="Viewer"
                variant={isInterested ? "light" : "dark"}
                size="medium"
                onClick={() => handleCardClick('viewer')}
                className={`transition-all duration-500 ease-in-out ${
                  isInterested 
                    ? 'animate-fadeIn [&_h3]:!text-black' 
                    : '[&_h3]:!text-white'
                }`}
              >
                I want to explore content on this platform and vote for the best artefacts here. I would learn new ways to setup design objectives and measure impact.
              </ContentCard>
              
              <ContentCard
                icon={
                  <Image 
                    src="/icons/Contributor.svg" 
                    alt="Contributor" 
                    width={24} 
                    height={24}
                    className="w-6 h-6"
                  />
                }
                title="Contributor"
                variant={isInterested ? "light" : "dark"}
                size="medium"
                onClick={() => handleCardClick('contributor')}
                className={`transition-all duration-500 ease-in-out ${
                  isInterested 
                    ? 'animate-fadeIn [&_h3]:!text-black' 
                    : '[&_h3]:!text-white'
                }`}
              >
                I want to contribute to the content by adding new cases, frameworks, tools. I would be happy to expose my knowledge and experience to others.
              </ContentCard>
              
              <ContentCard
                icon={
                  <Image 
                    src="/icons/Partner.svg" 
                    alt="Partner" 
                    width={24} 
                    height={24}
                    className="w-6 h-6"
                  />
                }
                title="Partner"
                variant={isInterested ? "light" : "dark"}
                size="medium"
                onClick={() => handleCardClick('partner')}
                className={`transition-all duration-500 ease-in-out ${
                  isInterested 
                    ? 'animate-fadeIn [&_h3]:!text-black' 
                    : '[&_h3]:!text-white'
                }`}
              >
                I know how this could grow and have ideas how this could benefit me and what this platform could become. I would like to discuss and engage on this as a core team.
              </ContentCard>
            </div>
          </div>

        </div>
      </div>
    </main>
    
    <Footer />
    
    <FeedbackPopup
      isOpen={showFeedbackPopup}
      onClose={() => setShowFeedbackPopup(false)}
      cardType={selectedCardType}
    />
    </>
  );
}
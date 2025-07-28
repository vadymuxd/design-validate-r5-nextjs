'use client';

import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';
import { FrameworkCard, VoteResult } from '@/components/FrameworkCard';
import { ApiFramework } from '@/data/types';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import LottieAnimation from '@/components/LottieAnimation';
import animationData from '../../../public/gifs/cube-2.json';
import { ToastMessage } from '@/components/ToastMessage';

import { Link } from '@/components/Link';

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<ApiFramework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the toast message
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');

  // Fetch frameworks from the API
  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const response = await fetch('/api/frameworks');
        if (response.ok) {
          const data = await response.json();
          setFrameworks(data.frameworks || []);
        } else {
          console.error('Failed to fetch frameworks');
        }
      } catch (error) {
        console.error('Error fetching frameworks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFrameworks();
  }, []);

  const handleVote = (result: VoteResult) => {
    // Show the toast message from the child component
    setToastMessage(result.message);
    setToastVariant(result.variant);
    setShowToast(true);

    // If the vote was successful, update the framework's vote count in the local state
    if (result.voteStatus === 'VOTE_CREATED' || result.voteStatus === 'VOTE_UPDATED') {
      setFrameworks(currentFrameworks => {
        const updatedFrameworks = currentFrameworks.map(framework => {
          if (framework.id === result.frameworkId) {
            let newUpvotes = framework.upvotes;
            let newDownvotes = framework.downvotes;

            if (result.voteStatus === 'VOTE_CREATED') {
              // Simple increment
              if (result.sentiment === 'UPVOTE') newUpvotes++;
              else newDownvotes++;
            } else { // VOTE_UPDATED
              // Decrement the opposite sentiment and increment the new one
              if (result.sentiment === 'UPVOTE') {
                newUpvotes++;
                newDownvotes--;
              } else {
                newDownvotes++;
                newUpvotes--;
              }
            }
            
            // Calculate new net score
            const newNetScore = newUpvotes - newDownvotes;
            
            return { 
              ...framework, 
              upvotes: newUpvotes, 
              downvotes: newDownvotes,
              net_score: newNetScore
            };
          }
          return framework;
        });
        
        // Re-sort frameworks by net score to maintain ranking
        return updatedFrameworks.sort((a, b) => b.net_score - a.net_score);
      });
    }
  };

  return (
    <>
      {/* Top Section with gradient */}
      <div className="w-full gradient-black-to-grey pb-12 px-4 sm:px-8">
        <div className="w-full max-w-[730px] mx-auto flex flex-col items-center gap-8 pt-0">
          <TitleNavigation />
          
          {/* Description */}
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="body text-white max-w-[520px]">
              This is a curated list of design measuring frameworks and ux models to analyse user experience and setup design objectives. Ranked by an arbitrary relevance base rate plus user votes on this platform.
            </p>
          </div>
          
          <Feedback collectionSlug="frameworks" />
        </div>
      </div>


      {/* Frameworks Section */}
      <div 
        className={`px-4 sm:px-8 pb-16 ${
          isLoading ? 'bg-black' : 'bg-[var(--color-grey-darkest)]'
        }`}
      >
        <div className="w-full max-w-[1280px] mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LottieAnimation
                animationData={animationData}
                className="w-full h-auto max-w-[200px]"
              />
            </div>
          ) : frameworks.length > 0 ? (
            <>
              {/* Frameworks Grid */}
              <div className="w-full max-w-[1280px] flex flex-col gap-2 pt-12 animate-fadeIn">
                {frameworks.map((framework) => (
                  <FrameworkCard
                    key={framework.id}
                    frameworkId={framework.id}
                    name={framework.name}
                    description={framework.description}
                    picture={framework.picture}
                    link={framework.link}
                    upvotes={framework.upvotes}
                    downvotes={framework.downvotes}
                    onVote={handleVote}
                  />
                ))}
              </div>

              {/* Feedback button below frameworks */}
              <div className="flex justify-center pt-20 pb-20">
                <Link 
                  variant="feedback"
                  onClick={() => {
                    if (window.location.pathname === '/about') {
                      const el = document.getElementById('contact-form');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/about#contact-form';
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center pt-12">
              <div className="flex flex-col items-center gap-6">
                <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image 
                    src="/gifs/cat.gif" 
                    alt="Frameworks coming soon" 
                    width={320}
                    height={320}
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
                <div className="flex flex-col items-center gap-4">
                  <h3 className="h3 text-white">Coming Soon</h3>
                  <p className="body text-[var(--color-grey-light)] text-center max-w-[520px]">
                    We&apos;re curating established measurement frameworks from leading companies like Google, Airbnb, and Spotify. Learn how top organizations measure design success and impact.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!isLoading && (
        <Footer />
      )}

      <ToastMessage
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        variant={toastVariant}
      />
    </>
  );
}
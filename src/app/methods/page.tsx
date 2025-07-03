'use client';

import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';
import { MethodCard } from '@/components/MethodCard';
import { ApiMethod } from '@/data/types';
import { useState, useEffect } from 'react';
import { ToastMessage } from '@/components/ToastMessage';
import { PageLoader } from '@/components/PageLoader';
import LottieAnimation from '@/components/LottieAnimation';
import animationData from '../../../public/gifs/cube-2.json';
import { Footer } from '@/components/Footer';

interface VoteResult {
  voteStatus: string;
  message: string;
  variant: 'default' | 'warning';
  method_id: number;
  sentiment: string;
  upvotes?: number;
  downvotes?: number;
}

export default function MethodsPage() {
  const [methods, setMethods] = useState<ApiMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');

  // Fetch methods from the API
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await fetch('/api/methods');
        if (response.ok) {
          const data = await response.json();
          setMethods(data.methods || []);
        } else {
          console.error('Failed to fetch methods');
        }
      } catch (error) {
        console.error('Error fetching methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMethods();
  }, []);

  // Handle voting on methods
  const handleMethodVote = async (methodId: number, sentiment: 'UPVOTE' | 'DOWNVOTE'): Promise<VoteResult> => {
    try {
      const response = await fetch('/api/method-votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method_id: methodId,
          sentiment: sentiment
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the local state to reflect the vote change
        if (result.voteStatus === 'VOTE_CREATED' || result.voteStatus === 'VOTE_UPDATED') {
          setMethods(currentMethods => 
            currentMethods.map(method => {
              if (method.id === methodId) {
                // Update current votes and recalculate net score
                const newCurrentUpvotes = result.upvotes || method.current_upvotes;
                const newCurrentDownvotes = result.downvotes || method.current_downvotes;
                
                // The net score includes both tool votes and direct method votes
                // We need to recalculate based on the vote change
                let netScoreChange = 0;
                if (result.voteStatus === 'VOTE_CREATED') {
                  netScoreChange = sentiment === 'UPVOTE' ? 1 : -1;
                } else if (result.voteStatus === 'VOTE_UPDATED') {
                  netScoreChange = sentiment === 'UPVOTE' ? 2 : -2; // Switching from one to the other
                }

                return {
                  ...method,
                  current_upvotes: newCurrentUpvotes,
                  current_downvotes: newCurrentDownvotes,
                  net_score: method.net_score + netScoreChange
                };
              }
              return method;
            })
          );
        }

        // Show toast message
        setToastMessage(result.message);
        setToastVariant(result.variant);
        setShowToast(true);

        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting on method:', error);
      const errorResult: VoteResult = {
        voteStatus: 'ERROR',
        message: 'Failed to submit vote. Please try again.',
        variant: 'warning',
        method_id: methodId,
        sentiment: sentiment
      };
      
      setToastMessage(errorResult.message);
      setToastVariant(errorResult.variant);
      setShowToast(true);
      
      return errorResult;
    }
  };

  return (
    <>
      {/* Top Section with gradient */}
      <div className="w-full bg-gradient-to-b from-black from-52.457% to-[#353535] pb-12 px-4 sm:px-8">
        <div className="w-full max-w-[730px] mx-auto flex flex-col items-center gap-8 pt-12">
          <TitleNavigation />
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="body text-white max-w-[520px]">
              All validation methods are sorted by net score of &apos;negative&apos; and &apos;positive&apos; mentions by users from G2, 
              Capterra, TrustRadius, and Reddit plus unique users&apos; votes on this site. Initial analysis done by Gemini 2.5 Pro 
              (user sentiment analysis from late 2023 - mid-2025)
            </p>
          </div>
          <Feedback collectionSlug="methods" />
        </div>
      </div>

      {/* Methods Section with preloader */}
      <div className="bg-black px-4 sm:px-8 pb-16">
        <div className="w-full max-w-[730px] mx-auto">
          <div className="w-full max-w-[400px] mx-auto pt-12">
            <div className="flex flex-col">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LottieAnimation
                    animationData={animationData}
                    className="w-full h-auto max-w-[200px]"
                  />
                </div>
              ) : methods.length > 0 ? (
                methods.map((method) => (
                  <MethodCard 
                    key={method.id} 
                    methodId={method.id}
                    name={method.name}
                    slug={method.slug}
                    description={method.description || ''}
                    voteCount={method.net_score}
                    onVote={handleMethodVote}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center py-16">
                  <div className="text-white">No methods found</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isLoading && (
        <footer className="bg-black py-12 border-t border-[var(--color-grey-dark)]">
          <Footer />
        </footer>
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
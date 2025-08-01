'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TitleNavigation } from '@/components/TitleNavigation';
import { CasesCard, CaseVoteResult } from '@/components/CasesCard';
import { Pill } from '@/components/Pill';
import { Footer } from '@/components/Footer';
import { Feedback } from '@/components/Feedback';
import { ToastMessage } from '@/components/ToastMessage';
import { Link } from '@/components/Link';
import { ApiCase } from '@/data/types';
import LottieAnimation from '@/components/LottieAnimation';
import animationData from '../../../public/gifs/cube-2.json';

type SortView = 'recommended' | 'recent';

export default function CasesPage() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<SortView>('recommended');
  
  // State for the toast message
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');

  // Fetch cases data
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('/api/cases');
        const data = await response.json();
        
        if (data.success) {
          setCases(data.data);
        }
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Handle vote for cases
  const handleVote = async (result: CaseVoteResult) => {
    // Update local state optimistically
    setCases(prevCases => 
      prevCases.map(caseItem => {
        if (caseItem.id === result.caseId) {
          const newUpvotes = result.sentiment === 'UPVOTE' ? caseItem.totalUpvotes + 1 : caseItem.totalUpvotes;
          const newDownvotes = result.sentiment === 'DOWNVOTE' ? caseItem.totalDownvotes + 1 : caseItem.totalDownvotes;
          return {
            ...caseItem,
            totalUpvotes: newUpvotes,
            totalDownvotes: newDownvotes,
            netScore: newUpvotes - newDownvotes
          };
        }
        return caseItem;
      })
    );

    // Show toast message
    setToastMessage(result.message);
    setToastVariant(result.variant);
    setShowToast(true);
  };

  // Sort cases based on active view
  const getSortedCases = () => {
    const sortedCases = [...cases];
    
    if (activeView === 'recommended') {
      return sortedCases.sort((a, b) => b.netScore - a.netScore);
    } else {
      // Sort by release_date (most recent first)
      return sortedCases.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    }
  };

  const sortedCases = getSortedCases();

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <main className="flex-grow">
        {/* Header Section with gradient */}
        <div className="w-full gradient-black-to-grey pb-12 px-4 sm:px-8 bg-black text-white">
          <div className="w-full max-w-[730px] mx-auto flex flex-col items-center gap-8 pt-0">
            <TitleNavigation />
            
            {/* View Pills */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-2">
                <Pill
                  label="Recommended First"
                  isActive={activeView === 'recommended'}
                  onClick={() => setActiveView('recommended')}
                />
                <Pill
                  label="Recent First"
                  isActive={activeView === 'recent'}
                  onClick={() => setActiveView('recent')}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="body text-white max-w-[520px]">
                Case studies from top designers, product managers, engineers, and marketers to learn how they validate their design solutions on real applications.
              </p>
            </div>

            {/* Feedback Component */}
            <div className="flex justify-center">
              <Feedback collectionSlug="cases" />
            </div>
          </div>
        </div>

        {/* Cases Grid Section */}
        <div 
          className={`px-4 sm:px-8 pb-16 ${
            isLoading ? 'bg-black' : 'bg-[var(--color-grey-darkest)]'
          }`}
        >
          <div className="w-full mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LottieAnimation
                  animationData={animationData}
                  className="w-full h-auto max-w-[200px]"
                />
              </div>
            ) : sortedCases.length === 0 ? (
              <div className="flex flex-col items-center gap-4 pt-12">
                <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image 
                    src="/gifs/cat.gif" 
                    alt="No cases found" 
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
                <h3 className="h3 text-white">No Cases Found</h3>
                <p className="body text-white text-center max-w-[520px]">
                  We&apos;re preparing real-world case studies. Check back soon!
                </p>
              </div>
            ) : (
              <>
                <div 
                  className="flex flex-wrap justify-center pt-12 animate-fadeIn gap-4"
                  style={{ rowGap: '16px', columnGap: '16px' }}
                >
                  {sortedCases.map((caseItem) => (
                    <CasesCard
                      key={caseItem.id}
                      caseId={caseItem.id}
                      name={caseItem.name}
                      description={caseItem.description}
                      picture={caseItem.picture}
                      url={caseItem.url}
                      releaseDate={caseItem.release_date}
                      methods={caseItem.methods}
                      upvotes={caseItem.totalUpvotes}
                      downvotes={caseItem.totalDownvotes}
                      onVote={handleVote}
                    />
                  ))}
                </div>

                {/* Suggest more button below cases */}
                <div className="flex justify-center pt-20 pb-20">
                  <Link 
                    variant="suggest-more"
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
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Toast Message */}
      <ToastMessage
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        variant={toastVariant}
      />
    </div>
  );
}
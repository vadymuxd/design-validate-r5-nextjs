'use client';

import { Feedback } from '@/components/Feedback';
import { Pill } from '@/components/Pill';
import { ToolCard, VoteResult } from '@/components/ToolCard';
import { ApiMethod, ApiTool } from '@/data/types';
import { TitleNavigation } from '@/components/TitleNavigation';
import { PageLoader } from '@/components/PageLoader';
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import Image from 'next/image';
import LottieAnimation from '@/components/LottieAnimation';
import animationData from '../../../public/gifs/cube-2.json';
import { ToastMessage } from '@/components/ToastMessage';
import { useSearchParams, useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Suspense } from 'react';

function ToolsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [methods, setMethods] = useState<ApiMethod[]>([]);
  const [activeMethodSlug, setActiveMethodSlug] = useState<string>('');
  const [tools, setTools] = useState<ApiTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [methodsLoading, setMethodsLoading] = useState(true);

  // State for the toast message, lifted up from ToolCard
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');
  
  // Fetch methods from the database (only once)
  const fetchMethods = useCallback(async () => {
    setMethodsLoading(true);
    try {
      const response = await fetch('/api/methods');
      if (response.ok) {
        const data = await response.json();
        const fetchedMethods = data.methods || [];
        setMethods(fetchedMethods);
      } else {
        console.error('Failed to fetch methods');
        setMethods([]);
      }
    } catch (error) {
      console.error('Error fetching methods:', error);
      setMethods([]);
    } finally {
      setMethodsLoading(false);
    }
  }, []);

  const fetchToolsForMethod = useCallback(async (slug: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools?method_slug=${encodeURIComponent(slug)}`);
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools || []);
      } else {
        console.error('Failed to fetch tools for method:', slug);
        setTools([]); // Clear tools on error
      }
    } catch (error) {
      console.error('Error fetching tools from database:', error);
      setTools([]); // Clear tools on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch methods on component mount (only once)
  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  // Set active method based on URL parameter or default to "all-in" when methods are loaded
  useEffect(() => {
    if (methods.length > 0 && !activeMethodSlug) {
      const urlMethodSlug = searchParams.get('method_slug');
      
      // Check if the URL method slug exists in the methods list
      const methodExists = urlMethodSlug && methods.some(method => method.slug === urlMethodSlug);
      
      if (methodExists) {
        setActiveMethodSlug(urlMethodSlug);
      } else {
        // Default to "all-in" method instead of first method
        setActiveMethodSlug('all-in');
      }
    }
  }, [methods, activeMethodSlug, searchParams]);

  // Fetch tools when active method changes
  useEffect(() => {
    if (activeMethodSlug) {
      fetchToolsForMethod(activeMethodSlug);
    }
  }, [activeMethodSlug, fetchToolsForMethod]);

  const handleVote = (result: VoteResult) => {
    // Show the toast message from the child component
    setToastMessage(result.message);
    setToastVariant(result.variant);
    setShowToast(true);

    // If the vote was successful, update the tool's vote count in the local state
    if (result.voteStatus === 'VOTE_CREATED' || result.voteStatus === 'VOTE_UPDATED') {
      setTools(currentTools => {
        const updatedTools = currentTools.map(tool => {
          if (tool.id === result.toolId) {
            let newUpvotes = tool.upvotes;
            let newDownvotes = tool.downvotes;

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
            
            // Calculate new net score for proper ranking
            const newNetScore = newUpvotes - newDownvotes;
            
            return { 
              ...tool, 
              upvotes: newUpvotes, 
              downvotes: newDownvotes,
              net_score: newNetScore
            };
          }
          return tool;
        });
        
        // Re-sort tools by net score to maintain proper ranking (same as API sorting)
        return updatedTools.sort((a, b) => b.net_score - a.net_score);
      });
    }
  };

  const handleMethodClick = (slug: string) => {
    if (slug !== activeMethodSlug) {
      setActiveMethodSlug(slug);
      // Update the URL to reflect the new method selection
      const newUrl = `/tools?method_slug=${encodeURIComponent(slug)}`;
      router.push(newUrl, { scroll: false });
    }
  };

  const currentMethod = methods.find((method: ApiMethod) => method.slug === activeMethodSlug);

  return (
    <>
      <PageLoader titleNavigation={<TitleNavigation />}>
        {/* Methods */}
        <div className="w-full max-w-[880px] flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap justify-center py-8">
            {methodsLoading ? (
              <div className="flex justify-center items-center h-12">
                <div className="text-white">Loading methods...</div>
              </div>
            ) : (
              methods.map((method: ApiMethod) => (
                <Pill
                  key={method.id}
                  label={method.name}
                  isActive={method.slug === activeMethodSlug}
                  onClick={() => handleMethodClick(method.slug)}
                />
              ))
            )}
          </div>
        </div>

        {/* Loading state for tools */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LottieAnimation
              animationData={animationData}
              className="w-full h-auto max-w-[200px]"
            />
          </div>
        ) : (
          /* Content: Tools or Coming Soon */
          tools.length > 0 ? (
            <>
              {/* Feedback Section - Moved above tools */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <p className="body text-[var(--foreground)] text-center max-w-[730px]">
                  Tools are ranked by recommendations net score (upvotes - downvotes). Vote for the best, let other people know. If you don&apos;t see a tool that should be here, send us a message!
                </p>
                {currentMethod && (
                  <Feedback collectionSlug="tools" contextSlug={currentMethod.slug} />
                )}
              </div>

              {/* Tools Grid */}
              <div className="w-full max-w-[730px] flex flex-col gap-0.5">
                {tools.map((tool, index) => (
                  <ToolCard
                    key={tool.id}
                    toolId={tool.id}
                    methodId={tool.method_id}
                    name={tool.name}
                    description={tool.description}
                    featureDescription={tool.feature_description}
                    logo={tool.logo_url}
                    url={tool.website_url}
                    upvotes={tool.upvotes}
                    downvotes={tool.downvotes}
                    proText={tool.pro_text}
                    conText={tool.con_text}
                    onVote={handleVote}
                    isFirst={index === 0}
                    isLast={index === tools.length - 1}
                    leaderboardPositions={tool.leaderboard_positions}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full max-w-[730px] flex flex-col items-center justify-center min-h-[300px] gap-4">
              <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image 
                  src="/gifs/cat.gif" 
                  alt="Coming soon" 
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
              <h3 className="h3 text-[var(--foreground)]">Coming Soon</h3>
              <p className="body text-[var(--foreground)] text-center max-w-[520px]">
                {`We're working hard to bring you a curated list of tools for this method. Like or dislike to help us prioritize!`}
              </p>
              {currentMethod && (
                <Feedback collectionSlug="tools" contextSlug={currentMethod.slug} />
              )}
            </div>
          )
        )}
      </PageLoader>

      {!methodsLoading && !isLoading && (
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

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <LottieAnimation
          animationData={animationData}
          className="w-full h-auto max-w-[200px]"
        />
      </div>
    }>
      <ToolsPageContent />
    </Suspense>
  );
} 
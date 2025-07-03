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
import { useSearchParams } from 'next/navigation';
import { Footer } from '@/components/Footer';

export default function ToolsPage() {
  const searchParams = useSearchParams();
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

  // Set active method based on URL parameter or first method when methods are loaded
  useEffect(() => {
    if (methods.length > 0 && !activeMethodSlug) {
      const urlMethodSlug = searchParams.get('method_slug');
      
      // Check if the URL method slug exists in the methods list
      const methodExists = urlMethodSlug && methods.some(method => method.slug === urlMethodSlug);
      
      if (methodExists) {
        setActiveMethodSlug(urlMethodSlug);
      } else {
        // Fallback to first method if URL method doesn't exist or isn't provided
        setActiveMethodSlug(methods[0].slug);
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
      setTools(currentTools => 
        currentTools.map(tool => {
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
            return { ...tool, upvotes: newUpvotes, downvotes: newDownvotes };
          }
          return tool;
        })
      );
    }
  };

  const handleMethodClick = (slug: string) => {
    if (slug !== activeMethodSlug) {
      setActiveMethodSlug(slug);
    }
  };

  const currentMethod = methods.find((method: ApiMethod) => method.slug === activeMethodSlug);

  return (
    <>
      <PageLoader titleNavigation={<TitleNavigation />}>
        {/* Methods */}
        <div className="w-full max-w-[730px] flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap justify-center">
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
              {/* Tools Grid */}
              <div className="w-full max-w-[730px] flex flex-col gap-2">
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    toolId={tool.id}
                    methodId={tool.method_id}
                    name={tool.name}
                    description={tool.description}
                    logo={tool.logo_url}
                    url={tool.website_url}
                    upvotes={tool.upvotes}
                    downvotes={tool.downvotes}
                    proText={tool.pro_text}
                    conText={tool.con_text}
                    onVote={handleVote}
                  />
                ))}
              </div>

              {/* Feedback Section */}
              <div className="flex flex-col items-center gap-4 mt-8">
                <p className="body text-[var(--foreground)] text-center max-w-[730px]">
                  This is a synthesized analysis of user sentiment (late 2023 - mid-2025) from G2, Capterra, TrustRadius, and Reddit. Numbers represent &quot;negative&quot; and &quot;positive&quot; mentions by users from listed sources plus unique users&apos; votes on this site. The initial sentiment analysis done by Gemini 2.5 Pro
                </p>
                {currentMethod && (
                  <Feedback collectionSlug="tools" methodSlug={currentMethod.slug} />
                )}
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
                <Feedback collectionSlug="tools" methodSlug={currentMethod.slug} />
              )}
            </div>
          )
        )}
      </PageLoader>

      {!methodsLoading && !isLoading && (
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
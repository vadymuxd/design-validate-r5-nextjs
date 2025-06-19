'use client';

import { Feedback } from '@/components/Feedback';
import { Pill } from '@/components/Pill';
import { ToolCard, VoteResult } from '@/components/ToolCard';
import { ApiCategory, ApiTool } from '@/data/types';
import { TitleNavigation } from '@/components/TitleNavigation';
import { UpdatedAt } from '@/components/UpdatedAt';
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import Image from 'next/image';
import { ToastMessage } from '@/components/ToastMessage';

// This is a temporary, hardcoded list until a proper API endpoint for categories is created.
// In a real app, this would be fetched from the database.
const FAKE_CATEGORIES: ApiCategory[] = [
  { id: 1, name: 'Usability Testing', slug: 'usability-testing' },
  { id: 2, name: 'Event Tracking', slug: 'event-tracking' },
  { id: 3, name: 'A/B Testing', slug: 'ab-testing' },
  { id: 4, name: 'UX Data Analysis', slug: 'ux-data-analysis' },
  { id: 5, name: 'Session Replays', slug: 'session-replays' },
  { id: 6, name: 'Heat-maps', slug: 'heat-maps' },
  { id: 7, name: 'AI Validation', slug: 'ai-validation' },
  { id: 8, name: 'Surveys', slug: 'surveys' },
  { id: 9, name: 'User Feedback', slug: 'user-feedback' },
  { id: 10, name: 'Concept Testing', slug: 'concept-testing' },
];

export default function ToolsPage() {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(FAKE_CATEGORIES[0].slug);
  const [tools, setTools] = useState<ApiTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the toast message, lifted up from ToolCard
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');
  
  const fetchToolsForCategory = useCallback(async (slug: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools?category_slug=${encodeURIComponent(slug)}`);
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools || []);
      } else {
        console.error('Failed to fetch tools for category:', slug);
        setTools([]); // Clear tools on error
      }
    } catch (error) {
      console.error('Error fetching tools from database:', error);
      setTools([]); // Clear tools on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToolsForCategory(activeCategorySlug);
  }, [activeCategorySlug, fetchToolsForCategory]);

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

  const handleCategoryClick = (slug: string) => {
    if (slug !== activeCategorySlug) {
      setActiveCategorySlug(slug);
    }
  };

  const currentCategory = FAKE_CATEGORIES.find(cat => cat.slug === activeCategorySlug);

  return (
    <main className="min-h-screen flex flex-col bg-black">
      <div className="flex flex-col items-center py-12 px-4 sm:px-8 gap-8 flex-1">
        <TitleNavigation />

        {/* Categories */}
        <div className="w-full max-w-[730px] flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap justify-center">
            {FAKE_CATEGORIES.map((category) => (
              <Pill
                key={category.id}
                label={category.name}
                isActive={category.slug === activeCategorySlug}
                onClick={() => handleCategoryClick(category.slug)}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Image
              src="/gifs/Pi-Slices Loading.gif"
              alt="Loading..."
              width={200}
              height={200}
              style={{ clipPath: 'inset(20px)' }}
              unoptimized
            />
          </div>
        ) : tools.length > 0 ? (
          <>
            {/* Tools Grid */}
            <div className="w-full max-w-[730px] flex flex-col gap-2">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  toolId={tool.id}
                  categoryId={tool.category_id}
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
              {currentCategory && (
                <Feedback collectionSlug="tools" categorySlug={currentCategory.slug} />
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
              {`We're working hard to bring you a curated list of tools for this category. Like or dislike to help us prioritize!`}
            </p>
            {currentCategory && (
              <Feedback collectionSlug="tools" categorySlug={currentCategory.slug} />
            )}
          </div>
        )}
      </div>

      {/* Footer Section */}
      {!isLoading && (
        <footer className="footer-section">
          <UpdatedAt />
        </footer>
      )}
      
      <ToastMessage
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        variant={toastVariant}
      />
    </main>
  );
} 
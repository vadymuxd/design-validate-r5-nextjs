'use client';

import { Feedback } from '@/components/Feedback';
import { Pill } from '@/components/Pill';
import { ToolCard, VoteResult } from '@/components/ToolCard';
import { ApiCategory, ApiTool } from '@/data/types';
import { TitleNavigation } from '@/components/TitleNavigation';
import { Footer } from '@/components/Footer';
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import Image from 'next/image';
import { ToastMessage } from '@/components/ToastMessage';

export default function ToolsPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('');
  const [tools, setTools] = useState<ApiTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  // State for the toast message, lifted up from ToolCard
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');
  
  // Fetch categories from the database (only once)
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        const fetchedCategories = data.categories || [];
        setCategories(fetchedCategories);
      } else {
        console.error('Failed to fetch categories');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []); // No dependencies - fetch only once

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

  // Combined effect to track overall loading status
  useEffect(() => {
    if (!categoriesLoading && !isLoading) {
      const timer = setTimeout(() => setIsContentLoaded(true), 300); // Small delay for smoother transition
      return () => clearTimeout(timer);
    }
  }, [categoriesLoading, isLoading]);

  // Fetch categories on component mount (only once)
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Set first category as active when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategorySlug) {
      setActiveCategorySlug(categories[0].slug);
    }
  }, [categories, activeCategorySlug]);

  // Fetch tools when active category changes
  useEffect(() => {
    if (activeCategorySlug) {
      fetchToolsForCategory(activeCategorySlug);
    }
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

  const currentCategory = categories.find((cat: ApiCategory) => cat.slug === activeCategorySlug);

  return (
    <main className="min-h-screen flex flex-col bg-black">
      <div className="flex flex-col items-center py-12 px-4 sm:px-8 gap-8 flex-1">
        <TitleNavigation />

        {!isContentLoaded ? (
          <div className="flex justify-center items-center h-64">
            <Image
              src="/gifs/Pi-Slices.gif"
              alt="Loading..."
              width={200}
              height={200}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '200px',
              }}
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8 animate-fadeIn">
            {/* Categories */}
            <div className="w-full max-w-[730px] flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap justify-center">
                {categoriesLoading ? (
                  <div className="flex justify-center items-center h-12">
                    <div className="text-white">Loading categories...</div>
                  </div>
                ) : (
                  categories.map((category: ApiCategory) => (
                    <Pill
                      key={category.id}
                      label={category.name}
                      isActive={category.slug === activeCategorySlug}
                      onClick={() => handleCategoryClick(category.slug)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Content: Tools or Coming Soon */}
            {tools.length > 0 ? (
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
        )}
      </div>

      {/* Footer Section */}
      {isContentLoaded && (
        <footer className="footer-section animate-fadeIn">
          <Footer />
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
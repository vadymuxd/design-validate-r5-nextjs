'use client';

import { Feedback } from '@/components/Feedback';
import { Pill } from '@/components/Pill';
import { ToolCard } from '@/components/ToolCard';
import { abTestingTools } from '@/data/abTesting';
import { behaviourTrackingTools } from '@/data/behaviourTracking';
import { Category, categories } from '@/data/types';
import { usabilityTestingTools } from '@/data/usabilityTesting';
import { uxDataAnalysisTools } from '@/data/uxDataAnalysis';
import { sessionReplaysTools } from '@/data/sessionReplays';
import { heatmapsTools } from '@/data/heatmaps';
import { aiValidationTools } from '@/data/aiValidation';
import { surveysTools } from '@/data/surveys';
import { userFeedbackTools } from '@/data/userFeedback';
import { conceptTestingTools } from '@/data/conceptTesting';
import { CategorySelector } from '@/components/CategorySelector';
import { UpdatedAt } from '@/components/UpdatedAt';
// import Image from 'next/image';
import { useState, useEffect } from 'react';

interface DatabaseTool {
  id: string;
  name: string;
  pill: string;
  current_upvotes_total: number;
  current_downvotes_total: number;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('usabilityTesting');
  const [databaseTools, setDatabaseTools] = useState<DatabaseTool[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const fetchToolsFromDatabase = async (pill: string, isRefresh = false) => {
    try {
      if (!isRefresh) {
        setIsInitialLoading(true);
      }
      const response = await fetch(`/api/tools?pill=${encodeURIComponent(pill)}`);
      if (response.ok) {
        const data = await response.json();
        setDatabaseTools(data.tools || []);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching tools from database:', error);
      return false;
    } finally {
      if (!isRefresh) {
        setIsInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeCategory === 'usabilityTesting') {
      fetchToolsFromDatabase('usability testing');
    }
  }, [activeCategory]);

  const refreshTools = async (showSuccessToast: () => void) => {
    if (activeCategory === 'usabilityTesting') {
      // Save current scroll position
      const scrollPosition = window.scrollY;
      
      const success = await fetchToolsFromDatabase('usability testing', true);
      if (success) {
        // Restore scroll position after data update
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
          // Call the success callback to show the toast after data is refreshed
          showSuccessToast();
        });
      }
    }
  };

  // Merge database tools with static data for usability testing
  const getToolsForCategory = () => {
    if (activeCategory === 'usabilityTesting') {
      const mergedTools = usabilityTestingTools.map(staticTool => {
        const dbTool = databaseTools.find(dbTool => dbTool.name === staticTool.name);
        return {
          ...staticTool,
          upvotes: dbTool?.current_upvotes_total ?? staticTool.upvotes,
          downvotes: dbTool?.current_downvotes_total ?? staticTool.downvotes,
        };
      });

      // Sort by NET score (upvotes - downvotes) in descending order
      return mergedTools.sort((a, b) => {
        const netScoreA = a.upvotes - a.downvotes;
        const netScoreB = b.upvotes - b.downvotes;
        return netScoreB - netScoreA; // Descending order (highest NET score first)
      });
    }

    // For other categories, use static data
    const toolsMap = {
      behaviourTracking: behaviourTrackingTools,
      abTesting: abTestingTools,
      uxDataAnalysis: uxDataAnalysisTools,
      sessionReplays: sessionReplaysTools,
      heatmaps: heatmapsTools,
      aiValidation: aiValidationTools,
      surveys: surveysTools,
      userFeedback: userFeedbackTools,
      conceptTesting: conceptTestingTools,
    };
    return toolsMap[activeCategory] || [];
  };

  const tools = getToolsForCategory();

  return (
    <main className="min-h-screen flex flex-col bg-black">
      <div className="flex flex-col items-center py-12 px-8 gap-8 flex-1">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-[60px] h-[60px]">
            <svg
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle cx="30" cy="30" r="30" fill="url(#gradient)" />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="30"
                  y1="0"
                  x2="30"
                  y2="60"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF3654" />
                  <stop offset="1" stopColor="#FF3654" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <CategorySelector />
        </div>

        {/* Categories */}
        <div className="w-full max-w-[730px] flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <Pill
                key={category.id}
                id={category.id}
                label={category.label}
                isActive={category.id === activeCategory}
                onClick={setActiveCategory}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        {isInitialLoading ? (
          <div className="w-full max-w-[730px] flex flex-col items-center justify-center min-h-[300px]">
            <img src="/gifs/Pi-Slices Loading.gif" alt="Loading..." style={{ width: 120, height: 'auto' }} />
          </div>
        ) : activeCategory === 'usabilityTesting' ? (
          <>
            {/* Tools Grid */}
            <div className="w-full max-w-[730px] flex flex-col gap-2">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.name}
                  name={tool.name}
                  description={tool.description}
                  logo={tool.logo_url}
                  url={tool.website_url}
                  upvotes={tool.upvotes}
                  downvotes={tool.downvotes}
                  pros={tool.pros}
                  cons={tool.cons}
                  onVoteUpdate={refreshTools}
                />
              ))}
            </div>

            {/* Feedback Section */}
            <div className="flex flex-col items-center gap-4">
            <p className="text-white text-[10px] leading-[1.4] text-center max-w-[520px]">
                This is a synthesized analysis of user sentiment (late 2023 - mid-2025) from G2, Capterra, TrustRadius, and Reddit.
                Numbers represent &quot;negative&quot; and &quot;positive&quot; mentions by users. It is reflecting the volume and intensity of
                feedback, not a literal count of every comment. Done by Gemini 2.5 Pro
              </p>
              <Feedback />
            </div>
          </>
        ) : (
          <div className="w-full max-w-[730px] flex flex-col items-center justify-center min-h-[300px]">
            <img src="/gifs/cat.gif" alt="Coming soon" style={{ width: 320, height: 'auto' }} />
          </div>
        )}
      </div>
      {/* Footer Section */}
      {!isInitialLoading && (
        <footer style={{ borderTop: '1px solid var(--color-grey-dark)' }} className="w-full flex flex-col items-center py-8 mt-8">
          <UpdatedAt />
        </footer>
      )}
    </main>
  );
}

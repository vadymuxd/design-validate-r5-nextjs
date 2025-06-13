'use client';

import { Feedback } from '@/components/Feedback';
import { Pill } from '@/components/Pill';
import { ToolCard } from '@/components/ToolCard';
import { abTestingTools } from '@/data/abTesting';
import { eventTrackingTools } from '@/data/eventTracking';
import { Category, categories } from '@/data/types';
import { usabilityTestingTools } from '@/data/usabilityTesting';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('usabilityTesting');

  const tools = {
    usabilityTesting: usabilityTestingTools,
    eventTracking: eventTrackingTools,
    abTesting: abTestingTools,
  }[activeCategory];

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col items-center py-12 px-8 gap-8">
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
          <h1 className="font-['Inter'] font-bold text-[40px] text-white text-center">
            Design. Validate
          </h1>
        </div>

        {/* Categories */}
        <div className="flex gap-2">
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

        {/* Content */}
        {activeCategory === 'usabilityTesting' ? (
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
                />
              ))}
            </div>

            {/* Feedback Section */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-white text-[10px] leading-[1.4] text-center max-w-[520px]">
                Synthesized analysis of user sentiment (late 2023 - mid-2025) from G2, Capterra, TrustRadius, and Reddit.
                Numbers represent &quot;negative&quot; and &quot;positive&quot; mentions by users. It is reflecting the volume and intensity of
                feedback, not a literal count of every comment. Done by Gemini 2.5 Pro
              </p>
              <Feedback />
            </div>
          </>
        ) : (
          <div className="w-full max-w-[730px] flex justify-center">
            <Image 
              src="/gifs/cat.gif"
              alt="Coming soon"
              width={400}
              height={400}
              unoptimized
            />
          </div>
        )}
      </div>
    </main>
  );
}

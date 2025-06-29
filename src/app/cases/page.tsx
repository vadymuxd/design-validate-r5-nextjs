'use client';

import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';
import Image from 'next/image';

export default function CasesPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <TitleNavigation />
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            src="/gifs/cat.gif" 
            alt="Cases coming soon" 
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
          <h3 className="h3 text-[var(--foreground)]">Coming Soon</h3>
          <p className="body text-[var(--foreground)] text-center max-w-[520px]">
            We&apos;re collecting real-world design case studies from Medium, company blogs, and industry publications. These will show actual validation challenges and how they were solved.
          </p>
          <Feedback collectionSlug="cases" />
        </div>
      </div>
    </main>
  );
} 
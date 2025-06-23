'use client';

import { Feedback } from '@/components/Feedback';
import Image from 'next/image';

export default function CommunityPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <h1 className="h1">Community</h1>
      </div>

      {/* Content Area */}
      <div className="content-area" style={{ justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            src="/gifs/Matrix_Cats-ezgif.com-crop.gif" 
            alt="Community coming soon" 
            width={400}
            height={0}
            style={{
              width: '400px',
              height: 'auto',
              display: 'block'
            }}
            unoptimized
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="h3 text-[var(--foreground)]">Coming Soon</h3>
          <p className="body text-[var(--foreground)] text-center max-w-[520px]">
            We&apos;re building a space for the design validation community to connect, share stories, ask questions, and discover events. Join us to discuss everything related to validating design decisions.
          </p>
          <Feedback collectionSlug="community" />
        </div>
      </div>
    </main>
  );
} 
'use client';

import { UpdatedAt } from '@/components/UpdatedAt';
import { Feedback } from '@/components/Feedback';
import Image from 'next/image';

export default function CommunityPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <h1 className="h1">Community</h1>
        
        <p className="seo-only">
          Join the Design. Validate community to discuss and share insights about design validation. Connect with designers, share stories, ask questions, and discover events.
        </p>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            src="/gifs/cat.gif" 
            alt="Community coming soon" 
            width={320}
            height={300}
            style={{
              width: '100%',
              maxWidth: 320,
              height: 300,
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
            We&apos;re building a space for the design validation community to connect, share stories, ask questions, and discover events. Join us to discuss everything related to validating design decisions.
          </p>
          <Feedback component="Community" category="community" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <UpdatedAt />
      </footer>
    </main>
  );
} 
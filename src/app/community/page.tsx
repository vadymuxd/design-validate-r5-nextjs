'use client';

import { UpdatedAt } from '@/components/UpdatedAt';
import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';

export default function CommunityPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <TitleNavigation />
        
        <p className="seo-only">
          Join the Design. Validate community to discuss and share insights about design validation. Connect with designers, share stories, ask questions, and discover events.
        </p>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src="/gifs/cat.gif" 
            alt="Community coming soon" 
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
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-white text-xl font-medium">Coming Soon</h3>
          <p className="text-white text-[16px] leading-[1.4] text-center max-w-[520px]">
            We're building a space for the design validation community to connect, share stories, ask questions, and discover events. Join us to discuss everything related to validating design decisions.
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
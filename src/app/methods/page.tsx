'use client';

import { UpdatedAt } from '@/components/UpdatedAt';
import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';

export default function MethodsPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <TitleNavigation />
        
        <p className="seo-only">
          Discover comprehensive design validation methods and research techniques. Learn structured, educational approaches to validating your design decisions with proven methodologies.
        </p>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src="/gifs/cat.gif" 
            alt="Methods coming soon" 
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
            We're curating the best design validation methods and research techniques for you. This will include structured educational content to help you choose the right validation approach for your design challenges.
          </p>
          <Feedback component="Methods" category="methods" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <UpdatedAt />
      </footer>
    </main>
  );
} 
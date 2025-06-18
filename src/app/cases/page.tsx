'use client';

import { UpdatedAt } from '@/components/UpdatedAt';
import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';

export default function CasesPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <TitleNavigation />
        
        <p className="seo-only">
          Real-world design case studies showing how design challenges were solved and success measured. Learn from actual validation examples connected to industry blog posts and stories.
        </p>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src="/gifs/cat.gif" 
            alt="Cases coming soon" 
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
            We're collecting real-world design case studies from Medium, company blogs, and industry publications. These will show actual validation challenges and how they were solved.
          </p>
          <Feedback component="Cases" category="cases" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <UpdatedAt />
      </footer>
    </main>
  );
} 
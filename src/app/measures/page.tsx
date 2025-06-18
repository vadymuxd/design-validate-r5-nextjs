'use client';

import { UpdatedAt } from '@/components/UpdatedAt';
import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';

export default function MeasuresPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <TitleNavigation />
        
        <p className="seo-only">
          Comprehensive collection of UX and product metrics, KPIs, and performance indicators. Learn how to measure design success with structured, actionable metrics for real-world application.
        </p>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src="/gifs/cat.gif" 
            alt="Measures coming soon" 
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
            We're building a comprehensive library of UX metrics, KPIs, and performance indicators. This will help you choose the right metrics to measure your design success and impact.
          </p>
          <Feedback component="Measures" category="measures" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <UpdatedAt />
      </footer>
    </main>
  );
} 
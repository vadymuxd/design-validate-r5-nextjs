'use client';

import { Feedback } from '@/components/Feedback';
import { Footer } from '@/components/Footer';
import { TitleNavigation } from '@/components/TitleNavigation';
import Image from 'next/image';

export default function FrameworksPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <TitleNavigation />
        
        <p className="seo-only">
          Explore established design measurement frameworks introduced by leading companies. Learn proven methodologies for measuring design impact and success from industry leaders.
        </p>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            src="/gifs/cat.gif" 
            alt="Frameworks coming soon" 
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
            We&apos;re curating established measurement frameworks from leading companies like Google, Airbnb, and Spotify. Learn how top organizations measure design success and impact.
          </p>
          <Feedback collectionSlug="frameworks" />
        </div>
      </div>
    </main>
  );
} 
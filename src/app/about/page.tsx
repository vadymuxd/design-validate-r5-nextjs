'use client';

import { Feedback } from '@/components/Feedback';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="page-container">
      {/* Header */}
      <div className="header-section">
        <h1 className="h1">About</h1>
        
        <p className="seo-only">
          Learn about Design. Validate&apos;s mission to help designers make data-driven decisions. Discover our platform&apos;s purpose and how to get in touch with our team.
        </p>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            src="/gifs/cat.gif" 
            alt="About coming soon" 
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
            We&apos;re crafting our story and mission to help designers validate their work with data-driven insights. This page will include our vision, team information, and ways to contact us.
          </p>
          <Feedback collectionSlug="about" />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer-section">
        <Footer />
      </footer>
    </main>
  );
} 
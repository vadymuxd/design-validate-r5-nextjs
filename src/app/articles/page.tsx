'use client';

import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

export default function ArticlesPage() {
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 60px)' }}>
    <main className="page-container flex-grow" style={{ minHeight: 'auto' }}>
      {/* Header */}
      <div className="header-section">
        <TitleNavigation />
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div style={{ width: '100%', maxWidth: 320, height: 240, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src="/gifs/cat.gif"
            alt="Articles coming soon"
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
            We&apos;re curating the best articles on design validation from industry leaders, researchers, and practitioners. Learn from expert insights and methodologies.
          </p>
          <Feedback collectionSlug="articles" />
        </div>
      </div>
    </main>
    
    <footer className="bg-black py-12 border-t border-[var(--color-grey-dark)]">
      <Footer />
    </footer>
    </div>
  );
} 
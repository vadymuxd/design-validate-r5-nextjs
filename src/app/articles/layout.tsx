import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | Design. Validate',
  description: 'A collection of articles on design validation, user research, and data-driven design.',
  keywords: [
    'design articles',
    'design validation',
    'user research',
    'product design',
    'ux design',
  ],
  openGraph: {
    title: 'Articles | Design. Validate',
    description: 'A collection of articles on design validation, user research, and data-driven design.',
    url: '/articles',
    siteName: 'Design. Validate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Design. Validate',
    description: 'A collection of articles on design validation, user research, and data-driven design.',
  },
  alternates: {
    canonical: '/articles',
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
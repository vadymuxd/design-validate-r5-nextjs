import type { Metadata } from "next";
import React, { ReactNode } from 'react';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Design Validation Tools | Design. Validate",
  description: "Discover and compare the best design validation tools. Rankings based on user sentiment analysis from G2, Capterra, TrustRadius, and Reddit. Find tools for usability testing, A/B testing, analytics, and more.",
  keywords: [
    "design validation tools",
    "usability testing tools", 
    "A/B testing software",
    "UX research tools",
    "analytics tools",
    "user feedback tools",
    "design tools comparison"
  ],
  openGraph: {
    title: "Design Validation Tools | Design. Validate",
    description: "Discover and compare the best design validation tools. Rankings based on user sentiment analysis from G2, Capterra, TrustRadius, and Reddit.",
    url: "/tools",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Validation Tools | Design. Validate",
    description: "Discover and compare the best design validation tools. Rankings based on user sentiment analysis.",
  },
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 
import type { Metadata } from "next";
import React, { ReactNode } from 'react';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Design Case Studies | Design. Validate",
  description: "Real-world design case studies showing how design challenges were solved and success measured. Learn from actual validation examples connected to industry blog posts and stories.",
  keywords: [
    "design case studies",
    "UX case studies", 
    "design validation examples",
    "real design challenges",
    "design success stories",
    "validation case studies",
    "design research examples",
    "UX research cases"
  ],
  openGraph: {
    title: "Design Case Studies | Design. Validate",
    description: "Real-world design case studies showing how design challenges were solved and success measured.",
    url: "/cases",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Case Studies | Design. Validate",
    description: "Learn from real-world design validation examples and success stories from the industry.",
  },
  alternates: {
    canonical: "/cases",
  },
};

export default function CasesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 
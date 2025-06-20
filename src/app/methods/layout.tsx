import type { Metadata } from "next";
import React, { ReactNode } from 'react';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Design Validation Methods | Design. Validate",
  description: "Discover comprehensive design validation methods and research techniques. Learn structured, educational approaches to validating your design decisions with proven methodologies and best practices.",
  keywords: [
    "design validation methods",
    "UX research methods", 
    "design research techniques",
    "usability research",
    "user research methods",
    "design validation approaches",
    "research methodology",
    "validation frameworks"
  ],
  openGraph: {
    title: "Design Validation Methods | Design. Validate",
    description: "Discover comprehensive design validation methods and research techniques. Learn structured, educational approaches to validating your design decisions.",
    url: "/methods",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Validation Methods | Design. Validate",
    description: "Discover comprehensive design validation methods and research techniques for better design decisions.",
  },
  alternates: {
    canonical: "/methods",
  },
};

export default function MethodsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 
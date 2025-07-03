import { Metadata } from 'next';
import React from 'react';

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
    url: "https://www.design-validate.com/methods",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Validation Methods | Design. Validate",
    description: "Discover comprehensive design validation methods and research techniques for better design decisions.",
  },
  alternates: {
    canonical: "https://www.design-validate.com/methods",
  },
};

export default function MethodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
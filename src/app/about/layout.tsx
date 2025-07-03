import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Design. Validate | Our Mission",
  description: "Learn about Design. Validate's mission to help designers make data-driven decisions. Discover our platform's purpose and how to get in touch with our team.",
  keywords: [
    "about design validate",
    "design validation mission", 
    "contact design validate",
    "design validation platform",
    "design tools platform",
    "UX research platform",
    "design community"
  ],
  openGraph: {
    title: "About Design. Validate | Our Mission",
    description: "Learn about Design. Validate's mission to help designers make data-driven decisions through curated tools and resources.",
    url: "https://www.design-validate.com/about",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Design. Validate | Our Mission",
    description: "Discover our mission to help designers make data-driven decisions through validation tools and resources.",
  },
  alternates: {
    canonical: "https://www.design-validate.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Community | Design. Validate',
  description: 'Join the Design. Validate community to discuss and share insights about design validation. Connect with designers, share stories, ask questions, and discover events.',
  keywords: [
    "design community",
    "UX community", 
    "design validation forum",
    "design discussion",
    "UX research community",
    "design validation chat",
    "design events",
    "design networking"
  ],
  openGraph: {
    title: "Design Validation Community | Design. Validate",
    description: "Join the Design. Validate community to discuss and share insights about design validation with fellow designers.",
    url: "/community",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Validation Community | Design. Validate",
    description: "Connect with designers and share insights about design validation in our community.",
  },
  alternates: {
    canonical: "/community",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
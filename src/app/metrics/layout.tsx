import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'UX & Product Design Metrics | Design. Validate',
  description: 'Comprehensive collection of UX and product metrics, KPIs, and performance indicators. Learn how to measure design success with structured, actionable metrics for real-world application.',
  keywords: [
    "UX metrics",
    "design KPIs", 
    "product metrics",
    "user experience metrics",
    "design measurement",
    "performance indicators",
    "analytics metrics",
    "usability metrics"
  ],
  openGraph: {
    title: "UX Metrics & KPIs | Design. Validate",
    description: "Comprehensive collection of UX and product metrics, KPIs, and performance indicators for measuring design success.",
    url: "https://www.design-validate.com/metrics",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UX Metrics & KPIs | Design. Validate",
    description: "Learn how to measure design success with structured, actionable UX metrics and KPIs.",
  },
  alternates: {
    canonical: "https://www.design-validate.com/metrics",
  },
};

export default function MeasuresLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 
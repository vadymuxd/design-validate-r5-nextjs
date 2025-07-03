import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Measurement Frameworks | Design. Validate',
  description: 'Explore established design measurement frameworks introduced by leading companies. Learn proven methodologies for measuring design impact and success from industry leaders.',
  keywords: [
    "design frameworks",
    "measurement frameworks", 
    "design measurement methodologies",
    "design impact measurement",
    "design success frameworks",
    "UX frameworks",
    "product design frameworks",
    "design evaluation frameworks"
  ],
  openGraph: {
    title: "Design Measurement Frameworks | Design. Validate",
    description: "Explore established design measurement frameworks introduced by leading companies. Learn proven methodologies for measuring design impact and success.",
    url: "https://www.design-validate.com/frameworks",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Measurement Frameworks | Design. Validate",
    description: "Learn proven methodologies for measuring design impact and success from industry leaders.",
  },
  alternates: {
    canonical: "https://www.design-validate.com/frameworks",
  },
};

export default function FrameworksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 
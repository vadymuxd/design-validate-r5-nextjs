import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Measurement Frameworks | Design. Validate",
  description: "Explore established design measurement frameworks introduced by leading companies. Learn proven methodologies for measuring design impact and success from industry leaders.",
  keywords: [
    "design frameworks",
    "measurement frameworks", 
    "design methodologies",
    "UX frameworks",
    "design system frameworks",
    "product design frameworks",
    "validation frameworks",
    "design thinking frameworks"
  ],
  openGraph: {
    title: "Design Measurement Frameworks | Design. Validate",
    description: "Explore established design measurement frameworks from leading companies. Learn proven methodologies for measuring design impact.",
    url: "/frameworks",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Measurement Frameworks | Design. Validate",
    description: "Learn proven design measurement frameworks and methodologies from industry leaders.",
  },
  alternates: {
    canonical: "/frameworks",
  },
};

export default function FrameworksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
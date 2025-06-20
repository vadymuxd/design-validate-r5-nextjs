import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Design. Validate",
    default: "Design. Validate - Tools, Methods & Frameworks for Design Validation",
  },
  description: "Comprehensive platform for design validation featuring tools, methods, frameworks, and case studies. Make data-driven design decisions with curated resources and community insights.",
  keywords: [
    "design validation",
    "UX research",
    "design tools",
    "usability testing",
    "A/B testing",
    "user experience",
    "design methods",
    "design frameworks"
  ],
  authors: [{ name: "Design. Validate" }],
  creator: "Design. Validate",
  publisher: "Design. Validate",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Design. Validate",
    title: "Design. Validate - Tools, Methods & Frameworks for Design Validation",
    description: "Comprehensive platform for design validation featuring tools, methods, frameworks, and case studies.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@designvalidate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '', // Add Google Search Console verification ID when available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Design. Validate",
              "description": "Comprehensive platform for design validation featuring tools, methods, frameworks, and case studies.",
              "url": "https://design-validate.com",
              "logo": "https://design-validate.com/icon.png",
              "sameAs": [],
              "foundingDate": "2025",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "availableLanguage": "English"
              }
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
        <TopNav />
          <main className="flex-grow">{children}</main>
          <footer className="bg-black py-12 border-t border-[var(--color-grey-dark)]">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}

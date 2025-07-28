import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { UserTracking } from "@/components/UserTracking";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: "%s | Design. Validate",
    default: "Design. Validate - Community-Driven Tools, Methods & Frameworks for Design Validation",
  },
  description: "Design. Validate is the comprehensive platform for design validation featuring tools, methods, frameworks, and case studies. Make data-driven design decisions with curated resources and community insights.",
  keywords: [
    "Design. Validate",
    "design-validate", 
    "design validate",
    "design validation",
    "UX metrics",
    "UX measuring",
    "ux validation",
    "validate ux",
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
    title: "Design. Validate - Community-Driven Tools, Methods & Frameworks for Design Validation",
    description: "Design. Validate is the comprehensive platform for design validation featuring tools, methods, frameworks, and case studies.",
    images: ["/icon.png"],
    url: "https://www.design-validate.com",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@designvalidate",
    images: ["/icon.png"],
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
        {/* Hotjar Tracking Code - only in production */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:6465859,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Design. Validate",
              "description": "Comprehensive platform for design validation featuring tools, methods, frameworks, and case studies.",
              "url": "https://www.design-validate.com",
              "logo": "https://www.design-validate.com/icon.png",
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
        </div>
        {/* User tracking component - tracks users on page load */}
        <UserTracking enabled={true} debug={process.env.NODE_ENV === 'development'} />
      </body>
    </html>
  );
}

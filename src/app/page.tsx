import { TitleNavigation } from '@/components/TitleNavigation';
import { PageLoader } from '@/components/PageLoader';
import { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { CollectionGrid } from '../components/CollectionGrid';

export const metadata: Metadata = {
  title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
  description: "Explore community-driven collections of tools, methods, frameworks, and articles to validate design and measure the success of your digital solutions. Join a community of designers, product managers, and engineers.",
  keywords: ["Design. Validate", "design measurement", "UX metrics", "UX measuring", "ux validation", "validate ux", "design-validate", "design validate", "design validation", "UX design", "product design", "design tools", "design methods", "design frameworks", "usability testing", "A/B testing", "design metrics", "data-driven design"],
  openGraph: {
    title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
    description: "Explore community-driven collections to validate design and measure the success of your digital solutions.",
    url: "https://www.design-validate.com",
    siteName: "Design. Validate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
    description: "Explore community-driven collections to validate design and measure the success of your digital solutions.",
  },
  alternates: {
    canonical: "https://www.design-validate.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Design. Validate",
            "alternateName": ["Design Validate", "design-validate"],
            "url": "https://www.design-validate.com",
            "description": "Design. Validate helps designers make data-driven decisions through community-driven collections of tools, methods, frameworks, and articles for design validation.",
            "mainEntity": {
              "@type": "WebPage",
              "@id": "https://www.design-validate.com/#homepage",
              "name": "Design. Validate - Community-Driven Design Validation Platform",
              "description": "Community-driven collections to validate design and measure the success of your digital solutions"
            }
          }),
        }}
      />
    <div 
      className="flex flex-col pt-16 min-h-screen" 
      style={{ 
        background: 'radial-gradient(circle at top left, #19252eff 0%, #080A0B 100%)'
      }}
    >
      <PageLoader
        titleNavigation={<TitleNavigation showNav={false} />}
        className="bg-transparent flex flex-col px-0 flex-grow"
      >
        <div className="text-center" style={{ marginTop: '24px', marginBottom: 0 }}>
          <h1 className="sr-only">Design. Validate: Community-Driven Collections for Design Validation</h1>
          <p className="body max-w-xl mx-auto">
            Community-driven collections to validate design and measure the
            success of your digital solutions
          </p>
        </div>

        <div className="flex-grow flex flex-col justify-center w-full" style={{ marginTop: '80px', marginBottom: 0 }}>
          <CollectionGrid />
        </div>
      </PageLoader>
      <Footer noBorder />
    </div>
    </>
  );
}

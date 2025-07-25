import { TitleNavigation } from '@/components/TitleNavigation';
import { PageLoader } from '@/components/PageLoader';
import { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { CollectionGrid } from '../components/CollectionGrid';

export const metadata: Metadata = {
  title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
  description: "Explore community-driven collections of tools, methods, frameworks, and articles to validate design and measure the success of your digital solutions. Join a community of designers, product managers, and engineers.",
  keywords: ["design validation", "UX design", "product design", "design tools", "design methods", "design frameworks", "usability testing", "A/B testing", "design metrics", "data-driven design"],
  openGraph: {
    title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
    description: "Explore community-driven collections to validate design and measure the success of your digital solutions.",
    url: "https://www.design-validate.com",
  },
  twitter: {
    title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
    description: "Explore community-driven collections to validate design and measure the success of your digital solutions.",
  },
  alternates: {
    canonical: "https://www.design-validate.com",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 60px)' }}>
    <PageLoader
      titleNavigation={<TitleNavigation showNav={false} />}
      className="bg-black flex flex-col px-0 flex-grow"
    >
      <div className="text-center" style={{ marginTop: '24px' }}>
        <h1 className="sr-only">Community-Driven Collections for Design Validation</h1>
        <p className="body max-w-xl mx-auto">
          Community-driven collections to validate design and measure the
          success of your digital solutions
        </p>
      </div>

      <div className="flex-grow flex flex-col justify-center w-full" style={{ marginTop: '80px' }}>
        <CollectionGrid />
      </div>
    </PageLoader>
    <footer className="bg-black py-12">
      <Footer />
    </footer>
    </div>
  );
}

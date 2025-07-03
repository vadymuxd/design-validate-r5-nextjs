import CollectionCard from '@/components/CollectionCard';
import { TitleNavigation } from '@/components/TitleNavigation';
import { PageLoader } from '@/components/PageLoader';
import { Metadata } from 'next';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
  description: "Explore community-driven collections of tools, methods, frameworks, and articles to validate your design and measure the success of your digital solutions. Join a community of designers, product managers, and engineers.",
  keywords: ["design validation", "UX design", "product design", "design tools", "design methods", "design frameworks", "usability testing", "A/B testing", "design metrics", "data-driven design"],
  openGraph: {
    title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
    description: "Explore community-driven collections to validate your design and measure the success of your digital solutions.",
    url: "/",
  },
  twitter: {
    title: "Design. Validate: Community-Driven Tools, Methods & Frameworks",
    description: "Explore community-driven collections to validate your design and measure the success of your digital solutions.",
  },
  alternates: {
    canonical: "/",
  },
};

const collections = [
  {
    title: 'Methods',
    href: '/methods',
    imageUrl: '/images/Abstract/Star 1.png',
  },
  {
    title: 'Frameworks',
    href: '/frameworks',
    imageUrl: '/images/Abstract/Circle 1.png',
  },
  {
    title: 'Metrics',
    href: '/metrics',
    imageUrl: '/images/Abstract/Circle 2.png',
  },
  {
    title: 'Tools',
    href: '/tools',
    imageUrl: '/images/Abstract/Triangle 1.png',
  },
  { title: 'Cases', href: '/cases', imageUrl: '/images/Abstract/Ciecle 3.png' },
  {
    title: 'Articles',
    href: '/articles',
    imageUrl: '/images/Abstract/Star 2.png',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 60px)' }}>
    <PageLoader
      titleNavigation={<TitleNavigation showNav={false} />}
      className="bg-gradient-to-b from-black from-52.457% to-[#353535] flex flex-col px-0 flex-grow"
    >
      <div className="text-center">
        <h1 className="sr-only">Community-Driven Collections for Design Validation</h1>
        <p className="body mt-4 max-w-xl mx-auto">
          Community-driven collections to validate your design and measure the
          success of your digital solutions
        </p>
      </div>

      <div className="flex-grow flex flex-col justify-center w-full max-w-[730px] mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.title}
              title={collection.title}
              href={collection.href}
              imageUrl={collection.imageUrl}
            />
          ))}
        </div>
      </div>
    </PageLoader>
    <footer className="bg-black py-12 border-t border-[var(--color-grey-dark)]">
      <Footer />
    </footer>
    </div>
  );
}

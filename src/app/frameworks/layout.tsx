import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Measurement Frameworks | Design. Validate',
  description: 'Explore established design measurement frameworks introduced by leading companies. Learn proven methodologies for measuring design impact and success from industry leaders.',
};

export default function FrameworksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 
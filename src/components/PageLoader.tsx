'use client';

import { useLoading } from './LoadingProvider';
import Image from 'next/image';

export function PageLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div style={{ width: 240, height: 192, overflow: 'hidden', position: 'relative' }}>
        <Image 
          src="/gifs/Pi-Slices Loading.gif" 
          alt="Loading..." 
          width={240}
          height={240}
          style={{
            width: '100%',
            height: 240,
            objectFit: 'cover',
            position: 'absolute',
            left: 0,
            top: -24
          }}
          unoptimized
          priority
        />
      </div>
    </div>
  );
} 
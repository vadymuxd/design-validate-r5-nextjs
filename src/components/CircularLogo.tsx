'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CircularLogoProps {
  src: string;
  alt: string;
  size: number; // Circle diameter in pixels
  className?: string;
}

export function CircularLogo({ src, alt, size, className = '' }: CircularLogoProps) {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
    scale: number;
  } | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      
      // Calculate scale to fit the image within the circle
      // We want the smallest dimension to fit within the circle diameter
      const scaleWidth = size / naturalWidth;
      const scaleHeight = size / naturalHeight;
      const scale = Math.min(scaleWidth, scaleHeight);
      
      setImageDimensions({
        width: naturalWidth,
        height: naturalHeight,
        scale
      });
    };
    
    img.onerror = () => {
      setImageError(true);
    };
    
    img.src = src;
  }, [src, size]);

  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-400 text-xs">Logo</span>
      </div>
    );
  }

  if (!imageDimensions) {
    return (
      <div 
        className={`animate-pulse bg-gray-200 rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const { width, height, scale } = imageDimensions;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <div 
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={scaledWidth}
          height={scaledHeight}
          className="object-contain"
          priority={false}
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
} 
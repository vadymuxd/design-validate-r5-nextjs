import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ToolCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  upvotes: number;
  downvotes: number;
}

export function ToolCard({ name, description, logo, url, upvotes, downvotes }: ToolCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Logo - Circle mask with fixed dimensions */}
        <div className="relative w-[60px] h-[60px] shrink-0">
          <Image
            src={logo}
            alt={`${name} logo`}
            fill
            className="rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <Link 
            href={url}
            target="_blank"
            className="inline-block text-2xl font-bold text-black hover:underline mb-1"
          >
            {name}
          </Link>
          <p className="text-base font-medium text-black/80">{description}</p>
        </div>

        {/* Votes - Desktop: Vertical, Mobile: Horizontal */}
        <div className="flex sm:flex-col gap-2">
          <div className="bg-[#F2F2F7] rounded-[10px] px-2 py-1.5 flex items-center gap-1">
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0L13.9282 12H0.0717969L7 0Z" fill={upvotes > 0 ? "#77DB95" : "#8E8E93"} />
            </svg>
            <span className="font-medium text-base leading-normal">
              {upvotes}
            </span>
          </div>
          <div className="bg-[#F2F2F7] rounded-[10px] px-2 py-1.5 flex items-center gap-1">
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
              <path d="M7 0L13.9282 12H0.0717969L7 0Z" fill={downvotes > 0 ? "#FF3654" : "#8E8E93"} />
            </svg>
            <span className="font-medium text-base leading-normal">
              {downvotes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 
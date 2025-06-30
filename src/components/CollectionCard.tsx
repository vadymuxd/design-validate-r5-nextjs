import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CollectionCardProps {
  title: string;
  imageUrl: string;
  href: string;
  imageOpacityClass?: string;
  textContainerClass?: string;
  textColorClass?: string;
  imageHoverOpacityClass?: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  imageUrl,
  href,
  imageOpacityClass = 'opacity-20',
  textContainerClass = 'bg-[#383838]',
  textColorClass = 'text-white',
  imageHoverOpacityClass = 'group-hover:opacity-30',
}) => {
  return (
    <Link
      href={href}
      className="flex flex-row w-full sm:w-[200px] h-[100px] group"
    >
      <div
        className={`relative w-[100px] sm:w-1/2 h-full flex-shrink-0 transition-opacity overflow-hidden ${imageOpacityClass} ${imageHoverOpacityClass}`}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div
        className={`flex-grow sm:flex-grow-0 sm:w-1/2 flex items-center justify-center p-4 sm:p-0 transition-all group-hover:bg-opacity-50 ${textContainerClass}`}
      >
        <h3 className={`font-semibold text-sm leading-snug ${textColorClass}`}>
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CollectionCard; 
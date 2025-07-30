import React, { useState } from 'react';
import Image from 'next/image';


interface MetricCardProps {
  name: string;
  type: 'Time' | 'Ratio' | 'Count' | 'Scale' | 'Composite' | 'Money';
  description?: string | null;
  className?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
}


export function MetricCard({
  name,
  type,
  description,
  className = '',
  isFlipped = false,
  onFlip,
}: MetricCardProps) {

  // Map metric types to their corresponding icons
  const getIconPath = (metricType: string) => {
    const iconMap = {
      'Time': '/icons/metric-time.svg',
      'Ratio': '/icons/metric-ratio.svg',
      'Count': '/icons/metric-count.svg',
      'Scale': '/icons/metric-scale.svg',
      'Composite': '/icons/metric-composite.svg',
      'Money': '/icons/metric-money.svg',
    };
    return iconMap[metricType as keyof typeof iconMap] || '/icons/metric-time.svg';
  };


  // Toggle flip on click
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFlip) onFlip();
  };

  return (
    <div
      className={`
        w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]
        rounded-lg 
        cursor-pointer
        perspective-1000
        ${className}
      `}
      onClick={handleFlip}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && onFlip) {
          e.stopPropagation();
          onFlip();
        }
      }}
    >
      <div
        className={`
          w-full h-full
          relative
          transform-style-preserve-3d
          transition-transform duration-250
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Front Side - Normal State */}
        <div
          className={`
            absolute inset-0
            w-full h-full
            rounded-lg
            flex flex-col
            gap-2
            backface-hidden
          `}
          style={{
            background: 'linear-gradient(180deg, #41444D 0%, #172129 100%)',
            padding: '1px'
          }}
        >
          <div
            className="w-full h-full rounded-lg flex flex-col gap-2"
            style={{
              padding: '16px 16px 32px 16px',
              background: 'linear-gradient(135deg, #182229 0%, #121A1F 100%)'
            }}
          >
            {/* Icon */}
            <div className="flex justify-start">
              <Image
                src={getIconPath(type)}
                alt={`${type} metric icon`}
                width={15}
                height={15}
              />
            </div>
            
            {/* Metric Name */}
            <div className="flex items-start">
              <span className="label-responsive text-white leading-tight">
                {name}
              </span>
            </div>
          </div>
        </div>

        {/* Back Side - Hover State */}
        <div
          className={`
            absolute inset-0
            w-full h-full
            rounded-lg
            flex flex-col
            justify-center
            items-center
            backface-hidden
            rotate-y-180
            text-center
          `}
          style={{
            background: 'linear-gradient(180deg, #41444D 0%, #172129 100%)',
            padding: '1px'
          }}
        >
          <div
            className="w-full h-full bg-white rounded-lg flex flex-col justify-center items-center text-center"
            style={{
              padding: '16px'
            }}
          >
            {/* Description */}
            {description && (
              <span className="annotation text-black leading-tight">
                {description}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

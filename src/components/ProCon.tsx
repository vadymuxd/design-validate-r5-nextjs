import React from 'react';

interface ProConProps {
  variant: 'pro' | 'con';
  title: string;
  items: string[];
}

export const ProCon: React.FC<ProConProps> = ({ variant, title, items }) => {
  const borderColor = variant === 'pro' ? '#77DB95' : '#FF3654';
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div 
      className="bg-[#F2F2F7] rounded-lg p-4 border-l-4"
      style={{ borderLeftColor: borderColor }}
    >
      <h4 className="label-bold text-[var(--color-black)] mb-2">
        {title}
      </h4>
      <p className="annotation text-[var(--color-black)]">
        {items.join(', ')}
      </p>
    </div>
  );
}; 
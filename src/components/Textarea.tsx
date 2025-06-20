import React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={`bg-white border border-gray-300 text-black rounded-lg p-4 w-full annotation focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow duration-200 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea'; 
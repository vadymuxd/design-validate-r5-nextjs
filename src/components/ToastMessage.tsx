import React, { useEffect } from 'react';

interface ToastMessageProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <div
        className="px-4 py-3 rounded-lg shadow-lg"
        style={{
          backgroundColor: 'var(--color-black)',
          color: 'var(--color-white)',
          opacity: 0.9,
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--font-size-body)',
          fontWeight: 'var(--font-weight-medium)'
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-white)' }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}; 
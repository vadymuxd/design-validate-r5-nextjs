import React, { useEffect } from 'react';

interface ToastMessageProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  variant?: 'default' | 'warning';
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ message, isVisible, onClose, variant = 'default' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const backgroundColor = variant === 'warning' ? 'var(--color-red)' : 'var(--color-link)';

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm mx-4">
      <div
        style={{
          backgroundColor,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 24px',
          fontFamily: 'var(--font-family)',
          fontWeight: 500,
          fontSize: 'var(--font-size-body)',
          color: 'var(--color-white)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <span style={{ lineHeight: '1.4', textAlign: 'center', whiteSpace: 'pre' }}>{message}</span>
          <button
            onClick={onClose}
          style={{ marginLeft: 24, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label="Close"
          >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="white" />
          </svg>
          </button>
      </div>
    </div>
  );
}; 
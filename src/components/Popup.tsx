import React from 'react';
import { Button } from './Button';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'add' | 'remove';
}

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, onConfirm, action }) => {
  if (!isOpen) return null;

  const isAddAction = action === 'add';
  const headline = isAddAction ? 'Add metric' : 'Remove metric';
  const bodyText = isAddAction 
    ? 'Do you want to add more metrics to the current library?'
    : 'Do you want to remove metrics from the current library?';
  const confirmButtonText = isAddAction ? 'Yes, add metric' : 'Yes, remove metric';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] z-[100]" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Headline */}
          <h3 className="h3 text-black mb-4">{headline}</h3>
          
          {/* Body text */}
          <p className="body text-black mb-8">
            {bodyText}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="ghost-black"
              onClick={onClose}
              style={{ width: '100%', padding: '12px 24px' }}
            >
              No, cancel
            </Button>
            <Button
              variant="filled-black"
              onClick={onConfirm}
              style={{ width: '100%', padding: '12px 24px' }}
            >
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

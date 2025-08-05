import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Textarea } from './Textarea';
import Image from 'next/image';

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cardType?: 'viewer' | 'contributor' | 'partner';
}

type FormState = 'idle' | 'loading' | 'sent' | 'error';

export const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ isOpen, onClose, cardType }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Focus message textarea when entering error state  
  useEffect(() => {
    if (errorMessage && messageRef.current) {
      messageRef.current.focus();
    }
  }, [errorMessage]);

  // Reset form state when popup opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setMessage('');
      setFormState('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamic content based on card type
  const getContent = () => {
    switch (cardType) {
      case 'viewer':
        return {
          headline: "Hello there!",
          bodyText: "Curious about design validation? Let us know what you'd like to see on the platform. Your ideas on topics, tools, or methods will help us grow."
        };
      case 'contributor':
        return {
          headline: "Hello there!",
          bodyText: "Ready to share your knowledge? Tell us what you'd like to contribute—be it tools, methods, or case studies. Let's build this together."
        };
      case 'partner':
        return {
          headline: "Hello there!",
          bodyText: "Have big ideas for this platform? We'd love to hear your vision for growth and partnership. Let's build something great."
        };
      default:
        return {
          headline: "Hello there!",
          bodyText: "Got something on your mind? We'd love to hear it. Share your thoughts and email so we can connect."
        };
    }
  };

  const content = getContent();

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorMessage('Please enter a message');
      messageRef.current?.focus();
      return;
    }

    setFormState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || null,
          feedback_source: 'community',
          component: cardType || 'unknown'
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setFormState('sent');
        setEmail('');
        setMessage('');
      } else if (response.status === 202) {
        // Message stored but email failed - show server error state
        setFormState('error');
        setErrorMessage('');
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch {
      setFormState('error');
      setErrorMessage('Failed to send message. Please try again.');
    }
  };

  const handleTryAgain = () => {
    // Immediately resend the request
    handleSubmit();
  };

  const handleReset = () => {
    setFormState('idle');
    setErrorMessage('');
    setEmail('');
    setMessage('');
  };

  // Determine heading and description based on state
  let displayHeading = content.headline;
  let displayDescription = content.bodyText;
  
  if (formState === 'sent') {
    displayHeading = "It's sent";
    displayDescription = "Thanks for getting in touch! We'll review your feedback and get back to you if needed.";
  } else if (formState === 'error') {
    displayHeading = "We couldn't send it";
    displayDescription = "Sorry, something happened on the server side. Please try again in a few minutes.";
  }

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
          {/* Success Icon */}
          {formState === 'sent' && (
            <div className="flex justify-center mb-4">
              <Image 
                src="/icons/sms-tracking.svg" 
                alt="" 
                width={48} 
                height={48} 
              />
            </div>
          )}
          
          {/* A. Headline */}
          <h1 className={`h1 text-black mb-6 ${formState === 'sent' ? 'text-center' : ''}`}>{displayHeading}</h1>
          
          {/* B. Body text */}
          <p className={`body mb-6 ${formState === 'error' ? 'text-[var(--color-red)]' : 'text-black'}`}>
            {displayDescription}
          </p>
          
          {formState === 'sent' ? (
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 label-default hover:cursor-pointer"
                style={{ color: 'var(--color-link)' }}
              >
                <span>Send another message</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* C. Email input */}
              <div>
                <Textarea
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  rows={1}
                  className="resize-none"
                  disabled={formState === 'loading'}
                />
              </div>

              {/* D. Message textarea */}
              <div>
                <Textarea
                  ref={messageRef}
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  style={{ height: '200px' }}
                  className={`resize-none ${errorMessage ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={formState === 'loading'}
                />
              </div>

              {/* Error message */}
              {errorMessage && formState !== 'error' && (
                <p className="text-red-500 text-sm text-center">{errorMessage}</p>
              )}

              {/* E. Send message button */}
              <Button
                variant="filled-black"
                onClick={formState === 'error' ? handleTryAgain : handleSubmit}
                disabled={formState === 'loading' || !message.trim()}
                icon={formState === 'loading' ? undefined : "/icons/Send.svg"}
                className="w-full"
              >
                {formState === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : formState === 'error' ? (
                  'Try again'
                ) : (
                  'Send message'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

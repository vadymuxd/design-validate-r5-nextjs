'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import Image from 'next/image';

interface ContactFormProps {
  className?: string;
  heading?: string;
  description?: string;
}

type FormState = 'idle' | 'loading' | 'sent' | 'error';

export function ContactForm({
  className,
  heading = 'Hi, there!',
  description =
    "Share your thoughts, ideas, or feedback with us. We'd love to build a community of like-minded people, so please include your contact details if you want to collaborate or to be contacted back.",
}: ContactFormProps) {
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when entering error state
  useEffect(() => {
    if (formState === 'error' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [formState]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorMessage('Please enter a message');
      textareaRef.current?.focus();
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
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setFormState('sent');
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

  const handleReset = () => {
    setFormState('idle');
    setErrorMessage('');
  };

  const handleTryAgain = () => {
    // Immediately resend the request
    handleSubmit();
  };

  // Determine heading and description based on state
  let displayHeading = heading;
  let displayDescription = description;
  
  if (formState === 'sent') {
    displayHeading = "It's sent!";
    displayDescription = "Thanks for getting in touch!";
  } else if (formState === 'error') {
    displayHeading = "We couldn't send it";
    displayDescription = "Sorry, something happened on the server side. Please try again in a few minutes.";
  }

  return (
    <div id="contact-form" className={`text-center ${className}`}>
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
      <h2 className="h1 text-black mb-4">{displayHeading}</h2>
      <p className={`body mb-8 ${formState === 'error' ? 'text-[var(--color-red)]' : 'text-[var(--color-grey-dark)]'}`}>{displayDescription}</p>
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
        <div className="flex flex-col gap-4 items-center">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message here..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={formState === 'loading'}
          />
          {errorMessage && formState !== 'error' && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}
          <Button
            variant="primary"
            onClick={formState === 'error' ? handleTryAgain : handleSubmit}
            disabled={formState === 'loading'}
            icon={formState === 'loading' ? undefined : "/icons/Send.svg"}
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
  );
} 
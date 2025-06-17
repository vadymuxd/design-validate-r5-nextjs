import React, { useState } from 'react';
import Image from 'next/image';
import { Voter } from './Voter';
import { ProCon } from './ProCon';
import { Link } from './Link';
import { ToastMessage } from './ToastMessage';

interface ToolCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  upvotes: number;
  downvotes: number;
  pros?: string[];
  cons?: string[];
  onVoteUpdate?: (showSuccessToast: () => void) => void;
}

export function ToolCard({ 
  name, 
  description, 
  logo, 
  url, 
  upvotes, 
  downvotes,
  pros = [],
  cons = [],
  onVoteUpdate
}: ToolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleTitleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVisitSite = () => {
    window.open(url, '_blank');
  };

  const handleRecommend = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sentiment: 'LIKE',
          category: 'tools',
          component: name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      // Call refresh with success callback that has the message baked in
      onVoteUpdate?.(() => showSuccessToast("Thank you for your recommendation!"));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setToastMessage("Failed to submit feedback. Please try again.");
      setShowToast(true);
    }
  };

  const handleDontRecommend = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sentiment: 'DISLIKE',
          category: 'tools',
          component: name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      // Call refresh with success callback that has the message baked in
      onVoteUpdate?.(() => showSuccessToast("Thank you for your feedback!"));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setToastMessage("Failed to submit feedback. Please try again.");
      setShowToast(true);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
    setToastMessage("");
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8">
        {/* Desktop Layout */}
        <div className="hidden sm:flex flex-row gap-6 items-start">
          {/* Logo */}
          <div className="relative w-20 h-20 shrink-0">
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              sizes="80px"
              className="rounded-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-grow">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTitleClick}
                      className="text-2xl font-bold text-[#000000] hover:cursor-pointer flex items-center gap-2"
                    >
                      {name}
                      <div className="relative w-5 h-5">
                        <Image
                          src={isExpanded ? '/icons/Chevron=Up.svg' : '/icons/Chevron=Down.svg'}
                          alt={isExpanded ? 'Collapse' : 'Expand'}
                          fill
                          sizes="20px"
                        />
                      </div>
                    </button>
                  </div>
                  <p className="text-base font-medium text-[#000000]">{description}</p>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <>
                  {/* Pro & Con Section */}
                  {(pros.length > 0 || cons.length > 0) && (
                    <div className="flex flex-row gap-4">
                      {pros.length > 0 && (
                        <div className="flex-1">
                          <ProCon
                            variant="pro"
                            title="Pro"
                            items={pros}
                          />
                        </div>
                      )}
                      {cons.length > 0 && (
                        <div className="flex-1">
                          <ProCon
                            variant="con"
                            title="Con"
                            items={cons}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-row gap-6">
                    <Link variant="recommend" onClick={handleRecommend} />
                    <Link variant="dont-recommend" onClick={handleDontRecommend} />
                    <Link variant="visit-site" onClick={handleVisitSite} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Votes - Desktop */}
          <div className="flex flex-col gap-2 w-[67px]">
            <Voter
              direction="up"
              count={upvotes}
              toolName={name}
              onVoteUpdate={onVoteUpdate}
              background={isExpanded ? 'white' : 'grey'}
            />
            <Voter
              direction="down"
              count={downvotes}
              toolName={name}
              onVoteUpdate={onVoteUpdate}
              background={isExpanded ? 'white' : 'grey'}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex sm:hidden flex-col gap-6">
          {/* Logo */}
          <div className="relative w-20 h-20 shrink-0">
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              sizes="80px"
              className="rounded-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTitleClick}
                    className="text-2xl font-bold text-[#000000] hover:cursor-pointer flex items-center gap-2"
                  >
                    {name}
                    <div className="relative w-5 h-5">
                      <Image
                        src={isExpanded ? '/icons/Chevron=Up.svg' : '/icons/Chevron=Down.svg'}
                        alt={isExpanded ? 'Collapse' : 'Expand'}
                        fill
                        sizes="20px"
                      />
                    </div>
                  </button>
                </div>
                <p className="text-base font-medium text-[#000000]">{description}</p>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <>
                {/* Pro & Con Section */}
                {(pros.length > 0 || cons.length > 0) && (
                  <div className="flex flex-col gap-2">
                    {pros.length > 0 && (
                      <ProCon
                        variant="pro"
                        title="Pro"
                        items={pros}
                      />
                    )}
                    {cons.length > 0 && (
                      <ProCon
                        variant="con"
                        title="Con"
                        items={cons}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Votes - Mobile */}
          <div className="flex flex-row gap-2">
            <div className="flex-1">
              <Voter
                direction="up"
                count={upvotes}
                toolName={name}
                onVoteUpdate={onVoteUpdate}
                background={isExpanded ? 'white' : 'grey'}
              />
            </div>
            <div className="flex-1">
              <Voter
                direction="down"
                count={downvotes}
                toolName={name}
                onVoteUpdate={onVoteUpdate}
                background={isExpanded ? 'white' : 'grey'}
              />
            </div>
          </div>

          {/* Mobile Actions - Only show when expanded */}
          {isExpanded && (
            <>
              {/* Separator line */}
              <div className="h-px bg-[#F2F2F7] w-full"></div>
              
              {/* Actions */}
              <div className="flex flex-col gap-6">
                <Link variant="recommend" onClick={handleRecommend} />
                <Link variant="dont-recommend" onClick={handleDontRecommend} />
                <Link variant="visit-site" onClick={handleVisitSite} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast Message */}
      <ToastMessage
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </>
  );
} 
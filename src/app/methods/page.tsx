'use client';

import { Feedback } from '@/components/Feedback';
import { TitleNavigation } from '@/components/TitleNavigation';
import { MethodCard } from '@/components/MethodCard';
import { Pill } from '@/components/Pill';
import { ApiMethod } from '@/data/types';
import { METHOD_VIEWS, groupMethodsByView } from '@/data/methodViews';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ToastMessage } from '@/components/ToastMessage';
import LottieAnimation from '@/components/LottieAnimation';
import animationData from '../../../public/gifs/cube-2.json';
import { Footer } from '@/components/Footer';
import { Suspense } from 'react';

interface VoteResult {
  status: string;
  message: string;
  method_id: number;
  sentiment: string;
}

function MethodsPageContent() {
  const searchParams = useSearchParams();
  const [methods, setMethods] = useState<ApiMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'default' | 'warning'>('default');
  const [expandedMethodSlug, setExpandedMethodSlug] = useState<string | null>(null);

  // Fetch methods from the API
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await fetch('/api/methods');
        if (response.ok) {
          const data = await response.json();
          setMethods(data.methods || []);
        } else {
          console.error('Failed to fetch methods');
        }
      } catch (error) {
        console.error('Error fetching methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMethods();
  }, []);

  // Handle scroll and expand after methods are loaded
  useEffect(() => {
    if (!isLoading && methods.length > 0) {
      const expandedParam = searchParams.get('expanded');
      if (expandedParam && expandedParam !== expandedMethodSlug) {
        setExpandedMethodSlug(expandedParam);
        
        // Scroll to the element after a short delay to ensure DOM is updated
        setTimeout(() => {
          const element = document.getElementById(expandedParam);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      }
    }
  }, [isLoading, methods, searchParams, expandedMethodSlug]);

  // Set active view based on URL parameter
  useEffect(() => {
    const urlView = searchParams.get('view');
    if (urlView && METHOD_VIEWS[urlView]) {
      setActiveView(urlView);
    } else {
      setActiveView('all');
    }
  }, [searchParams]);

  // Handle voting on methods (UNIFIED with tool voting logic)
  const handleMethodVote = async (methodId: number, sentiment: 'UPVOTE' | 'DOWNVOTE'): Promise<VoteResult> => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: 'method',
          entity_id: methodId.toString(),
          sentiment: sentiment
        }),
      });

      const result = await response.json();

      if (response.ok) { // Status 200-299
        // Update the local state to reflect the vote change
        if (result.status === 'VOTE_CREATED' || result.status === 'VOTE_UPDATED') {
          setMethods(currentMethods => 
            currentMethods.map(method => {
              if (method.id === methodId) {
                // Calculate net score change based on vote action
                let netScoreChange = 0;
                if (result.status === 'VOTE_CREATED') {
                  netScoreChange = sentiment === 'UPVOTE' ? 1 : -1;
                } else if (result.status === 'VOTE_UPDATED') {
                  netScoreChange = sentiment === 'UPVOTE' ? 2 : -2; // Switching from one to the other
                }

                return {
                  ...method,
                  net_score: method.net_score + netScoreChange
                };
              }
              return method;
            })
          );
        }

        // Show success toast (SAME as tools)
        setToastMessage(result.message || 'Thanks for your feedback!');
        setToastVariant('default');
        setShowToast(true);

        return {
          status: result.status,
          message: result.message,
          method_id: methodId,
          sentiment: sentiment
        };
      } else if (response.status === 409) { // Conflict - already voted (SAME as tools)
        // Show warning toast (SAME as tools)
        setToastMessage(result.message || 'You have already voted for this!');
        setToastVariant('warning');
        setShowToast(true);

        return {
          status: 'VOTE_UNCHANGED',
          message: result.message,
          method_id: methodId,
          sentiment: sentiment
        };
      } else {
        // Other errors (SAME as tools)
        setToastMessage(result.message || 'An error occurred.');
        setToastVariant('warning');
        setShowToast(true);

        return {
          status: 'ERROR',
          message: result.message,
          method_id: methodId,
          sentiment: sentiment
        };
      }
    } catch (error) {
      console.error('Error voting on method:', error);
      const errorResult: VoteResult = {
        status: 'ERROR',
        message: 'An unexpected error occurred.',
        method_id: methodId,
        sentiment: sentiment
      };
      
      setToastMessage(errorResult.message);
      setToastVariant('warning');
      setShowToast(true);
      
      return errorResult;
    }
  };

  const handleViewClick = (viewId: string) => {
    if (viewId !== activeView) {
      setActiveView(viewId);
      // Update URL without page reload
      const newUrl = viewId === 'all' ? '/methods' : `/methods?view=${viewId}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  // Get current view configuration
  const currentView = METHOD_VIEWS[activeView];
  
  // Group methods for current view
  const groupedMethods = groupMethodsByView(methods, activeView);

  // Render single column layout
  const renderSingleColumn = (methodsToRender: ApiMethod[]) => (
    <div className="w-full max-w-[400px] mx-auto pt-12">
      <div className="flex flex-col">
        {methodsToRender.map((method) => (
          <MethodCard 
            key={method.id} 
            methodId={method.id}
            name={method.name}
            slug={method.slug}
            description={method.description || ''}
            voteCount={method.net_score}
            onVote={handleMethodVote}
            forceExpanded={expandedMethodSlug === method.slug}
          />
        ))}
      </div>
    </div>
  );

  // Render multi-column layout
  const renderMultiColumn = () => {
    if (!currentView.columns) return null;

    return (
      <div className="w-full px-4 sm:px-8 pt-12">
        <div className="flex flex-col md:flex-row gap-16 justify-center">
          {currentView.columns.map((column, index) => {
            const columnKey = column.name.toLowerCase();
            const columnMethods = groupedMethods[columnKey] || [];
            const isLastColumn = index === currentView.columns!.length - 1;
            
                          return (
                <div key={column.name} className="flex flex-col w-full max-w-[400px] relative">
                  <div className="mb-6">
                    <h3 className="h3 text-white mb-2">{column.name}</h3>
                    <p className="annotation text-[var(--color-grey-light)]">{column.description}</p>
                  </div>
                  <div className="flex flex-col">
                    {columnMethods.map((method) => (
                      <MethodCard 
                        key={method.id} 
                        methodId={method.id}
                        name={method.name}
                        slug={method.slug}
                        description={method.description || ''}
                        voteCount={method.net_score}
                        onVote={handleMethodVote}
                        hideDivider={currentView.isMultiColumn}
                        forceExpanded={expandedMethodSlug === method.slug}
                      />
                    ))}
                  </div>
                  {/* Full-width divider for mobile only */}
                  {!isLastColumn && (
                    <div className="md:hidden mt-8 mb-8 relative">
                      <div className="absolute w-screen h-px bg-[var(--color-grey-darkest)] left-1/2 -translate-x-1/2"></div>
                    </div>
                  )}
                </div>
              );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top Section with gradient */}
      <div className="w-full gradient-black-to-grey pb-12 px-4 sm:px-8">
        <div className="w-full max-w-[730px] mx-auto flex flex-col items-center gap-8 pt-0">
          <TitleNavigation />
          
          {/* View Pills */}
          <div className="w-full max-w-[730px] flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap justify-center">
              {Object.values(METHOD_VIEWS).map((view) => (
                <Pill
                  key={view.id}
                  label={view.name}
                  isActive={view.id === activeView}
                  onClick={() => handleViewClick(view.id)}
                />
              ))}
            </div>
          </div>

          {/* Dynamic Description */}
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="body text-white max-w-[520px]">
              {currentView.description}
            </p>
          </div>
          
          <Feedback collectionSlug="methods" contextSlug={activeView} />
        </div>
      </div>

      {/* Methods Section with preloader */}
      <div className="bg-black px-4 sm:px-8 pb-16">
        <div className={`w-full ${currentView.isMultiColumn ? '' : 'max-w-[730px] mx-auto'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LottieAnimation
                animationData={animationData}
                className="w-full h-auto max-w-[200px]"
              />
            </div>
          ) : methods.length > 0 ? (
            currentView.isMultiColumn ? renderMultiColumn() : renderSingleColumn(methods)
          ) : (
            <div className="flex justify-center items-center py-16">
              <div className="text-white">No methods found</div>
            </div>
          )}
        </div>
      </div>
      
      {!isLoading && (
        <Footer />
      )}
      
      <ToastMessage
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        variant={toastVariant}
      />
    </>
  );
}

export default function MethodsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <LottieAnimation
          animationData={animationData}
          className="w-full h-auto max-w-[200px]"
        />
      </div>
    }>
      <MethodsPageContent />
    </Suspense>
  );
} 
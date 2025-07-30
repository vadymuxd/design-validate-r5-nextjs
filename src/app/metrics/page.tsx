'use client';

import React from 'react';
import Image from 'next/image';
import { TitleNavigation } from '@/components/TitleNavigation';
import { MetricCard } from '@/components/MetricCard';
import { MetricLetterCard } from '@/components/MetricLetterCard';
import { Pill } from '@/components/Pill';
import { Footer } from '@/components/Footer';
import { Link } from '@/components/Link';
import { ApiMetric } from '@/data/types';
import { METRIC_VIEWS, groupMetricsByView } from '@/data/metricViews';
import { useState, useEffect, useRef } from 'react';
import LottieAnimation from '@/components/LottieAnimation';
import animationData from '../../../public/gifs/cube-2.json';

export default function MeasuresPage() {
  // Track which card is flipped (by id)
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  
  // Mobile: Cycle subcategory left/right
  const [metrics, setMetrics] = useState<ApiMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');
  const [showSummaryView, setShowSummaryView] = useState<boolean>(false);
  const [viewsVisited, setViewsVisited] = useState<Set<string>>(new Set(['all'])); // Track which views have been visited
  const [lastActiveSubCategories, setLastActiveSubCategories] = useState<Record<string, string>>({}); // Remember last active subcategory per view

  // Click outside to reset flipped card
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!cardsContainerRef.current) return;
      if (!cardsContainerRef.current.contains(e.target as Node)) {
        setFlippedCardId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Get current view configuration
  const currentView = METRIC_VIEWS[activeView] || METRIC_VIEWS['all'];
  
  // Get grouped metrics for current view
  const groupedMetrics = groupMetricsByView(metrics, activeView);
  
  // Get available subcategories for current view
  const subCategories = currentView.isMultiColumn && currentView.columns 
    ? currentView.columns.map(col => col.name)
    : [];
  
  // Get filtered metrics for current view and subcategory
  const getFilteredMetrics = () => {
    if (!currentView.isMultiColumn) {
      return metrics; // Show all metrics for 'All' view
    }
    
    if (!activeSubCategory || showSummaryView) {
      // If no subcategory selected or in summary view, return empty array
      return [];
    }
    
    const subCategoryKey = activeSubCategory.toLowerCase();
    return groupedMetrics[subCategoryKey] || [];
  };

  // Get metrics count for a specific subcategory (used in summary view)
  const getSubCategoryMetricsCount = (subCategoryName: string) => {
    const subCategoryKey = subCategoryName.toLowerCase();
    return groupedMetrics[subCategoryKey]?.length || 0;
  };

  // Get dynamic description based on view and subcategory
  const getDynamicDescription = () => {
    const filteredMetrics = getFilteredMetrics();
    const count = filteredMetrics.length;

    if (!currentView.isMultiColumn || showSummaryView) {
      // For summary view or "All" view, use the regular description (now explains grouping)
      if (showSummaryView) {
        return currentView.description;
      }
      return currentView.description.replace(/\d+/, count.toString());
    }

    if (!activeSubCategory) {
      return currentView.description.replace(/\d+/, count.toString());
    }

    const subCategory = currentView.columns?.find(col => col.name === activeSubCategory);
    if (!subCategory) {
      return currentView.description.replace(/\d+/, count.toString());
    }

    // Replace the hardcoded number in dynamicDescription with actual count
    return subCategory.dynamicDescription.replace(/\d+/, count.toString());
  };

  // Initialize activeSubCategory when view changes
  useEffect(() => {
    if (currentView.isMultiColumn && currentView.columns && currentView.columns.length > 0) {
      // Check if this view has been visited before
      if (!viewsVisited.has(activeView)) {
        // First time visiting this view - show summary
        setShowSummaryView(true);
        setActiveSubCategory(''); // No active subcategory in summary view
        console.log(`First time visiting ${activeView} - showing summary view`);
      } else {
        // View has been visited - restore last active subcategory or use first one
        const lastSubCategory = lastActiveSubCategories[activeView];
        const targetSubCategory = lastSubCategory || currentView.columns[0].name;
        setActiveSubCategory(targetSubCategory);
        setShowSummaryView(false);
        console.log(`Returning to ${activeView} - restoring subcategory: ${targetSubCategory}`);
      }
    } else {
      setActiveSubCategory('');
      setShowSummaryView(false);
    }
  }, [activeView, currentView, viewsVisited, lastActiveSubCategories]);

  // Handle view change - update visited views and browser history
  const handleViewClick = (viewId: string) => {
    if (viewId !== activeView) {
      setActiveView(viewId);
      
      // DON'T mark view as visited immediately - let the useEffect handle it
      // This ensures we show summary view first time visiting
      
      const newUrl = viewId === 'all' ? '/metrics' : `/metrics?view=${viewId}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  // Handle subcategory click - exit summary view and set active subcategory
  const handleSubCategoryClick = (subCategoryName: string) => {
    setActiveSubCategory(subCategoryName);
    setShowSummaryView(false);
    
    // Mark view as visited when user drills down to a subcategory
    setViewsVisited(prev => new Set([...prev, activeView]));
    
    // Remember this as the last active subcategory for this view
    setLastActiveSubCategories(prev => ({
      ...prev,
      [activeView]: subCategoryName
    }));
    
    console.log(`Drilling down to ${subCategoryName} in ${activeView} - marking view as visited`);
  };

  // Function to group metrics alphabetically
  const groupMetricsByLetter = (metrics: ApiMetric[]) => {
    const grouped: { [key: string]: ApiMetric[] } = {};
    
    metrics.forEach(metric => {
      const firstLetter = metric.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(metric);
    });

    // Sort letters and metrics within each letter group
    const sortedGroups: { letter: string; metrics: ApiMetric[] }[] = [];
    Object.keys(grouped)
      .sort()
      .forEach(letter => {
        sortedGroups.push({
          letter,
          metrics: grouped[letter].sort((a, b) => a.name.localeCompare(b.name))
        });
      });

    return sortedGroups;
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        
        if (data.success) {
          setMetrics(data.data);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Mobile: Cycle subcategory left/right
  const handleSubCategoryChange = (direction: 'prev' | 'next') => {
    if (!currentView.isMultiColumn || !currentView.columns || showSummaryView) return;
    const idx = currentView.columns.findIndex(col => col.name === activeSubCategory);
    if (idx === -1) return;
    let newIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (newIdx < 0) newIdx = currentView.columns.length - 1;
    if (newIdx >= currentView.columns.length) newIdx = 0;
    
    const newSubCategory = currentView.columns[newIdx].name;
    setActiveSubCategory(newSubCategory);
    
    // Update the last active subcategory for this view
    setLastActiveSubCategories(prev => ({
      ...prev,
      [activeView]: newSubCategory
    }));
  };

  return (
    <div className="bg-black text-white">
      {/* Top Section with gradient */}
      <div className="w-full gradient-black-to-grey pb-12 px-4 sm:px-8">
        <div className="w-full max-w-[730px] mx-auto flex flex-col items-center gap-8 pt-0">
          <TitleNavigation />
          
          {/* View Pills */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {Object.values(METRIC_VIEWS).map((view) => (
                <Pill
                  key={view.id}
                  label={view.name}
                  isActive={activeView === view.id}
                  onClick={() => handleViewClick(view.id)}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="body text-white">
              {getDynamicDescription()}
            </p>
          </div>
          
          {/* ...existing code... */}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-black pb-16 px-2 sm:px-9">
        <div className="w-full">
          {/* SubNavigation - only show for multi-column views */}
          {currentView.isMultiColumn && subCategories.length > 0 && (
            <>
              {/* Enhanced Navigation - replaces old SubNavigation */}
              <div className="flex justify-center pt-12 pb-8">
                {/* Mobile version */}
                <div className="flex flex-wrap justify-center gap-6 sm:hidden">
                  {subCategories.map((subCategory) => {
                    const count = getSubCategoryMetricsCount(subCategory);
                    const isActive = !showSummaryView && activeSubCategory === subCategory;
                    
                    if (showSummaryView) {
                      // Special layout for mobile summary view - single column with inline numbers
                      return (
                        <div key={subCategory} className="w-full">
                          <button
                            onClick={() => handleSubCategoryClick(subCategory)}
                            className="w-full text-center cursor-pointer hover:opacity-80 transition-opacity duration-200 flex items-center justify-center gap-2"
                          >
                            <span className="h3 text-white">{subCategory}</span>
                            <span className="annotation text-[var(--color-red)]">{count}</span>
                          </button>
                        </div>
                      );
                    }
                    
                    // Regular mobile navigation when subcategory is active
                    return (
                      <button
                        key={subCategory}
                        onClick={() => handleSubCategoryClick(subCategory)}
                        className={`
                          annotation
                          transition-colors duration-200
                          cursor-pointer
                          hover:text-[var(--color-red)]
                          ${isActive ? 'text-[var(--color-red)]' : 'text-[var(--color-grey-dark)]'}
                        `}
                      >
                        {subCategory}
                      </button>
                    );
                  })}
                </div>
                
                {/* Desktop version */}
                <div className="hidden sm:flex justify-center gap-9">
                  {subCategories.map((subCategory) => {
                    const count = getSubCategoryMetricsCount(subCategory);
                    const isActive = !showSummaryView && activeSubCategory === subCategory;
                    return (
                      <button
                        key={subCategory}
                        onClick={() => handleSubCategoryClick(subCategory)}
                        className={`
                          h3
                          transition-colors duration-200
                          cursor-pointer
                          hover:text-white
                          flex flex-col items-center gap-2
                          ${isActive ? 'text-white' : 'text-[var(--color-grey-dark)]'}
                        `}
                      >
                        <span>{subCategory}</span>
                        {showSummaryView && (
                          <span className="text-red-500 text-sm font-medium">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Mobile: Show subcategory name below SubNavigation - only when NOT in summary view */}
              {activeSubCategory && !showSummaryView && (
                <div className="sm:hidden flex items-center justify-center pb-4 mb-8 gap-4">
                  {/* Left chevron */}
                  <button
                    type="button"
                    aria-label="Previous subcategory"
                    onClick={() => handleSubCategoryChange('prev')}
                    className="p-2"
                  >
                    <Image
                      src="/icons/Chevron=Down.svg"
                      alt="Previous"
                      width={24}
                      height={24}
                      className="w-6 h-6 text-white rotate-90"
                      style={{ filter: 'invert(1)' }}
                    />
                  </button>
                  <h3 className="h3 text-white text-center mb-0">{activeSubCategory}</h3>
                  {/* Right chevron */}
                  <button
                    type="button"
                    aria-label="Next subcategory"
                    onClick={() => handleSubCategoryChange('next')}
                    className="p-2"
                  >
                    <Image
                      src="/icons/Chevron=Down.svg"
                      alt="Next"
                      width={24}
                      height={24}
                      className="w-6 h-6 text-white -rotate-90"
                      style={{ filter: 'invert(1)' }}
                    />
                  </button>
                </div>
              )}
            </>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LottieAnimation
                animationData={animationData}
                className="w-full h-auto max-w-[200px]"
              />
            </div>
          ) : getFilteredMetrics().length > 0 ? (
            <div
              ref={cardsContainerRef}
              className={`flex flex-wrap justify-center gap-2 ${currentView.isMultiColumn && !showSummaryView ? 'pt-0' : 'pt-12'}`}
            >
              {groupMetricsByLetter(getFilteredMetrics()).map(({ letter, metrics: letterMetrics }) => (
                <React.Fragment key={letter}>
                  {/* Letter Card - only render if more than 20 total metrics */}
                  {getFilteredMetrics().length > 20 && (
                    <MetricLetterCard letter={letter} />
                  )}
                  {/* Metrics for this letter */}
                  {letterMetrics.map((metric) => (
                    <MetricCard
                      key={metric.id}
                      name={metric.name}
                      type={metric.type}
                      description={metric.description}
                      isFlipped={flippedCardId === String(metric.id)}
                      onFlip={() => setFlippedCardId(flippedCardId === String(metric.id) ? null : String(metric.id))}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-12">
              <p className="body text-white text-center">
                {showSummaryView 
                  ? '' // Don't show any message in summary view, let the summary content handle it
                  : currentView.isMultiColumn && !activeSubCategory 
                    ? 'Select a subcategory to view metrics.' 
                    : 'No metrics available for this selection.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback button below metrics */}
      <div className="flex justify-center mt-8 mb-2 pb-20">
        <Link 
          variant="feedback"
          onClick={() => {
            if (window.location.pathname === '/about') {
              const el = document.getElementById('contact-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.href = '/about#contact-form';
            }
          }}
        />
      </div>

      <Footer />

      {/* ...existing code... */}
    </div>
  );
}
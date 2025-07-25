'use client';

import React from 'react';
import Image from 'next/image';
import { TitleNavigation } from '@/components/TitleNavigation';
import { MetricCard } from '@/components/MetricCard';
import { MetricLetterCard } from '@/components/MetricLetterCard';
import { SubNavigation } from '@/components/SubNavigation';
import { Pill } from '@/components/Pill';
import { Footer } from '@/components/Footer';
import { Link } from '@/components/Link';
import { Popup } from '@/components/Popup';
import { ApiMetric } from '@/data/types';
import { METRIC_VIEWS, groupMetricsByView } from '@/data/metricViews';
import { useState, useEffect } from 'react';
import LottieAnimation from '@/components/LottieAnimation';
import animationData from '../../../public/gifs/cube-2.json';

export default function MeasuresPage() {
  // Mobile: Cycle subcategory left/right
  const [metrics, setMetrics] = useState<ApiMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState<'add' | 'remove'>('add');

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
    
    if (!activeSubCategory) {
      // If no subcategory selected, return empty array
      return [];
    }
    
    const subCategoryKey = activeSubCategory.toLowerCase();
    return groupedMetrics[subCategoryKey] || [];
  };

  // Get dynamic description based on view and subcategory
  const getDynamicDescription = () => {
    if (!currentView.isMultiColumn || !activeSubCategory) {
      return currentView.description;
    }

    const subCategory = currentView.columns?.find(col => col.name === activeSubCategory);
    if (!subCategory) {
      return currentView.description;
    }

    // Create dynamic descriptions based on view and subcategory combinations
    const viewDescriptions: Record<string, Record<string, string>> = {
      'metric-type': {
        'Time': 'Metrics grouped by the type of data they represent, for example measuring time-based interactions where duration and speed of user actions are tracked.',
        'Ratio': 'Metrics grouped by the type of data they represent, for example measuring percentage-based outcomes that show proportions and success rates.',
        'Count': 'Metrics grouped by the type of data they represent, for example measuring numerical counts of user actions, events, and behaviors.',
        'Scale': 'Metrics grouped by the type of data they represent, for example measuring rating-based evaluations that capture user satisfaction and preferences.',
        'Composite': 'Metrics grouped by the type of data they represent, for example measuring complex calculations that combine multiple data points into comprehensive scores.',
        'Money': 'Metrics grouped by the type of data they represent, for example measuring financial outcomes that demonstrate business value and revenue impact.'
      },
      'user-data': {
        'User Behaviours': 'Metrics grouped by how data is collected, for example measuring from observing and tracking actual user interactions and behaviors in real-time.',
        'User Attitudes': 'Metrics grouped by how data is collected, for example measuring from gathering user opinions, feedback, and subjective experiences through surveys and interviews.',
        'Non-User Evaluation': 'Metrics grouped by how data is collected, for example measuring from expert analysis, automated testing, and system-generated evaluations independent of direct user input.'
      },
      'design-goal': {
        'Discoverability': 'Metrics categorized by design objectives, for example measuring how effectively users can find and discover features, content, and functionality.',
        'Desirability': 'Metrics categorized by design objectives, for example measuring how appealing and emotionally engaging the design is to users.',
        'Usability': 'Metrics categorized by design objectives, for example measuring how easy, efficient, and error-free the user experience is.',
        'Engagement': 'Metrics categorized by design objectives, for example measuring the depth and quality of user interaction and involvement.'
      },
      'business-goal': {
        'Adoption': 'Metrics aligned with business objectives, for example measuring how successfully users begin using the product and adopt new features.',
        'Conversion': 'Metrics aligned with business objectives, for example measuring how effectively users complete desired actions that drive business value.',
        'Satisfaction': 'Metrics aligned with business objectives, for example measuring user happiness, quality perception, and overall product satisfaction.',
        'Retention': 'Metrics aligned with business objectives, for example measuring how successfully the product keeps users engaged over time.',
        'Revenue': 'Metrics aligned with business objectives, for example measuring the direct financial impact and monetary value generated.',
        'Referral': 'Metrics aligned with business objectives, for example measuring user advocacy, recommendations, and word-of-mouth promotion.'
      },
      'user-journey-stage': {
        'Awareness': 'Metrics organized by customer journey phases, for example measuring the effectiveness of initial product discovery and brand recognition.',
        'Onboarding': 'Metrics organized by customer journey phases, for example measuring how successfully new users learn and start using the product.',
        'Usage': 'Metrics organized by customer journey phases, for example measuring ongoing product interaction and value realization during active use.',
        'Retention': 'Metrics organized by customer journey phases, for example measuring user return patterns and long-term engagement sustainability.',
        'Advocacy': 'Metrics organized by customer journey phases, for example measuring how users promote and recommend the product to others.'
      },
      'measurement-timing': {
        'Real-time': 'Metrics grouped by when they are captured, for example measuring data collected immediately as users interact with the product.',
        'Post-task': 'Metrics grouped by when they are captured, for example measuring outcomes evaluated after users complete specific tasks or actions.',
        'Longitudinal': 'Metrics grouped by when they are captured, for example measuring patterns and trends tracked over extended time periods.'
      }
    };

    return viewDescriptions[activeView]?.[activeSubCategory] || currentView.description;
  };

  // Initialize activeSubCategory when view changes
  useEffect(() => {
    if (currentView.isMultiColumn && currentView.columns && currentView.columns.length > 0) {
      setActiveSubCategory(currentView.columns[0].name);
    } else {
      setActiveSubCategory('');
    }
  }, [activeView, currentView]);

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

  const handleViewClick = (viewId: string) => {
    if (viewId !== activeView) {
      setActiveView(viewId);
      const newUrl = viewId === 'all' ? '/metrics' : `/metrics?view=${viewId}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  // Mobile: Cycle subcategory left/right
  const handleSubCategoryChange = (direction: 'prev' | 'next') => {
    if (!currentView.isMultiColumn || !currentView.columns) return;
    const idx = currentView.columns.findIndex(col => col.name === activeSubCategory);
    if (idx === -1) return;
    let newIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (newIdx < 0) newIdx = currentView.columns.length - 1;
    if (newIdx >= currentView.columns.length) newIdx = 0;
    setActiveSubCategory(currentView.columns[newIdx].name);
  };

  const handleMinusClick = () => {
    setPopupAction('remove');
    setIsPopupOpen(true);
  };

  const handlePlusClick = () => {
    setPopupAction('add');
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handlePopupConfirm = () => {
    // Redirect to about/contact form the same as feedback button
    if (window.location.pathname === '/about') {
      const el = document.getElementById('contact-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/about#contact-form';
    }
    setIsPopupOpen(false);
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
          
          {/* Metrics Count */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleMinusClick}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Remove metric"
              >
                <Image 
                  src="/icons/minus.svg" 
                  alt="Minus" 
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
              <h3 className="h3 text-white">
                {getFilteredMetrics().length}
              </h3>
              <button
                onClick={handlePlusClick}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Add metric"
              >
                <Image 
                  src="/icons/plus.svg" 
                  alt="Plus" 
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-black pb-16" style={{ paddingLeft: '36px', paddingRight: '36px' }}>
        <div className="w-full">
          {/* SubNavigation - only show for multi-column views */}
          {currentView.isMultiColumn && subCategories.length > 0 && (
            <>
              <div className="flex justify-center pt-12 pb-8">
                <SubNavigation
                  items={subCategories}
                  activeItem={activeSubCategory}
                  onItemClick={setActiveSubCategory}
                />
              </div>
              {/* Mobile: Show subcategory name below SubNavigation */}
              {activeSubCategory && (
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
            <div className={`flex flex-wrap justify-center gap-2 ${currentView.isMultiColumn ? 'pt-0' : 'pt-12'}`}>
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
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-12">
              <p className="body text-white text-center">
                {currentView.isMultiColumn && !activeSubCategory 
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

      <footer className="bg-black py-12 border-t border-[var(--color-grey-dark)]">
        <Footer />
      </footer>

      {/* Popup */}
      <Popup 
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
        action={popupAction}
      />
    </div>
  );
}
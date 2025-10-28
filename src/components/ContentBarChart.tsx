import React from 'react';

interface ContentAnalyticsData {
  content: string;
  current_score: number;
  percentage: number;
}

interface ContentBarChartProps {
  data: ContentAnalyticsData[];
  isLoading?: boolean;
}

export const ContentBarChart: React.FC<ContentBarChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="flex justify-between items-end h-48 space-x-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="bg-gray-300 rounded w-full" style={{ height: `${20 + Math.random() * 100}px` }}></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <p className="text-white opacity-70">No analytics data available yet.</p>
      </div>
    );
  }

  // Find the maximum score to normalize bar heights
  const maxScore = Math.max(...data.map(item => item.current_score));
  const minBarHeight = 20; // Minimum bar height in pixels
  const maxBarHeight = 120; // Maximum bar height in pixels

  // Define the desired order matching CollectionGrid
  const desiredOrder = ['methods', 'metrics', 'tools', 'frameworks', 'cases'];
  
  // Sort data according to the desired order
  const sortedData = [...data].sort((a, b) => {
    return desiredOrder.indexOf(a.content) - desiredOrder.indexOf(b.content);
  });

  // Calculate heights based on scores
  const getBarHeight = (score: number) => {
    if (maxScore === 0) return minBarHeight;
    const ratio = score / maxScore;
    return minBarHeight + (ratio * (maxBarHeight - minBarHeight));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-end h-48 space-x-4">
        {sortedData.map((item) => {
          const barHeight = getBarHeight(item.current_score);
          const capitalizedContent = item.content.charAt(0).toUpperCase() + item.content.slice(1);
          
          return (
            <div key={item.content} className="flex flex-col items-center space-y-2 flex-1">
              {/* Percentage label above bar */}
              <div className="h-6 flex items-end">
                <span className="text-white text-sm font-semibold">
                  {item.percentage}%
                </span>
              </div>
              
              {/* Bar */}
              <div 
                className="bg-white w-full transition-all duration-500 ease-out"
                style={{ 
                  height: `${barHeight}px`,
                  borderTopLeftRadius: '80px',
                  borderTopRightRadius: '80px',
                  borderBottomLeftRadius: '0',
                  borderBottomRightRadius: '0'
                }}
              />
              
              {/* Content label below bar */}
              <div className="text-center">
                <span className="text-white text-xs opacity-90">
                  {capitalizedContent}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
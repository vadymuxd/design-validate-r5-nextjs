import { ApiMetric } from './types';

export interface MetricViewColumn {
  name: string;
  dynamicDescription: string;
}

export interface MetricView {
  id: string;
  name: string;
  description: string;
  columns?: MetricViewColumn[];
  isMultiColumn: boolean;
}

export const METRIC_VIEWS: Record<string, MetricView> = {
  'all': {
    id: 'all',
    name: 'All',
    description: '61 metrics to measure design performance and impact.',
    isMultiColumn: false
  },
  'metric-type': {
    id: 'metric-type',
    name: 'Metric Type',
    description: 'Metrics organized by their measurement type. Select a type below to explore specific metrics.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Time',
        dynamicDescription: '8 metrics to measure the duration of user actions and system responses.'
      },
      {
        name: 'Ratio',
        dynamicDescription: '20 metrics to measure the proportion between user actions as a rate.'
      },
      {
        name: 'Count',
        dynamicDescription: '11 metrics to measure the total volume of user actions and events.'
      },
      {
        name: 'Scale',
        dynamicDescription: '11 metrics to measure subjective user ratings and perceptions.'
      },
      {
        name: 'Composite',
        dynamicDescription: '10 metrics to measure combined scores for experience and usability.'
      },
      {
        name: 'Money',
        dynamicDescription: '7 metrics to measure financial outcomes from user activity.'
      }
    ]
  },
  'user-data': {
    id: 'user-data',
    name: 'User Data',
    description: 'Metrics organized by how data is collected from users. Select a data source below to explore specific metrics.',
    isMultiColumn: true,
    columns: [
      {
        name: 'User Behaviours',
        dynamicDescription: '39 metrics to measure user actions, what and how they do it.'
      },
      {
        name: 'User Attitudes',
        dynamicDescription: '14 metrics to measure what users feel and say from opinions and feedback.'
      },
      {
        name: 'Non-User Evaluation',
        dynamicDescription: '8 metrics to measure system performance and expert assessments.'
      }
    ]
  },
  'design-goal': {
    id: 'design-goal',
    name: 'Design Objectives',
    description: 'Metrics organized by key design objectives. Select an objective below to explore specific metrics.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Discoverability',
        dynamicDescription: '6 metrics to measure how users find features and information.'
      },
      {
        name: 'Desirability',
        dynamicDescription: '5 metrics to measure the product\'s appeal and user trust.'
      },
      {
        name: 'Usability',
        dynamicDescription: '27 metrics to measure the ease and efficiency of the user experience.'
      },
      {
        name: 'Engagement',
        dynamicDescription: '13 metrics to measure the depth and frequency of user interaction.'
      }
    ]
  },
  'business-goal': {
    id: 'business-goal',
    name: 'Business Outcomes',
    description: 'Metrics organized by business impact areas. Select an outcome below to explore specific metrics.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Adoption',
        dynamicDescription: '10 metrics to measure how users begin using the product and its features.'
      },
      {
        name: 'Conversion',
        dynamicDescription: '8 metrics to measure how users complete key business actions.'
      },
      {
        name: 'Satisfaction',
        dynamicDescription: '19 metrics to measure the quality of the user experience.'
      },
      {
        name: 'Retention',
        dynamicDescription: '11 metrics to measure how users return and remain active over time.'
      },
      {
        name: 'Revenue',
        dynamicDescription: '4 metrics to measure direct financial results.'
      },
      {
        name: 'Referral',
        dynamicDescription: '4 metrics to measure user advocacy and recommendations.'
      }
    ]
  },
  'user-journey-stage': {
    id: 'user-journey-stage',
    name: 'User Journey Stage',
    description: 'Metrics organized by stages of the user journey. Select a stage below to explore specific metrics.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Awareness',
        dynamicDescription: '2 metrics to measure initial user discovery and impression.'
      },
      {
        name: 'Onboarding',
        dynamicDescription: '4 metrics to measure how users get started with the product.'
      },
      {
        name: 'Usage',
        dynamicDescription: '13 metrics to measure ongoing interaction with the product.'
      },
      {
        name: 'Retention',
        dynamicDescription: '10 metrics to measure long-term user engagement and loyalty.'
      },
      {
        name: 'Advocacy',
        dynamicDescription: '1 metric to measure how users recommend the product.'
      }
    ]
  }
};

// Metric metadata interface - structure based on database metadata
export interface MetricMetadata {
  user_data?: string[];
  design_goal?: string[];
  business_goal?: string[];
  user_journey_stage?: string[];
}

// Helper function to group metrics by a specific view using database metadata
export function groupMetricsByView(metrics: ApiMetric[], viewId: string): Record<string, ApiMetric[]> {
  const view = METRIC_VIEWS[viewId];
  
  if (!view || !view.isMultiColumn || !view.columns) {
    return { all: metrics };
  }

  const grouped: Record<string, ApiMetric[]> = {};
  
  // Initialize groups
  view.columns.forEach(column => {
    grouped[column.name.toLowerCase()] = [];
  });

  // Group metrics based on view type using database metadata
  metrics.forEach(metric => {
    const metadata = metric.metadata as MetricMetadata;
    if (!metadata) {
      // Skip metrics without metadata - don't add to any group
      // This prevents incorrect categorization
      return;
    }

    let targetGroups: string[] = [];
    
    switch (viewId) {
      case 'metric-type':
        // For metric-type, use the metric.type field directly
        if (metric.type) {
          targetGroups = [metric.type.toLowerCase()];
        }
        break;
      case 'user-data':
        targetGroups = (metadata.user_data || []).map((s: string) => s.toLowerCase().replace(/\s+/g, ' '));
        break;
      case 'design-goal':
        targetGroups = (metadata.design_goal || []).map((s: string) => s.toLowerCase());
        break;
      case 'business-goal':
        targetGroups = (metadata.business_goal || []).map((s: string) => s.toLowerCase());
        break;
      case 'user-journey-stage':
        targetGroups = (metadata.user_journey_stage || []).map((s: string) => s.toLowerCase());
        break;
      // ...existing code...
      default:
        targetGroups = ['all'];
    }

    // Add metric to appropriate groups
    if (targetGroups.length === 0) {
      // Skip metrics without proper metadata - don't add to any group
      // This prevents metrics from being incorrectly categorized
      return;
    } else {
      targetGroups.forEach(groupKey => {
        if (grouped[groupKey]) {
          grouped[groupKey].push(metric);
        } else {
          // Try to find a matching group with case-insensitive comparison
          const matchingKey = Object.keys(grouped).find(key => 
            key.toLowerCase() === groupKey.toLowerCase()
          );
          if (matchingKey) {
            grouped[matchingKey].push(metric);
          }
          // Remove fallback to first group - if no match found, skip the metric
          // This prevents incorrect categorization
        }
      });
    }
  });

  return grouped;
}

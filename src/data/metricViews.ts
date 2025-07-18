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
    description: 'All metrics and KPIs to measure design success and impact.',
    isMultiColumn: false
  },
  'data-type': {
    id: 'data-type',
    name: 'Data Type',
    description: 'Metrics organized by data type: Time, Ratio, Count, Scale, Composite, and Money measurements.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Time',
        dynamicDescription: 'Metrics grouped by the type of data they represent, for example measuring time-based interactions where duration and speed of user actions are tracked.'
      },
      {
        name: 'Ratio',
        dynamicDescription: 'Metrics grouped by the type of data they represent, for example measuring percentage-based outcomes that show proportions and success rates.'
      },
      {
        name: 'Count',
        dynamicDescription: 'Metrics grouped by the type of data they represent, for example measuring numerical counts of user actions, events, and behaviors.'
      },
      {
        name: 'Scale',
        dynamicDescription: 'Metrics grouped by the type of data they represent, for example measuring rating-based evaluations that capture user satisfaction and preferences.'
      },
      {
        name: 'Composite',
        dynamicDescription: 'Metrics grouped by the type of data they represent, for example measuring complex calculations that combine multiple data points into comprehensive scores.'
      },
      {
        name: 'Money',
        dynamicDescription: 'Metrics grouped by the type of data they represent, for example measuring financial outcomes that demonstrate business value and revenue impact.'
      }
    ]
  },
  'data-source': {
    id: 'data-source',
    name: 'Data Source',
    description: 'Metrics grouped by how data is collected: user behaviors, user attitudes, and non-user evaluation.',
    isMultiColumn: true,
    columns: [
      {
        name: 'User Behaviours',
        dynamicDescription: 'Metrics grouped by how data is collected, for example measuring from observing and tracking actual user interactions and behaviors in real-time.'
      },
      {
        name: 'User Attitudes',
        dynamicDescription: 'Metrics grouped by how data is collected, for example measuring from gathering user opinions, feedback, and subjective experiences through surveys and interviews.'
      },
      {
        name: 'Non-User Evaluation',
        dynamicDescription: 'Metrics grouped by how data is collected, for example measuring from expert analysis, automated testing, and system-generated evaluations independent of direct user input.'
      }
    ]
  },
  'design-goal': {
    id: 'design-goal',
    name: 'Design Objectives',
    description: 'Metrics categorized by design objectives: discoverability, desirability, usability, and engagement.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Discoverability',
        dynamicDescription: 'Metrics categorized by design objectives, for example measuring how effectively users can find and discover features, content, and functionality.'
      },
      {
        name: 'Desirability',
        dynamicDescription: 'Metrics categorized by design objectives, for example measuring how appealing and emotionally engaging the design is to users.'
      },
      {
        name: 'Usability',
        dynamicDescription: 'Metrics categorized by design objectives, for example measuring how easy, efficient, and error-free the user experience is.'
      },
      {
        name: 'Engagement',
        dynamicDescription: 'Metrics categorized by design objectives, for example measuring the depth and quality of user interaction and involvement.'
      }
    ]
  },
  'business-goal': {
    id: 'business-goal',
    name: 'Business Outcomes',
    description: 'Metrics aligned with business objectives: adoption, conversion, satisfaction, retention, revenue, and referral.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Adoption',
        dynamicDescription: 'Metrics aligned with business objectives, for example measuring how successfully users begin using the product and adopt new features.'
      },
      {
        name: 'Conversion',
        dynamicDescription: 'Metrics aligned with business objectives, for example measuring how effectively users complete desired actions that drive business value.'
      },
      {
        name: 'Satisfaction',
        dynamicDescription: 'Metrics aligned with business objectives, for example measuring user happiness, quality perception, and overall product satisfaction.'
      },
      {
        name: 'Retention',
        dynamicDescription: 'Metrics aligned with business objectives, for example measuring how successfully the product keeps users engaged over time.'
      },
      {
        name: 'Revenue',
        dynamicDescription: 'Metrics aligned with business objectives, for example measuring the direct financial impact and monetary value generated.'
      },
      {
        name: 'Referral',
        dynamicDescription: 'Metrics aligned with business objectives, for example measuring user advocacy, recommendations, and word-of-mouth promotion.'
      }
    ]
  },
  'user-journey-stage': {
    id: 'user-journey-stage',
    name: 'User Journey Stage',
    description: 'Metrics organized by customer journey phases: awareness, onboarding, usage, retention, and advocacy.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Awareness',
        dynamicDescription: 'Metrics organized by customer journey phases, for example measuring the effectiveness of initial product discovery and brand recognition.'
      },
      {
        name: 'Onboarding',
        dynamicDescription: 'Metrics organized by customer journey phases, for example measuring how successfully new users learn and start using the product.'
      },
      {
        name: 'Usage',
        dynamicDescription: 'Metrics organized by customer journey phases, for example measuring ongoing product interaction and value realization during active use.'
      },
      {
        name: 'Retention',
        dynamicDescription: 'Metrics organized by customer journey phases, for example measuring user return patterns and long-term engagement sustainability.'
      },
      {
        name: 'Advocacy',
        dynamicDescription: 'Metrics organized by customer journey phases, for example measuring how users promote and recommend the product to others.'
      }
    ]
  },
  'measurement-timing': {
    id: 'measurement-timing',
    name: 'Measurement Timing',
    description: 'Metrics grouped by when they are captured: real-time, post-task, or longitudinal.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Real-time',
        dynamicDescription: 'Metrics grouped by when they are captured, for example measuring data collected immediately as users interact with the product.'
      },
      {
        name: 'Post-task',
        dynamicDescription: 'Metrics grouped by when they are captured, for example measuring outcomes evaluated after users complete specific tasks or actions.'
      },
      {
        name: 'Longitudinal',
        dynamicDescription: 'Metrics grouped by when they are captured, for example measuring patterns and trends tracked over extended time periods.'
      }
    ]
  }
};

// Metric metadata interface - structure based on database metadata
export interface MetricMetadata {
  data_source?: string[];
  design_goal?: string[];
  business_goal?: string[];
  user_journey_stage?: string[];
  measurement_timing?: string[];
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
      // If no metadata, put in first group as fallback
      const firstKey = Object.keys(grouped)[0];
      if (firstKey) grouped[firstKey].push(metric);
      return;
    }

    let targetGroups: string[] = [];
    
    switch (viewId) {
      case 'data-type':
        // For data-type, use the metric.type field directly
        if (metric.type) {
          targetGroups = [metric.type.toLowerCase()];
        }
        break;
      case 'data-source':
        targetGroups = (metadata.data_source || []).map(s => s.toLowerCase().replace(/\s+/g, ' '));
        break;
      case 'design-goal':
        targetGroups = (metadata.design_goal || []).map(s => s.toLowerCase());
        break;
      case 'business-goal':
        targetGroups = (metadata.business_goal || []).map(s => s.toLowerCase());
        break;
      case 'user-journey-stage':
        targetGroups = (metadata.user_journey_stage || []).map(s => s.toLowerCase());
        break;
      case 'measurement-timing':
        targetGroups = (metadata.measurement_timing || []).map(s => s.toLowerCase().replace('-', '-'));
        break;
      default:
        targetGroups = ['all'];
    }

    // Add metric to appropriate groups
    if (targetGroups.length === 0) {
      // Fallback to first group if no metadata found
      const firstKey = Object.keys(grouped)[0];
      if (firstKey) grouped[firstKey].push(metric);
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
          } else {
            // Fallback to first group
            const firstKey = Object.keys(grouped)[0];
            if (firstKey) grouped[firstKey].push(metric);
          }
        }
      });
    }
  });

  return grouped;
}

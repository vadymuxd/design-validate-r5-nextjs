import { ApiMethod } from './types';

export interface MethodViewColumn {
  name: string;
  description: string;
}

export interface MethodView {
  id: string;
  name: string;
  description: string;
  columns?: MethodViewColumn[];
  isMultiColumn: boolean;
}

export const METHOD_VIEWS: Record<string, MethodView> = {
  'all': {
    id: 'all',
    name: 'All',
    description: "All methods sorted by net score of 'negative' and 'positive' mentions by users from G2, Capterra, TrustRadius, and Reddit plus unique users' votes on this site. Sentiment analysis done by Gemini 2.5 Pro (2023 - 2025)",
    isMultiColumn: false
  },
  'research-type': {
    id: 'research-type',
    name: 'Research Type',
    description: "Validation methods grouped by research approach: qualitative methods for deep insights, quantitative methods for statistical evidence, and mixed methods that combine both approaches for comprehensive validation.",
    isMultiColumn: true,
    columns: [
      {
        name: 'Qualitative',
        description: 'Explores the "why" and "how" of a topic by analyzing non-numerical information to understand experiences and contexts in-depth'
      },
      {
        name: 'Mixed',
        description: 'Integrates both qualitative and quantitative approaches within one study to gain a more complete and multi-faceted understanding'
      },
      {
        name: 'Quantitative',
        description: 'Uses numerical data and statistical analysis to measure variables, test theories, and identify large-scale patterns.'
      }
    ]
  },
  'design-timing': {
    id: 'design-timing',
    name: 'Design Timing',
    description: "Validation methods organized by when they are applied in the design process: before UI design, during UI design to test prototypes, and after the launch to measure real-world performance.",
    isMultiColumn: true,
    columns: [
      {
        name: 'Before',
        description: 'Methods used early in before UI design to to validate concepts, content and mental models'
      },
      {
        name: 'During',
        description: 'Methods applied during UI design before development, to test prototypes, wireframes, and design options'
      },
      {
        name: 'After',
        description: 'Methods used after development to measure real-world performance and validate live product UX'
      }
    ]
  },
  'user-awareness': {
    id: 'user-awareness',
    name: 'User Awareness',
    description: "Validation methods categorized by user awareness of being tested: explicit methods where users know they're being evaluated, and implicit methods that capture natural behavior without user awareness.",
    isMultiColumn: true,
    columns: [
      {
        name: 'Explicit',
        description: 'Methods where users are aware they are being tested or providing feedback for evaluation purposes'
      },
      {
        name: 'Implicit',
        description: 'Methods that capture user behavior naturally without users being aware of measurement or testing'
      }
    ]
  },
  'cognitive-stage': {
    id: 'cognitive-stage',
    name: 'Cognitive Stage',
    description: 'Validation methods based on a user interaction cognitive stage: "how users feel", "what users understand" and "what users do". Before every digital interaction a user will feel UI first, then they would think (comprehend, identify next steps), and finally they would perform an action.',
    isMultiColumn: true,
    columns: [
      {
        name: 'Feel',
        description: 'Methods to validate users sentiment, attitudes, preferences'
      },
      {
        name: 'Think',
        description: 'Methods to validate comprehension, design understanding, task success'
      },
      {
        name: 'Act',
        description: 'Methods to validate user actions, conversions, interactions'
      }
    ]
  }
};

// Method metadata interface - now coming from database
export interface MethodMetadata {
  research_type: 'qualitative' | 'mixed' | 'quantitative';
  design_timing: 'before' | 'during' | 'after';
  user_awareness: 'explicit' | 'implicit';
  cognitive_stage: 'feel' | 'think' | 'act';
}

// NOTE: Method classifications are now stored in database metadata
// No more hardcoded mappings - data comes from API method.metadata field

// Helper function to group methods by a specific view using database metadata
export function groupMethodsByView(methods: ApiMethod[], viewId: string): Record<string, ApiMethod[]> {
  const view = METHOD_VIEWS[viewId];
  
  if (!view || !view.isMultiColumn || !view.columns) {
    return { all: methods };
  }

  const grouped: Record<string, ApiMethod[]> = {};
  
  // Initialize groups
  view.columns.forEach(column => {
    grouped[column.name.toLowerCase()] = [];
  });

  // Group methods based on view type using database metadata
  methods.forEach(method => {
    const metadata = method.metadata;
    if (!metadata) {
      // If no metadata, put in first group as fallback
      const firstKey = Object.keys(grouped)[0];
      if (firstKey) grouped[firstKey].push(method);
      return;
    }

    let groupKey: string;
    switch (viewId) {
      case 'research-type':
        groupKey = metadata.research_type || 'mixed';
        break;
      case 'design-timing':
        groupKey = metadata.design_timing || 'after';
        break;
      case 'user-awareness':
        groupKey = metadata.user_awareness || 'explicit';
        break;
      case 'cognitive-stage':
        groupKey = metadata.cognitive_stage || 'think';
        break;
      default:
        groupKey = 'all';
    }

    if (grouped[groupKey]) {
      grouped[groupKey].push(method);
    } else {
      // Fallback to first group if key doesn't exist
      const firstKey = Object.keys(grouped)[0];
      if (firstKey) grouped[firstKey].push(method);
    }
  });

  return grouped;
} 
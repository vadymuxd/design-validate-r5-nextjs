export interface Tool {
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  upvotes: number;
  downvotes: number;
  pros?: string[];
  cons?: string[];
}

export type Category =
  | 'usabilityTesting'
  | 'eventTracking'
  | 'abTesting'
  | 'uxDataAnalysis'
  | 'sessionReplays'
  | 'heatmaps'
  | 'aiValidation'
  | 'surveys'
  | 'userFeedback'
  | 'conceptTesting';

export const categories = [
  { id: 'usabilityTesting', label: 'Usability Testing' },
  { id: 'eventTracking', label: 'Event Tracking' },
  { id: 'abTesting', label: 'A/B Testing' },
  { id: 'uxDataAnalysis', label: 'UX Data Analysis' },
  { id: 'sessionReplays', label: 'Session Replays' },
  { id: 'heatmaps', label: 'Heat-maps' },
  { id: 'aiValidation', label: 'AI Validation' },
  { id: 'surveys', label: 'Surveys' },
  { id: 'userFeedback', label: 'User Feedback' },
  { id: 'conceptTesting', label: 'Concept Testing' },
] as const; 
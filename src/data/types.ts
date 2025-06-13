export interface Tool {
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  upvotes: number;
  downvotes: number;
}

export type Category = 'usabilityTesting' | 'eventTracking' | 'abTesting';

export const categories = [
  { id: 'usabilityTesting', label: 'Usability Testing' },
  { id: 'eventTracking', label: 'Event Tracking' },
  { id: 'abTesting', label: 'A/B Testing' },
] as const; 
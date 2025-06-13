export interface Tool {
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
}

export const categories = [
  { label: 'Usability Testing', isActive: true },
  { label: 'Event Tracking', isActive: false },
  { label: 'A/B Testing', isActive: false },
] as const;

export const tools: Tool[] = [
  {
    name: 'Maze',
    description: 'Unmoderated testing for prototypes with fast, automated insights.',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTzAdjYl-qBnbFtzY_fodRO3zqotuI90aBWg&s',
    website_url: 'https://maze.co/',
  },
  {
    name: 'Lookback',
    description: 'Live or recorded user sessions with real-time observation and feedback.',
    logo_url: 'https://pbs.twimg.com/profile_images/1458835361036181504/DArHdgHN_400x400.png',
    website_url: 'https://www.lookback.com/',
  },
  {
    name: 'UserTesting',
    description: 'Access to a large tester panel for quick, targeted usability feedback.',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbfGbzsa1YDRuz2i8lASWjpgHIIDUcZsBIA&s',
    website_url: 'https://www.usertesting.com/',
  },
]; 
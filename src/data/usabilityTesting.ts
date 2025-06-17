import { Tool } from './types';

export const categories = [
  { label: 'Usability Testing', isActive: true },
  { label: 'Event Tracking', isActive: false },
  { label: 'A/B Testing', isActive: false },
] as const;

export const usabilityTestingTools: Tool[] = [
  {
    name: 'UXTweak',
    description: 'All-in-one research platform with a very strong price-to-value ratio',
    logo_url: '/tools-logos/uxtweak.png',
    website_url: 'https://www.uxtweak.com/',
    upvotes: 260,
    downvotes: 50,
    pros: ['Comprehensive suite (usability testing, IA, surveys)', 'Affordable', 'Powerful analytics'],
    cons: ['Panel quality can be inconsistent (common issue)', 'UI can feel less polished than some rivals']
  },
  {
    name: 'UserTesting',
    description: 'Access to a massive, diverse participant panel for in-depth video feedback',
    logo_url: '/tools-logos/usertesting.png',
    website_url: 'https://www.usertesting.com/',
    upvotes: 320,
    downvotes: 120,
    pros: ['Unmatched panel size', 'Powerful demographic filtering', 'High-quality video insights'],
    cons: ['Very expensive', 'Some issues with participant quality despite screeners', 'Can be slow']
  },
  {
    name: 'Optimal Workshop',
    description: 'Best-in-class, specialized toolset for Information Architecture research',
    logo_url: '/tools-logos/optimalworkshop.png',
    website_url: 'https://www.optimalworkshop.com/',
    upvotes: 180,
    downvotes: 40,
    pros: ['Gold standard for card sorting & tree testing', 'Clear reporting', 'High-quality analysis'],
    cons: ['Niche focus', 'Other features (e.g., surveys) are less developed than competitors']
  },
  {
    name: 'Userlytics',
    description: 'Enterprise-grade testing with advanced features and a global participant panel',
    logo_url: '/tools-logos/userlytics.png',
    website_url: 'https://www.userlytics.com/',
    upvotes: 190,
    downvotes: 60,
    pros: ['Global panel', 'Advanced screener logic', 'Picture-in-picture asset testing', 'Flexible pricing'],
    cons: ['Platform UI can be complex and slightly clunky', 'Can be expensive for smaller teams']
  },
  {
    name: 'UserZoom',
    description: 'Enterprise-grade research platform with a mix of qualitative and quantitative tools',
    logo_url: '/tools-logos/userzoom.png',
    website_url: 'https://www.userzoom.com/',
    upvotes: 160,
    downvotes: 65,
    pros: ['Advanced quantitative capabilities', 'Flexible recruiting options', 'Robust feature set'],
    cons: ['Complex UI', 'High cost', 'Identity and future are now merged with UserTesting']
  },
  {
    name: 'UsabilityHub',
    description: 'The go-to tool for extremely fast, simple, unmoderated preference and first-click tests',
    logo_url: '/tools-logos/usabilityhub.webp',
    website_url: 'https://www.usabilityhub.com/',
    upvotes: 150,
    downvotes: 60,
    pros: ['Intuitive', 'Very fast for simple tests (5-second, first-click)', 'Affordable'],
    cons: ['Limited test types', 'Panel is less diverse', 'Not suitable for complex research']
  },
  {
    name: 'Userfeel',
    description: 'Pay-as-you-go pricing model with a large multilingual participant panel',
    logo_url: '/tools-logos/userfeel.png',
    website_url: 'https://www.userfeel.com/',
    upvotes: 120,
    downvotes: 35,
    pros: ['Flexible pricing', 'No subscription needed', 'Very fast turnaround for tests', 'Multilingual support'],
    cons: ['Reporting features are less robust than competitors', 'Test setup is more basic']
  },
  {
    name: 'Maze',
    description: 'Rapid, unmoderated prototype testing integrated directly with design tools',
    logo_url: '/tools-logos/maze.png',
    website_url: 'https://maze.co/',
    upvotes: 210,
    downvotes: 150,
    pros: ['Deep Figma integration', 'Fast results', 'Beautiful reports', 'Easy to set up tests'],
    cons: ['Very poor participant panel quality is a widespread and significant complaint']
  },
  {
    name: 'Userbrain',
    description: 'Subscription-based continuous testing with a focus on simplicity and consistency',
    logo_url: '/tools-logos/userbrain.png',
    website_url: 'https://www.userbrain.com/',
    upvotes: 110,
    downvotes: 50,
    pros: ['Simple setup', 'Automated weekly testing', 'Predictable pricing', 'AI-powered insights'],
    cons: ['Less flexibility for one-off projects', 'Smaller feature set than all-in-one platforms']
  },
  {
    name: 'Lookback',
    description: 'Real-time, moderated mobile and desktop user interviews',
    logo_url: '/tools-logos/lookback.png',
    website_url: 'https://www.lookback.com/',
    upvotes: 90,
    downvotes: 110,
    pros: ['Good for live, moderated testing', 'Screen/camera/touch recording'],
    cons: ['Plagued by technical bugs', 'Frequent connection drops', 'Poor reliability']
  }
]; 
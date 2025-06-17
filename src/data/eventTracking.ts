import { Tool } from './types';

export const eventTrackingTools: Tool[] = [
  {
    name: 'Mixpanel',
    description: 'Offers the most powerful dedicated tools for deep product analytics',
    logo_url: '/tools-logos/mixpanel.png',
    website_url: 'https://mixpanel.com/',
    upvotes: 320,
    downvotes: 80,
    pros: ['Best-in-class for funnels, flows, and retention reports', 'Powerful product analytics', 'Dedicated event tracking'],
    cons: ['Requires initial developer setup for event tracking', 'Can be complex for non-technical users']
  },
  {
    name: 'Heap',
    description: 'Automatically captures every user interaction without needing code',
    logo_url: '/tools-logos/heap.png',
    website_url: 'https://heap.io/',
    upvotes: 250,
    downvotes: 70,
    pros: ['Autocapture without developer setup', 'Retroactive data analysis', 'No need to predefine events'],
    cons: ['Data can get messy without a clear tracking plan', 'Can capture too much irrelevant data']
  },
  {
    name: 'FullStory',
    description: 'Combines qualitative session replay with quantitative analytics',
    logo_url: '/tools-logos/fullstory.png',
    website_url: 'https://www.fullstory.com/',
    upvotes: 280,
    downvotes: 70,
    pros: ['Combines session replay with analytics', 'Visual understanding of user behavior', 'Great for debugging UX issues'],
    cons: ['Very expensive', 'Analytics less powerful than dedicated tools', 'Can be overwhelming with data']
  },
  {
    name: 'Pendo',
    description: 'Integrates product analytics with tools to create in-app guides and polls',
    logo_url: '/tools-logos/pendo.png',
    website_url: 'https://www.pendo.io/',
    upvotes: 190,
    downvotes: 70,
    pros: ['Combines analytics with in-app engagement', 'Feature adoption tracking', 'User onboarding tools'],
    cons: ['Analytics less deep than competitors', 'Can be complex to master', 'Expensive for smaller teams']
  },
  {
    name: 'Amplitude',
    description: 'Provides sophisticated analytics for complex, large-scale products',
    logo_url: '/tools-logos/amplitude.png',
    website_url: 'https://amplitude.com/',
    upvotes: 310,
    downvotes: 90,
    pros: ['Powerful segmentation capabilities', 'Predictive analytics features', 'Enterprise-grade scalability'],
    cons: ['Steep learning curve', 'Often too complex for simple questions', 'Expensive for smaller teams']
  },
  {
    name: 'Hotjar',
    description: 'Delivers simple, visual insights by combining heatmaps and recordings with events',
    logo_url: '/tools-logos/hotjar.png',
    website_url: 'https://www.hotjar.com/',
    upvotes: 310,
    downvotes: 60,
    pros: ['Extremely easy to use', 'Combines multiple tools in one', 'Great visual insights', 'Affordable pricing'],
    cons: ['Event tracking is less robust than dedicated tools', 'Limited advanced analytics', 'Basic segmentation']
  },
  {
    name: 'PostHog',
    description: 'Unifies product analytics, session replay, and feature flags in a single platform',
    logo_url: '/tools-logos/posthog.png',
    website_url: 'https://posthog.com/',
    upvotes: 290,
    downvotes: 30,
    pros: ['All-in-one platform', 'Open source options', 'Great for technical teams', 'Feature flags included'],
    cons: ['Requires heavy engineering support', 'Overkill for most PMs', 'Complex setup for non-technical users']
  },
  {
    name: 'LogRocket',
    description: 'Connects user behavior directly to technical performance data and errors',
    logo_url: '/tools-logos/logrocket.png',
    website_url: 'https://logrocket.com/',
    upvotes: 180,
    downvotes: 50,
    pros: ['Session replay with performance data', 'Great for debugging', 'Connects behavior to technical issues'],
    cons: ['More focused on dev/support workflows', 'Less product insights focused', 'Can be expensive']
  },
  {
    name: 'Google Analytics 4',
    description: 'A free, universal platform deeply integrated with Google\'s advertising tools',
    logo_url: '/tools-logos/google analytics 4.png',
    website_url: 'https://analytics.google.com/',
    upvotes: 280,
    downvotes: 150,
    pros: ['Free to start', 'Integrates with Google ecosystem', 'Good for web attribution', 'Widely used'],
    cons: ['Confusing UI makes finding product insights difficult', 'Steep learning curve', 'Limited customer support']
  },
  {
    name: 'Indicative',
    description: 'Analyzes user behavior by connecting directly to a company\'s data warehouse',
    logo_url: '/tools-logos/indicative.png',
    website_url: 'https://indicative.com/',
    upvotes: 130,
    downvotes: 30,
    pros: ['Leverages existing data warehouse', 'Powerful cross-product analysis', 'No data duplication needed'],
    cons: ['Requires an established data warehouse', 'Needs dedicated data team', 'Complex setup process']
  }
]; 
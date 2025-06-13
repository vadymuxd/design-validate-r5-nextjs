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
    logo_url: 'https://media.licdn.com/dms/image/v2/D4E0BAQF5cgbwKM4STw/company-logo_200_200/company-logo_200_200/0/1735549240945/uxtweak_logo?e=2147483647&v=beta&t=P4RHCxfBc4KYDKnQyxUSCxP7b3vzs3S1O82AunU4CFs',
    website_url: 'https://www.uxtweak.com/',
    upvotes: 260,
    downvotes: 50
  },
  {
    name: 'UserTesting',
    description: 'Access to a massive, diverse participant panel for in-depth video feedback',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbfGbzsa1YDRuz2i8lASWjpgHIIDUcZsBIA&s',
    website_url: 'https://www.usertesting.com/',
    upvotes: 320,
    downvotes: 120
  },
  {
    name: 'Optimal Workshop',
    description: 'Best-in-class, specialized toolset for Information Architecture research',
    logo_url: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/5ea0be00c8fa500001d66f46/0x0.png',
    website_url: 'https://www.optimalworkshop.com/',
    upvotes: 180,
    downvotes: 40
  },
  {
    name: 'Userlytics',
    description: 'Enterprise-grade testing with advanced features and a global participant panel',
    logo_url: 'https://media.licdn.com/dms/image/v2/C560BAQEh9XKQIckqRQ/company-logo_200_200/company-logo_200_200/0/1630653970170/userlytics_corporation_logo?e=2147483647&v=beta&t=OA8gJ8ELxSGBAHGahfdQMr6U5N4MNjECy1lX_9e9y3s',
    website_url: 'https://www.userlytics.com/',
    upvotes: 190,
    downvotes: 60
  },
  {
    name: 'UserZoom',
    description: 'Enterprise-grade research platform with a mix of qualitative and quantitative tools',
    logo_url: 'https://play-lh.googleusercontent.com/vMJLnhpp2o5C_3DPx1uEsRTRFfRMrexkOzjiVF7ur5Pl9Sggi3WkX0jJGOdlP6BKoIU',
    website_url: 'https://www.userzoom.com/',
    upvotes: 160,
    downvotes: 65
  },
  {
    name: 'UsabilityHub',
    description: 'The go-to tool for extremely fast, simple, unmoderated preference and first-click tests',
    logo_url: 'https://img.stackshare.io/service/4640/WQLiJp-__400x400.jpg',
    website_url: 'https://www.usabilityhub.com/',
    upvotes: 150,
    downvotes: 60
  },
  {
    name: 'Userfeel',
    description: 'Pay-as-you-go pricing model with a large multilingual participant panel',
    logo_url: 'https://play-lh.googleusercontent.com/__oe1K8_HdDduUSXsAEzAJ6pu9qIhNbqcoD8urRdQV9FGHepDF6gVXI8BKr2KDFfAXQ',
    website_url: 'https://www.userfeel.com/',
    upvotes: 120,
    downvotes: 35
  },
  {
    name: 'Maze',
    description: 'Rapid, unmoderated prototype testing integrated directly with design tools',
    logo_url: 'https://www.datocms-assets.com/38511/1627404461-publisherlogo.jpg?auto=format',
    website_url: 'https://maze.co/',
    upvotes: 210,
    downvotes: 150
  },
  {
    name: 'Userbrain',
    description: 'Subscription-based continuous testing with a focus on simplicity and consistency',
    logo_url: 'https://pbs.twimg.com/profile_images/1415626812655382534/nY_VOgmF_400x400.jpg',
    website_url: 'https://www.userbrain.com/',
    upvotes: 110,
    downvotes: 50
  },
  {
    name: 'Lookback',
    description: 'Real-time, moderated mobile and desktop user interviews',
    logo_url: 'https://pbs.twimg.com/profile_images/1458835361036181504/DArHdgHN_400x400.png',
    website_url: 'https://www.lookback.com/',
    upvotes: 90,
    downvotes: 110
  }
]; 
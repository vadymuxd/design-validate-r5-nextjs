import { Pill } from '@/components/Pill';
import { ToolCard } from '@/components/ToolCard';
import { Feedback } from '@/components/Feedback';

const tools = [
  {
    name: 'Maze',
    description: 'Unmoderated testing for prototypes with fast, automated insights.',
    logo: '/logos/maze.svg',
    url: 'https://maze.co/',
    upvotes: 0,
    downvotes: 0,
  },
  {
    name: 'Lookback',
    description: 'Live or recorded user sessions with real-time observation and feedback.',
    logo: '/logos/lookback.svg',
    url: 'https://www.lookback.com/',
    upvotes: 0,
    downvotes: 0,
  },
  {
    name: 'UserTesting',
    description: 'Access to a large tester panel for quick, targeted usability feedback.',
    logo: '/logos/usertesting.svg',
    url: 'https://www.usertesting.com/',
    upvotes: 0,
    downvotes: 0,
  },
];

const categories = [
  { label: 'Usability Testing', isActive: true },
  { label: 'Event Tracking', isActive: false },
  { label: 'A/B Testing', isActive: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col items-center py-12 px-8 gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-[60px] h-[60px]">
            <svg
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle cx="30" cy="30" r="30" fill="url(#gradient)" />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="30"
                  y1="0"
                  x2="30"
                  y2="60"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF3654" />
                  <stop offset="1" stopColor="#FF3654" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="font-['Inter'] font-bold text-[40px] text-white text-center">
            Design. Validate
          </h1>
        </div>

        {/* Categories */}
        <div className="flex gap-2">
          {categories.map((category) => (
            <Pill
              key={category.label}
              label={category.label}
              isActive={category.isActive}
            />
          ))}
        </div>

        {/* Tools Grid */}
        <div className="w-full max-w-[730px] flex flex-col gap-2">
          {tools.map((tool) => (
            <ToolCard
              key={tool.name}
              {...tool}
            />
          ))}
        </div>

        {/* Feedback Section */}
        <Feedback />
      </div>
    </main>
  );
}

import { Feedback } from '@/components/Feedback';
import { Pill } from '@/components/Pill';
import { ToolCard } from '@/components/ToolCard';
import { supabase } from '@/lib/supabase';
import { categories, tools } from '@/data/tools';

export const revalidate = 60;

export default async function Home() {
  // Get feedback counts
  const { data, error } = await supabase
    .from('feedback')
    .select('sentiment');

  if (error) {
    console.error('Error fetching feedback:', error);
    return null;
  }

  const counts = {
    likes: data?.filter(row => row.sentiment === 'LIKE').length || 0,
    dislikes: data?.filter(row => row.sentiment === 'DISLIKE').length || 0
  };

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
              name={tool.name}
              description={tool.description}
              logo={tool.logo_url}
              url={tool.website_url}
              upvotes={counts.likes}
              downvotes={counts.dislikes}
            />
          ))}
        </div>

        {/* Feedback Section */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-white text-[10px] leading-[1.4] text-center max-w-[520px]">
            Synthesized analysis of user sentiment (late 2023 - mid-2025) from G2, Capterra, TrustRadius, and Reddit.
            Numbers represent &quot;negative&quot; and &quot;positive&quot; mentions by users. It is reflecting the volume and intensity of
            feedback, not a literal count of every comment. Done by Gemini 2.5 Pro
          </p>
          <Feedback />
        </div>
      </div>
    </main>
  );
}

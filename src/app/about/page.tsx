'use client';

import React from 'react';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import { ContentCard } from '@/components/ContentCard';
import Image from 'next/image';

const CrownIcon = () => <Image src="/icons/goal=crown.svg" alt="" width={24} height={24} />;
const MaskIcon = () => <Image src="/icons/goal=mask.svg" alt="" width={24} height={24} />;
const CopySuccessIcon = () => <Image src="/icons/goal=copy-success.svg" alt="" width={24} height={24} />;
const ColorSwatchIcon = () => <Image src="/icons/goal=color-swatch.svg" alt="" width={24} height={24} />;
const Profile2UserIcon = () => <Image src="/icons/goal=profile-2user.svg" alt="" width={24} height={24} />;

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero and What/Why/How Section with Gradient */}
      <section
        className="py-20 sm:py-32"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1728 739\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0.000004054 137.52 -142.8 17.481 864 369.5)\\'><stop stop-color=\\'rgba(45,45,45,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(23,23,23,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(12,12,12,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(2,2,2,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-0">
            <video
              src="/gifs/about_anima.webm"
              width="100"
              height="100"
              autoPlay
              loop
              muted
              playsInline
              className="w-[100px] h-[100px]"
            />
          </div>
          <h1 className="h1 mb-4">About</h1>
          <p className="body max-w-2xl mx-auto mb-20 sm:mb-32">
            This is a prototype of a platform to popularise data-driven design
            and connect like-minded people around it.
        </p>
      </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContentCard title="What" variant="dark" size="medium">
              <p>
                Design shouldn&apos;t be held hostage by opinionated
                stakeholders who &quot;just know&quot; what looks good. We
                should not trust preferences, hunches, and biases.
              </p>
              <br />
              <p>
                Design deserves more respect and impact. Our mission is build a
                bridge between insights and design—making the process
                data-driven while popularizing design measurement.
              </p>
            </ContentCard>
            <ContentCard title="Why" variant="dark" size="medium">
              <p>
                A platform curating the best tools, methods, case studies, and
                practices for measuring and validating design. The ultimate
                hangout for designers, product managers, and engineers obsessed
                with validation.
              </p>
              <br />
              <p>
                Content and features are prioritized by community. We vote,
                discuss, share, and learn together, making insights more
                accessible and (potentially) fun.
              </p>
            </ContentCard>
            <ContentCard title="How" variant="dark" size="medium">
              <p>
                Every feature, leaderboard, topic, tool, or metric prioritized
                by collective knowledge and proven practices. We evolve mechanics
                and content at it fits the industry and community.
              </p>
              <br />
              <p>
                Starting with a concept MVP and draft content, we capture user
                feedback and user engagement to decide on next step. We connect,
                validate, iterate.
              </p>
            </ContentCard>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="bg-white py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <h2 className="h1 text-black text-center mb-12">Goals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <ContentCard
              title="Put Insights at the Heart of Design"
              variant="light"
              size="small"
              icon={<CrownIcon />}
            >
              Influence the global design process by making insights central to
              decision-making. Less opinions, more insights.
            </ContentCard>
            <ContentCard
              title="Master the Art of Measurement"
              variant="light"
              size="small"
              icon={<MaskIcon />}
            >
              Provide the know-how to measure design effectiveness, turning an
              insight into an action.
            </ContentCard>
            <ContentCard
              title="Showcase What Works"
              variant="light"
              size="small"
              icon={<CopySuccessIcon />}
            >
              Explore and share the best practices and real-world case studies
              that are changing the game.
            </ContentCard>
            <ContentCard
              title="Upgrade Our Toolkit"
              variant="light"
              size="small"
              icon={<ColorSwatchIcon />}
            >
              Discover and share the latest and greatest tools and methods for
              validating your designs.
            </ContentCard>
            <ContentCard
              title="Build a Community"
              variant="light"
              size="small"
              icon={<Profile2UserIcon />}
            >
              Create a space for designers, product managers, and engineers who
              are passionate about measuring what matters.
            </ContentCard>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[var(--color-grey-light)] py-20 sm:py-32">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="h1 text-black mb-4">Hi, there!</h2>
          <p className="body text-[var(--color-grey-dark)] mb-8">
            Does this vision resonate with you and you&apos;d like to
            contribute or join the mission? Or maybe you found any bugs or have
            any questions?
          </p>
          <div className="flex flex-col gap-4 items-center">
            <Textarea
              placeholder="Include your contact details if you want to be contacted back"
              rows={4}
            />
            <Button
              variant="primary"
              onClick={() => alert('Message sent (not really)!')}
              icon="/icons/Send.svg"
            >
              Send message
            </Button>
          </div>
        </div>
      </section>
      </div>
  );
} 
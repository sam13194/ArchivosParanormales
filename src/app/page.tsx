import { HeroSection } from '@/components/hero-section';
import { StoryCarousel } from '@/components/story-carousel';
import { mockStories } from '@/lib/data';

export default function Home() {
  const featuredStory = mockStories[0];
  const popularStories = [...mockStories].sort((a, b) => b.impact - a.impact);
  const ghostStories = mockStories.filter(s => s.tags.includes('Fantasmas/Apariciones'));
  const possessionStories = mockStories.filter(s => s.tags.includes('Poltergeist'));
  const regionalStories = mockStories.filter(s => s.location.includes('Cundinamarca'));

  return (
    <div className="flex flex-col space-y-16 md:space-y-24 py-12">
      <HeroSection story={featuredStory} />
      <div className="container mx-auto px-4 space-y-12">
        <StoryCarousel title="🔥 Más Populares" stories={popularStories} />
        <StoryCarousel title="👻 Fantasmas y Apariciones" stories={ghostStories} />
        <StoryCarousel title="😈 Posesiones y Demonios" stories={possessionStories} />
        <StoryCarousel title="🗺️ Historias de tu Región (Cundinamarca)" stories={regionalStories} />
      </div>
    </div>
  );
}

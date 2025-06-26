import type { Story } from "@/lib/types";
import { StoryCard } from "./story-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface StoryCarouselProps {
  title: string;
  stories: Story[];
}

export function StoryCarousel({ title, stories }: StoryCarouselProps) {
  if (!stories || stories.length === 0) {
    return null;
  }
  
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {stories.map((story) => (
            <CarouselItem key={story.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <StoryCard story={story} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4" />
        <CarouselNext className="hidden md:flex -right-4" />
      </Carousel>
    </section>
  );
}

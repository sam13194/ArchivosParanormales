import Image from "next/image";
import { StoryPlayer } from "@/components/story-player";
import { mockStoryData, mockStories } from "@/lib/data";
import { notFound } from "next/navigation";
import { MapPin, Star, Shield, Users, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StoryCarousel } from "@/components/story-carousel";

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = mockStories.find((s) => s.id.toString() === params.id);

  if (!story) {
    notFound();
  }

  const related = mockStories.filter(s => story.relatedStories.includes(s.id));

  return (
    <div className="min-h-screen">
      <div className="relative h-[50vh] w-full">
        <Image
          src={story.backgroundImageUrl || story.imageUrl}
          alt={`Imagen de fondo para ${story.title}`}
          fill
          className="object-cover"
          data-ai-hint={story.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 relative -mt-32 z-10">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-shadow text-white">
          {story.title}
        </h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <StoryPlayer story={story} />
          </div>
          <div className="space-y-6 text-sm">
            <div className="bg-card p-4 rounded-lg">
              <p className="text-muted-foreground mb-4">{story.summary}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{story.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Impacto: {story.impact} / 5</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Credibilidad: {story.credibility} / 5</span>
                </div>
                 <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Testigos: {story.witnesses.map(w => w.name).join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Fecha: {story.eventDate}</span>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                 <Tag className="h-4 w-4 text-primary" />
                 Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-screen-2xl px-4 py-16">
        <StoryCarousel title="Historias Relacionadas" stories={related} />
      </div>
    </div>
  );
}

"use client";

import type { Story } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { PlayCircle, BookOpen } from "lucide-react";
import { usePlayer } from "@/context/player-context";

interface HeroSectionProps {
  story: Story;
}

export function HeroSection({ story }: HeroSectionProps) {
  const { playStory } = usePlayer();

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full flex items-end text-white">
      <Image
        src={story.imageUrl}
        alt={`Imagen de fondo para ${story.title}`}
        fill
        className="object-cover"
        priority
        data-ai-hint={story.imageHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      
      <div className="relative container mx-auto px-4 z-10 pb-12 md:pb-20 text-shadow">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white">
            {story.title}
          </h1>
          <p className="mt-4 text-lg text-gray-300 line-clamp-3">
            {story.summary}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold text-lg px-8 py-6" onClick={() => playStory(story)}>
                <PlayCircle className="mr-2 h-6 w-6" />
                ESCUCHAR AHORA
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white font-bold text-lg px-8 py-6 backdrop-blur-sm">
              <Link href={`/story/${story.id}`}>
                <BookOpen className="mr-2 h-6 w-6" />
                LEER HISTORIA
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

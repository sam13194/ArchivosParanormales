"use client";

import type { Story } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, PlayCircle, Star, BadgeCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { usePlayer } from "@/context/player-context";
import { Button } from "./ui/button";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const { playStory } = usePlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playStory(story);
  };

  return (
    <div className="group">
      <div className="aspect-[16/9] relative rounded-md overflow-hidden bg-card">
        <Link href={`/story/${story.id}`} aria-label={`Ver detalles de ${story.title}`}>
          <Image
            src={story.imageUrl}
            alt={`Portada de ${story.title}`}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            data-ai-hint={story.imageHint}
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3 text-white pointer-events-none">
          <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-sm leading-tight">{story.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <MapPin className="h-3 w-3" />
              <span>{story.location.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
               <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
               <span>{story.impact}/5 Impacto</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Clock className="h-3 w-3" />
              <span>{story.duration} min</span>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayClick}
            className="bg-background/80 hover:bg-background/90 rounded-full h-10 w-10 pointer-events-auto"
            aria-label={`Reproducir ${story.title}`}
          >
             <PlayCircle className="h-6 w-6 text-primary" />
           </Button>
        </div>
        {story.isBasedOnRealTestimony && (
           <Badge variant="default" className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5">
             <BadgeCheck className="h-3 w-3 mr-1"/>
             Testimonio Real
           </Badge>
        )}
      </div>
    </div>
  );
}

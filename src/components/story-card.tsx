import type { Story } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, PlayCircle, Star, Award } from "lucide-react";
import { Badge } from "./ui/badge";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/story/${story.id}`} className="block group">
      <div className="aspect-[16/9] relative rounded-md overflow-hidden bg-card">
        <Image
          src={story.imageUrl}
          alt={`Portada de ${story.title}`}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          data-ai-hint={story.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3 text-white">
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
          <div className="bg-background/80 rounded-full p-2">
             <PlayCircle className="h-6 w-6 text-primary" />
          </div>
        </div>
        {story.isBasedOnRealTestimony && (
           <Badge variant="destructive" className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-[10px] px-1.5 py-0.5">
             <Award className="h-3 w-3 mr-1"/>
             Testimonio Real
           </Badge>
        )}
      </div>
    </Link>
  );
}

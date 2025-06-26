"use client";

import { useState } from "react";
import type { Story } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Volume2,
  Headphones,
  BookOpen,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { ScrollArea } from "./ui/scroll-area";

interface StoryPlayerProps {
  story: Story;
}

const Waveform = () => (
  <svg
    width="100%"
    height="100"
    viewBox="0 0 500 100"
    preserveAspectRatio="none"
    className="text-primary"
  >
    <path
      d="M0 50 L10 55 L20 45 L30 60 L40 40 L50 65 L60 35 L70 70 L80 30 L90 75 L100 25 L110 80 L120 20 L130 85 L140 15 L150 90 L160 10 L170 95 L180 5 L190 90 L200 10 L210 85 L220 15 L230 80 L240 20 L250 75 L260 25 L270 70 L280 30 L290 65 L300 35 L310 60 L320 40 L330 55 L340 45 L350 50 L360 55 L370 45 L380 60 L390 40 L400 65 L410 35 L420 70 L430 30 L440 75 L450 25 L460 80 L470 20 L480 85 L490 15 L500 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export function StoryPlayer({ story }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [volume, setVolume] = useState(80);

  return (
    <Tabs defaultValue="audio" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-secondary">
        <TabsTrigger value="audio">
          <Headphones className="mr-2 h-4 w-4" />
          Modo Audio
        </TabsTrigger>
        <TabsTrigger value="lectura">
          <BookOpen className="mr-2 h-4 w-4" />
          Modo Lectura
        </TabsTrigger>
      </TabsList>
      <TabsContent value="audio" className="bg-card p-6 rounded-b-lg">
        <div className="flex flex-col space-y-4">
          <Waveform />
          <div className="space-y-2">
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.floor((story.duration * 60 * progress) / 100 / 60)}:{Math.floor((story.duration * 60 * progress) / 100 % 60).toString().padStart(2, '0')}</span>
              <span>{story.duration}:00</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Rewind className="h-6 w-6" />
              </Button>
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <FastForward className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">1x</Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="lectura" className="bg-card rounded-b-lg">
        <ScrollArea className="h-96 p-6">
          <p className="whitespace-pre-wrap leading-relaxed font-body text-foreground/80">
            {story.fullText}
          </p>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}

'use client';

import { useState } from 'react';
import { usePlayer } from '@/context/player-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, Rewind, FastForward, X, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Slider } from './ui/slider';

const Waveform = () => (
    <svg width="100%" height="80" viewBox="0 0 500 80" preserveAspectRatio="none" className="text-primary/50">
      <path d="M0 40 L10 44 L20 36 L30 48 L40 32 L50 52 L60 28 L70 56 L80 24 L90 60 L100 20 L110 64 L120 16 L130 68 L140 12 L150 72 L160 8 L170 76 L180 4 L190 72 L200 8 L210 68 L220 12 L230 64 L240 16 L250 60 L260 20 L270 56 L280 24 L290 52 L300 28 L310 48 L320 32 L330 44 L340 36 L350 40 L360 44 L370 36 L380 48 L390 32 L400 52 L410 28 L420 56 L430 24 L440 60 L450 20 L460 64 L470 16 L480 68 L490 12 L500 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );

export function PlayerSidebar() {
  const { currentStory, isPlaying, togglePlay, closePlayer } = usePlayer();
  const [progress, setProgress] = useState(25); 

  if (!currentStory) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 flex flex-col shadow-2xl">
       <Card className="h-full flex flex-col border-0 rounded-none bg-transparent">
        <CardHeader className="relative p-4">
            <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10" onClick={closePlayer}>
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar reproductor</span>
            </Button>
            <div className="w-full aspect-video relative rounded-md overflow-hidden mt-4">
                 <Image src={currentStory.imageUrl} alt={currentStory.title} fill className="object-cover" data-ai-hint={currentStory.imageHint} />
                 <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between p-4">
            <div>
                <CardTitle className="text-xl font-headline">{currentStory.title}</CardTitle>
                <CardDescription className="mt-1">{currentStory.location}</CardDescription>
            </div>
            
            <div className='space-y-6'>
                <Waveform />
                <div className="space-y-2">
                    <Slider
                    value={[progress]}
                    onValueChange={(value) => setProgress(value[0])}
                    max={100}
                    step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.floor((currentStory.duration * 60 * progress) / 100 / 60)}:{Math.floor((currentStory.duration * 60 * progress) / 100 % 60).toString().padStart(2, '0')}</span>
                        <span>{currentStory.duration}:00</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Rewind className="h-6 w-6" />
                    </Button>
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
                        onClick={togglePlay}
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
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href={`/story/${currentStory.id}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Ver detalles y transcripción
              </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

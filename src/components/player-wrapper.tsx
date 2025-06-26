'use client';

import { usePlayer } from '@/context/player-context';
import { PlayerSidebar } from './player-sidebar';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function PlayerWrapper({ children }: { children: ReactNode }) {
  const { currentStory } = usePlayer();

  return (
    <div className='relative'>
        <div className={cn(
            "min-h-screen flex flex-col transition-all duration-300 ease-in-out",
            currentStory ? "mr-80" : "mr-0"
        )}>
            {children}
        </div>
        <PlayerSidebar />
    </div>
  )
}

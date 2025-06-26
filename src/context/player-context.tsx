'use client';

import type { Story } from '@/lib/types';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PlayerContextType {
  currentStory: Story | null;
  isPlaying: boolean;
  playStory: (story: Story) => void;
  togglePlay: () => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playStory = (story: Story) => {
    if (currentStory?.id === story.id) {
        togglePlay();
    } else {
        setCurrentStory(story);
        setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (currentStory) {
      setIsPlaying(prev => !prev);
    }
  };
  
  const closePlayer = () => {
    setCurrentStory(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider value={{ currentStory, isPlaying, playStory, togglePlay, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/hero-section';
import { StoryCarousel } from '@/components/story-carousel';
import { StoriesFilter } from '@/components/stories-filter';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { DatabaseStory, adaptDatabaseStory } from '@/lib/types';

interface FilterOptions {
  generos: string[];
  verificaciones: string[];
  departamentos: string[];
  ciudades: string[];
  ranges: {
    impacto: { min: number; max: number };
    credibilidad: { min: number; max: number };
  };
  ordenamiento: Array<{value: string; label: string}>;
}

export default function Home() {
  const [stories, setStories] = useState<DatabaseStory[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar opciones de filtros
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch('/api/stories/filters');
        const data = await response.json();
        setFilterOptions(data);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    loadFilterOptions();
  }, []);

  // Cargar historias
  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        // Aplicar filtros
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            queryParams.append(key, value as string);
          }
        });

        const response = await fetch(`/api/stories?${queryParams.toString()}`);
        const data = await response.json();
        setStories(data.stories || []);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Convertir historias de DB a formato Story y organizar por categorías
  const adaptedStories = stories.map(adaptDatabaseStory);
  const featuredStory = adaptedStories[0];
  const popularStories = [...adaptedStories].sort((a, b) => b.impact - a.impact);
  const ghostStories = adaptedStories.filter(s => s.tags.some(tag => tag.includes('fantasma') || tag.includes('aparicion')));
  const recentStories = [...adaptedStories].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <div className="flex flex-col space-y-8 py-12">
      {featuredStory && <HeroSection story={featuredStory} />}
      
      <div className="container mx-auto px-4">
        {/* Controles de Filtrado */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Explorar Historias</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {Object.keys(filters).length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>
            {Object.keys(filters).length > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Panel de Filtros */}
        {showFilters && filterOptions && (
          <div className="mb-8">
            <StoriesFilter 
              options={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando historias...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(filters).length > 0 ? (
              <StoryCarousel title={`📊 Resultados (${stories.length})`} stories={adaptedStories} />
            ) : (
              <>
                <StoryCarousel title="🔥 Más Populares" stories={popularStories.slice(0, 6)} />
                <StoryCarousel title="👻 Fantasmas y Apariciones" stories={ghostStories.slice(0, 6)} />
                <StoryCarousel title="🆕 Más Recientes" stories={recentStories.slice(0, 6)} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

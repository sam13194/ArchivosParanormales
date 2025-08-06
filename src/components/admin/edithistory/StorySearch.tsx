'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, FileText, Calendar, MapPin, Eye, Star,
  ChevronRight, Filter, X
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Story {
  id: number;
  titulo_provisional: string;
  descripcion_corta: string;
  genero_principal: string;
  credibilidad_score: number;
  ponderacion_impacto: number;
  fecha_evento_inicio: string;
  created_at: string;
  estado_procesamiento: string;
  ubicaciones?: {
    nivel1_nombre: string;
    nivel2_nombre: string;
  };
}

interface StorySearchProps {
  onStorySelect: (story: Story) => void;
  selectedStoryId?: number | null;
}

export default function StorySearch({ onStorySelect, selectedStoryId }: StorySearchProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [credibilityFilter, setCredibilityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stories from API
  const fetchStories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/historias', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStories(data.historias || []);
      setFilteredStories(data.historias || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Error al cargar las historias. Por favor, intenta de nuevo.');
      setStories([]);
      setFilteredStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load stories on component mount
  useEffect(() => {
    fetchStories();
  }, []);

  // Filter stories based on search and filters
  useEffect(() => {
    let filtered = stories;

    // Text search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(story => 
        story.titulo_provisional?.toLowerCase().includes(searchLower) ||
        story.descripcion_corta?.toLowerCase().includes(searchLower) ||
        story.ubicaciones?.nivel1_nombre?.toLowerCase().includes(searchLower) ||
        story.ubicaciones?.nivel2_nombre?.toLowerCase().includes(searchLower)
      );
    }

    // Genre filter
    if (genreFilter !== 'all') {
      filtered = filtered.filter(story => story.genero_principal === genreFilter);
    }

    // Credibility filter
    if (credibilityFilter !== 'all') {
      const credLevel = parseInt(credibilityFilter);
      filtered = filtered.filter(story => story.credibilidad_score >= credLevel);
    }

    setFilteredStories(filtered);
  }, [stories, searchTerm, genreFilter, credibilityFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setCredibilityFilter('all');
  };

  // Get unique genres for filter dropdown
  const uniqueGenres = [...new Set(stories.map(story => story.genero_principal).filter(Boolean))];

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-CO');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Get credibility badge
  const getCredibilityBadge = (level: number) => {
    const badges = {
      1: { text: 'Muy Baja', className: 'bg-red-100 text-red-800' },
      2: { text: 'Baja', className: 'bg-orange-100 text-orange-800' },
      3: { text: 'Media', className: 'bg-yellow-100 text-yellow-800' },
      4: { text: 'Alta', className: 'bg-blue-100 text-blue-800' },
      5: { text: 'Muy Alta', className: 'bg-green-100 text-green-800' }
    };
    return badges[level as keyof typeof badges] || badges[1];
  };

  const hasActiveFilters = searchTerm.trim() || genreFilter !== 'all' || credibilityFilter !== 'all';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Buscar Historia para Editar
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecciona una historia existente para editarla
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, descripción o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtros:</span>
            </div>
            
            {/* Genre Filter */}
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los géneros</SelectItem>
                {uniqueGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Credibility Filter */}
            <Select value={credibilityFilter} onValueChange={setCredibilityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Credibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toda credibilidad</SelectItem>
                <SelectItem value="4">Alta (4+)</SelectItem>
                <SelectItem value="3">Media (3+)</SelectItem>
                <SelectItem value="2">Baja (2+)</SelectItem>
                <SelectItem value="1">Muy Baja (1+)</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            
            {/* Refresh Button */}
            <Button variant="outline" size="sm" onClick={fetchStories} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Actualizar'}
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredStories.length} de {stories.length} historias
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">Cargando historias...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchStories} className="mt-2">
                Reintentar
              </Button>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {stories.length === 0 ? 'No hay historias disponibles' : 'No se encontraron historias con los filtros aplicados'}
              </p>
            </div>
          ) : (
            filteredStories.map((story) => (
              <div
                key={story.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedStoryId === story.id ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => onStorySelect(story)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {story.titulo_provisional || 'Sin título'}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        ID: {story.id}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {story.descripcion_corta || 'Sin descripción'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      {story.genero_principal && (
                        <Badge variant="secondary" className="text-xs">
                          {story.genero_principal}
                        </Badge>
                      )}
                      
                      <Badge className={`text-xs ${getCredibilityBadge(Math.round(story.credibilidad_score)).className}`}>
                        <Star className="h-3 w-3 mr-1" />
                        {getCredibilityBadge(Math.round(story.credibilidad_score)).text}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{story.ubicaciones?.nivel1_nombre || 'Sin ubicación'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(story.fecha_evento_inicio)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
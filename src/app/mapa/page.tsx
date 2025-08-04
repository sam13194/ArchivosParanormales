'use client';

import { useEffect, useState } from 'react';
import { MapPin, Layers, Filter, Search, Info, Eye, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos para el mapa
interface StoryLocation {
  id: number;
  titulo: string;
  ubicacion: {
    pais: string;
    departamento: string;
    ciudad: string;
    zona?: string;
    descripcion_lugar: string;
    latitud?: number;
    longitud?: number;
    precision_metros?: number;
  };
  genero_principal: string;
  nivel_credibilidad: number;
  fecha_sucesos: string;
  thumbnail: string;
  nivel_precision: 'exacta' | 'zona' | 'ciudad' | 'departamento' | 'pais';
}

// Mock data con diferentes niveles de precisión
const mockStoryLocations: StoryLocation[] = [
  {
    id: 1,
    titulo: "El Fantasma del Hotel Tequendama",
    ubicacion: {
      pais: "Colombia",
      departamento: "Cundinamarca", 
      ciudad: "Bogotá",
      zona: "La Candelaria",
      descripcion_lugar: "Hotel Tequendama, Carrera 10 #26-21",
      latitud: 4.5981,
      longitud: -74.0758,
      precision_metros: 50
    },
    genero_principal: "fantasmas_apariciones",
    nivel_credibilidad: 8,
    fecha_sucesos: "2024-01-15",
    thumbnail: "https://i.postimg.cc/G2t90gvb/image-8.png",
    nivel_precision: 'exacta'
  },
  {
    id: 2,
    titulo: "La Llorona de la Macarena",
    ubicacion: {
      pais: "Colombia",
      departamento: "Cundinamarca",
      ciudad: "Bogotá", 
      zona: "La Macarena",
      descripcion_lugar: "Barrio La Macarena, cerca del cementerio",
      // Sin coordenadas exactas
      precision_metros: 2000
    },
    genero_principal: "leyendas_urbanas",
    nivel_credibilidad: 6,
    fecha_sucesos: "2024-01-12",
    thumbnail: "https://i.postimg.cc/KvR77QVS/image-6.png",
    nivel_precision: 'zona'
  },
  {
    id: 3,
    titulo: "Poltergeist en Zipaquirá",
    ubicacion: {
      pais: "Colombia", 
      departamento: "Cundinamarca",
      ciudad: "Zipaquirá",
      descripcion_lugar: "Casa en el centro histórico de Zipaquirá",
      // Solo conocemos la ciudad
      precision_metros: 5000
    },
    genero_principal: "poltergeist",
    nivel_credibilidad: 9,
    fecha_sucesos: "2024-01-10", 
    thumbnail: "https://i.postimg.cc/BQLZB1Bw/image-4.png",
    nivel_precision: 'ciudad'
  },
  {
    id: 4,
    titulo: "OVNI en los Llanos Orientales",
    ubicacion: {
      pais: "Colombia",
      departamento: "Meta",
      ciudad: "Desconocido",
      descripcion_lugar: "Zona rural de los Llanos Orientales",
      // Solo conocemos el departamento
      precision_metros: 50000
    },
    genero_principal: "ovnis",
    nivel_credibilidad: 4,
    fecha_sucesos: "2024-01-08",
    thumbnail: "https://i.postimg.cc/G2t90gvb/image-8.png", 
    nivel_precision: 'departamento'
  }
];

export default function MapaParanormal() {
  const [stories, setStories] = useState<StoryLocation[]>(mockStoryLocations);
  const [filteredStories, setFilteredStories] = useState<StoryLocation[]>(mockStoryLocations);
  const [selectedStory, setSelectedStory] = useState<StoryLocation | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    genero: 'todos',
    precision: 'todos',
    credibilidad: 'todos'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para controlar las barras laterales minimizables
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);

  // Función para obtener el color según el tipo de historia
  const getGenreColor = (genre: string) => {
    const colors = {
      'fantasmas_apariciones': '#E8E8E8',
      'poltergeist': '#4169E1', 
      'ovnis': '#32CD32',
      'leyendas_urbanas': '#FFD700',
      'criptozoologia': '#8B4513',
      'default': '#808080'
    };
    return colors[genre as keyof typeof colors] || colors.default;
  };

  // Función para obtener el ícono según el nivel de precisión
  const getPrecisionIcon = (precision: string) => {
    switch(precision) {
      case 'exacta': return '📍'; // Pin exacto
      case 'zona': return '🎯'; // Target zone
      case 'ciudad': return '🏙️'; // Ciudad
      case 'departamento': return '🗺️'; // Región
      case 'pais': return '🌍'; // País
      default: return '❓';
    }
  };

  // Función para obtener descripción de precisión
  const getPrecisionDescription = (precision: string) => {
    switch(precision) {
      case 'exacta': return 'Ubicación exacta confirmada';
      case 'zona': return 'Zona aproximada del evento';
      case 'ciudad': return 'Evento ocurrió en esta ciudad';
      case 'departamento': return 'Evento ocurrió en este departamento';
      case 'pais': return 'Evento ocurrió en este país';
      default: return 'Ubicación desconocida';
    }
  };

  // Filtrar historias
  useEffect(() => {
    let filtered = stories;
    
    if (activeFilters.genero !== 'todos') {
      filtered = filtered.filter(story => story.genero_principal === activeFilters.genero);
    }
    
    if (activeFilters.precision !== 'todos') {
      filtered = filtered.filter(story => story.nivel_precision === activeFilters.precision);
    }
    
    if (activeFilters.credibilidad !== 'todos') {
      const credMin = parseInt(activeFilters.credibilidad);
      filtered = filtered.filter(story => story.nivel_credibilidad >= credMin);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(story => 
        story.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.ubicacion.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.ubicacion.departamento.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStories(filtered);
  }, [activeFilters, searchTerm, stories]);

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        {/* Botón Minimizar flotante */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMaximized(false)}
          className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur border shadow-md hover:bg-accent"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        
        {/* Mapa a pantalla completa */}
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center space-y-4">
            <MapPin className="h-24 w-24 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-2xl font-semibold text-gray-600">
                Mapa Fullscreen
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Aquí se mostrará Google Maps ocupando toda la pantalla, sin ninguna interfaz adicional.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
        {/* Barra Lateral Izquierda - Filtros */}
        <div className={`${leftSidebarOpen ? 'w-40' : 'w-12'} transition-all duration-300 bg-background border-r flex-shrink-0 relative z-10`}>
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="absolute -right-3 top-4 z-20 bg-background border shadow-md hover:bg-accent"
          >
            {leftSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          
          {leftSidebarOpen && (
            <div className="p-4 h-full overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h2 className="font-semibold">Filtros y Búsqueda</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ciudad, historia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Evento</label>
                    <Select value={activeFilters.genero} onValueChange={(value) => 
                      setActiveFilters(prev => ({...prev, genero: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los tipos</SelectItem>
                        <SelectItem value="fantasmas_apariciones">👻 Fantasmas</SelectItem>
                        <SelectItem value="poltergeist">⚡ Poltergeist</SelectItem>
                        <SelectItem value="ovnis">🛸 OVNIs</SelectItem>
                        <SelectItem value="leyendas_urbanas">🏙️ Leyendas Urbanas</SelectItem>
                        <SelectItem value="criptozoologia">🦎 Criptozoología</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nivel de Precisión</label>
                    <Select value={activeFilters.precision} onValueChange={(value) => 
                      setActiveFilters(prev => ({...prev, precision: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas las precisiones</SelectItem>
                        <SelectItem value="exacta">📍 Ubicación Exacta</SelectItem>
                        <SelectItem value="zona">🎯 Zona Aproximada</SelectItem>
                        <SelectItem value="ciudad">🏙️ Ciudad</SelectItem>
                        <SelectItem value="departamento">🗺️ Departamento</SelectItem>
                        <SelectItem value="pais">🌍 País</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Credibilidad Mínima</label>
                    <Select value={activeFilters.credibilidad} onValueChange={(value) => 
                      setActiveFilters(prev => ({...prev, credibilidad: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Cualquier nivel</SelectItem>
                        <SelectItem value="7">⭐ 7+ (Alta)</SelectItem>
                        <SelectItem value="5">⭐ 5+ (Media)</SelectItem>
                        <SelectItem value="3">⭐ 3+ (Baja)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <Info className="h-4 w-4" />
                  <span>Mostrando {filteredStories.length} de {stories.length}</span>
                </div>
                
                {/* Leyenda del Mapa */}
                <div className="pt-4 border-t mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Leyenda</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-base">📍</span>
                      <div>
                        <div className="font-medium">Exacta</div>
                        <div className="text-muted-foreground">GPS preciso</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-base">🎯</span>
                      <div>
                        <div className="font-medium">Zona</div>
                        <div className="text-muted-foreground">Área general</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-base">🏙️</span>
                      <div>
                        <div className="font-medium">Ciudad</div>
                        <div className="text-muted-foreground">Centro urbano</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-base">🗺️</span>
                      <div>
                        <div className="font-medium">Departamento</div>
                        <div className="text-muted-foreground">Región amplia</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-base">🌍</span>
                      <div>
                        <div className="font-medium">País</div>
                        <div className="text-muted-foreground">Solo país</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mapa Central - Ocupa todo el espacio disponible */}
        <div className="flex-1 relative">
          {/* Botón Maximizar/Minimizar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMaximized(true)}
            className="absolute top-4 right-4 z-30 bg-background/80 backdrop-blur border shadow-md hover:bg-accent"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center space-y-4">
              <MapPin className="h-20 w-20 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-gray-600">
                  Mapa Interactivo en Desarrollo
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Aquí se mostrará el mapa de Colombia con diferentes tipos de marcadores según el nivel de precisión de cada evento paranormal reportado.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm max-w-lg mx-auto">
                  <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg">
                    <span className="text-2xl">📍</span>
                    <span className="text-left">
                      <div className="font-medium">Ubicación Exacta</div>
                      <div className="text-xs text-gray-500">GPS preciso</div>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg">
                    <span className="text-2xl">🎯</span>
                    <span className="text-left">
                      <div className="font-medium">Zona Aproximada</div>
                      <div className="text-xs text-gray-500">Área general</div>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg">
                    <span className="text-2xl">🏙️</span>
                    <span className="text-left">
                      <div className="font-medium">Ciudad</div>
                      <div className="text-xs text-gray-500">Centro urbano</div>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg">
                    <span className="text-2xl">🗺️</span>
                    <span className="text-left">
                      <div className="font-medium">Departamento</div>
                      <div className="text-xs text-gray-500">Región amplia</div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Lateral Derecha - Lista de Historias */}
        <div className={`${rightSidebarOpen ? 'w-40' : 'w-12'} transition-all duration-300 bg-background border-l flex-shrink-0 relative z-10`}>
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="absolute -left-3 top-4 z-20 bg-background border shadow-md hover:bg-accent"
          >
            {rightSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          
          {rightSidebarOpen && (
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5" />
                <h2 className="font-semibold">Historias en el Mapa</h2>
              </div>
              
              <div className="space-y-3">
                {filteredStories.map((story) => (
                  <div 
                    key={story.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                      selectedStory?.id === story.id ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => setSelectedStory(story)}
                  >
                    <div>
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2">
                        {story.titulo}
                      </h3>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground truncate">
                          {story.ubicacion.ciudad !== 'Desconocido' ? story.ubicacion.ciudad : story.ubicacion.departamento}, {story.ubicacion.departamento}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>{story.fecha_sucesos}</span>
                          <span>{story.nivel_credibilidad}/10</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: getGenreColor(story.genero_principal) + '20' }}
                        >
                          {story.genero_principal.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredStories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No se encontraron historias</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
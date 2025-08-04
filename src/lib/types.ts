export interface Story {
  id: number;
  title: string;
  imageUrl: string;
  backgroundImageUrl?: string;
  imageHint: string;
  location: string;
  impact: number;
  duration: number;
  tags: string[];
  credibility: number;
  isBasedOnRealTestimony: boolean;
  summary: string;
  audioUrl: string;
  fullText: string;
  witnesses: { name: string; role: string }[];
  eventDate: string;
  relatedStories: number[];
}

// Nueva interfaz para historias de la base de datos
export interface DatabaseStory {
  id: number;
  titulo_provisional: string;
  descripcion_corta?: string;
  genero_principal?: string;
  ponderacion_impacto?: number;
  credibilidad_score?: number;
  nivel_verificacion?: string;
  ubicaciones?: {
    nivel1_nombre?: string;
    nivel2_nombre?: string;
  };
  created_at: string;
  fecha_evento_inicio?: string;
  archivos_multimedia?: Array<{
    tipo_archivo: string;
    ruta_absoluta?: string;
    nombre_archivo?: string;
  }>;
  testimonio_completo?: string;
  extracto_verbatim?: string;
  testigos?: Array<{
    pseudonimo?: string;
    tipo_testigo: string;
    ocupacion?: string;
  }>;
}

// Función para convertir DatabaseStory a Story (para compatibilidad)
export function adaptDatabaseStory(dbStory: DatabaseStory): Story {
  const audioFile = dbStory.archivos_multimedia?.find(a => a.tipo_archivo === 'audio_original');
  const imageFile = dbStory.archivos_multimedia?.find(a => a.tipo_archivo === 'imagen_portada');
  
  // Procesar testigos
  const witnesses = dbStory.testigos?.map(testigo => ({
    name: testigo.pseudonimo || `Testigo ${testigo.tipo_testigo}`,
    role: testigo.ocupacion || testigo.tipo_testigo || 'Testigo'
  })) || [];
  
  // Formatear fecha del evento
  const eventDate = dbStory.fecha_evento_inicio 
    ? new Date(dbStory.fecha_evento_inicio).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date(dbStory.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
  return {
    id: dbStory.id,
    title: dbStory.titulo_provisional,
    imageUrl: imageFile?.ruta_absoluta || '/placeholder-story.jpg',
    backgroundImageUrl: imageFile?.ruta_absoluta, // Usamos la misma imagen para background
    imageHint: dbStory.descripcion_corta || 'Historia paranormal',
    location: dbStory.ubicaciones?.nivel2_nombre && dbStory.ubicaciones?.nivel1_nombre 
      ? `${dbStory.ubicaciones.nivel2_nombre}, ${dbStory.ubicaciones.nivel1_nombre}` 
      : dbStory.ubicaciones?.nivel1_nombre || 'Ubicación no especificada',
    impact: dbStory.ponderacion_impacto || 3,
    duration: 300, // Default 5 minutos
    tags: dbStory.genero_principal ? [dbStory.genero_principal] : [],
    credibility: dbStory.credibilidad_score || 3,
    isBasedOnRealTestimony: true,
    summary: dbStory.descripcion_corta || dbStory.extracto_verbatim || 'Sin descripción disponible',
    audioUrl: audioFile?.ruta_absoluta || '',
    fullText: dbStory.testimonio_completo || dbStory.extracto_verbatim || '',
    witnesses: witnesses,
    eventDate: eventDate,
    relatedStories: []
  };
}

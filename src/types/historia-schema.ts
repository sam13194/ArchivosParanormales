/**
 * Esquema completo de una historia paranormal
 * Sincronizado con la base de datos y formulario UI
 */
export interface HistoriaSchema {
  // Campos de texto básicos
  titulo_provisional: string; // Máximo 255 caracteres
  descripcion_corta: string; // Máximo 500 caracteres
  
  // Arrays de strings
  advertencias: string[]; // Ej: ["violencia", "lenguaje fuerte"]
  banderas_rojas: string[]; // Ej: ["inconsistencias", "testigo dudoso"]
  palabras_clave_patron: string[]; // Ej: ["recurrente", "nocturno"]
  
  // Campos numéricos con rangos
  nivel_credibilidad: number; // Rango: 1-5
  edad_minima_recomendada: number; // Rango: 0-18
  credibilidad_estimada: number; // Rango: 0-5, decimales permitidos
  
  // Campos booleanos
  contenido_sensible: boolean;
  evento_recurrente: boolean;
  verificada: boolean;
  
  // Campos de fecha (formato ISO)
  fecha_sucesos: string; // YYYY-MM-DD
  fecha_evento_inicio: string; // YYYY-MM-DD
  
  // Campos de selección con opciones específicas
  duracion_impacto_emocional: 'leve' | 'moderado' | 'intenso' | 'traumático';
  estado_procesamiento: 'extraida' | 'en_adaptacion' | 'adaptada' | 'en_produccion' | 'producida' | 'publicada';
}
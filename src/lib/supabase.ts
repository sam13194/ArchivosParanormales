import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// For server-side operations that need service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      historias: {
        Row: {
          id: number;
          codigo_unico: string;
          titulo_provisional: string;
          fuente_relato: 'llamada_oyente' | 'historia_programa' | 'investigacion_propia';
          fecha_transcripcion: string | null;
          genero_principal: string;
          ponderacion_impacto: number;
          potencial_adaptacion: number;
          suceso_principal_resumen: string | null;
          protagonistas_descripcion: string | null;
          extracto_verbatim: string | null;
          historia_reescrita: string | null;
          notas_adicionales: string | null;
          longitud_extracto_palabras: number | null;
          ubicacion_id: number | null;
          fecha_evento_inicio: string | null;
          fecha_evento_fin: string | null;
          hora_evento: string | null;
          epoca_historica: string | null;
          duracion_evento_minutos: number | null;
          evento_recurrente: boolean;
          patron_recurrencia: string | null;
          nivel_verificacion: string;
          credibilidad_score: number | null;
          factores_credibilidad: any | null;
          banderas_rojas: any | null;
          contenido_sensible: boolean;
          advertencias: any | null;
          edad_minima_recomendada: number;
          duracion_impacto_emocional: string | null;
          dificultad_produccion: number | null;
          recursos_necesarios: any | null;
          tiempo_produccion_estimado: number | null;
          presupuesto_estimado: number | null;
          derechos_uso: string;
          autorizacion_comercial: boolean;
          autorizacion_adaptacion: boolean;
          restricciones_uso: string | null;
          contacto_derechos: string | null;
          estado_procesamiento: string;
          fecha_publicacion: string | null;
          hash_similarity: string | null;
          palabras_clave_patron: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          codigo_unico: string;
          titulo_provisional: string;
          fuente_relato: 'llamada_oyente' | 'historia_programa' | 'investigacion_propia';
          fecha_transcripcion?: string | null;
          genero_principal?: string;
          ponderacion_impacto?: number;
          potencial_adaptacion?: number;
          suceso_principal_resumen?: string | null;
          protagonistas_descripcion?: string | null;
          extracto_verbatim?: string | null;
          historia_reescrita?: string | null;
          notas_adicionales?: string | null;
          longitud_extracto_palabras?: number | null;
          ubicacion_id?: number | null;
          fecha_evento_inicio?: string | null;
          fecha_evento_fin?: string | null;
          hora_evento?: string | null;
          epoca_historica?: string | null;
          duracion_evento_minutos?: number | null;
          evento_recurrente?: boolean;
          patron_recurrencia?: string | null;
          nivel_verificacion?: string;
          credibilidad_score?: number | null;
          factores_credibilidad?: any | null;
          banderas_rojas?: any | null;
          contenido_sensible?: boolean;
          advertencias?: any | null;
          edad_minima_recomendada?: number;
          duracion_impacto_emocional?: string | null;
          dificultad_produccion?: number | null;
          recursos_necesarios?: any | null;
          tiempo_produccion_estimado?: number | null;
          presupuesto_estimado?: number | null;
          derechos_uso?: string;
          autorizacion_comercial?: boolean;
          autorizacion_adaptacion?: boolean;
          restricciones_uso?: string | null;
          contacto_derechos?: string | null;
          estado_procesamiento?: string;
          fecha_publicacion?: string | null;
          hash_similarity?: string | null;
          palabras_clave_patron?: any | null;
        };
        Update: {
          codigo_unico?: string;
          titulo_provisional?: string;
          fuente_relato?: 'llamada_oyente' | 'historia_programa' | 'investigacion_propia';
          fecha_transcripcion?: string | null;
          genero_principal?: string;
          ponderacion_impacto?: number;
          potencial_adaptacion?: number;
          suceso_principal_resumen?: string | null;
          protagonistas_descripcion?: string | null;
          extracto_verbatim?: string | null;
          historia_reescrita?: string | null;
          notas_adicionales?: string | null;
          longitud_extracto_palabras?: number | null;
          ubicacion_id?: number | null;
          fecha_evento_inicio?: string | null;
          fecha_evento_fin?: string | null;
          hora_evento?: string | null;
          epoca_historica?: string | null;
          duracion_evento_minutos?: number | null;
          evento_recurrente?: boolean;
          patron_recurrencia?: string | null;
          nivel_verificacion?: string;
          credibilidad_score?: number | null;
          factores_credibilidad?: any | null;
          banderas_rojas?: any | null;
          contenido_sensible?: boolean;
          advertencias?: any | null;
          edad_minima_recomendada?: number;
          duracion_impacto_emocional?: string | null;
          dificultad_produccion?: number | null;
          recursos_necesarios?: any | null;
          tiempo_produccion_estimado?: number | null;
          presupuesto_estimado?: number | null;
          derechos_uso?: string;
          autorizacion_comercial?: boolean;
          autorizacion_adaptacion?: boolean;
          restricciones_uso?: string | null;
          contacto_derechos?: string | null;
          estado_procesamiento?: string;
          fecha_publicacion?: string | null;
          hash_similarity?: string | null;
          palabras_clave_patron?: any | null;
        };
      };
      ubicaciones: {
        Row: {
          id: number;
          pais: string;
          codigo_pais: string | null;
          nivel1_nombre: string | null;
          nivel1_codigo: string | null;
          nivel2_nombre: string | null;
          nivel2_codigo: string | null;
          nivel3_nombre: string | null;
          nivel4_nombre: string | null;
          latitud: number | null;
          longitud: number | null;
          precision_metros: number | null;
          descripcion_lugar: string | null;
          lugar_especifico: string | null;
          tipo_lugar: string | null;
          zona_horaria: string;
          altitud_metros: number | null;
          actividad_paranormal_reportada: boolean;
          numero_historias_reportadas: number;
          primera_actividad_reportada: string | null;
          ultima_actividad_reportada: string | null;
          verificada: boolean;
          fuente_verificacion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          pais: string;
          codigo_pais?: string | null;
          nivel1_nombre?: string | null;
          nivel1_codigo?: string | null;
          nivel2_nombre?: string | null;
          nivel2_codigo?: string | null;
          nivel3_nombre?: string | null;
          nivel4_nombre?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          precision_metros?: number | null;
          descripcion_lugar?: string | null;
          lugar_especifico?: string | null;
          tipo_lugar?: string | null;
          zona_horaria?: string;
          altitud_metros?: number | null;
          actividad_paranormal_reportada?: boolean;
          numero_historias_reportadas?: number;
          primera_actividad_reportada?: string | null;
          ultima_actividad_reportada?: string | null;
          verificada?: boolean;
          fuente_verificacion?: string | null;
        };
        Update: {
          pais?: string;
          codigo_pais?: string | null;
          nivel1_nombre?: string | null;
          nivel1_codigo?: string | null;
          nivel2_nombre?: string | null;
          nivel2_codigo?: string | null;
          nivel3_nombre?: string | null;
          nivel4_nombre?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          precision_metros?: number | null;
          descripcion_lugar?: string | null;
          lugar_especifico?: string | null;
          tipo_lugar?: string | null;
          zona_horaria?: string;
          altitud_metros?: number | null;
          actividad_paranormal_reportada?: boolean;
          numero_historias_reportadas?: number;
          primera_actividad_reportada?: string | null;
          ultima_actividad_reportada?: string | null;
          verificada?: boolean;
          fuente_verificacion?: string | null;
        };
      };
      archivos_multimedia: {
        Row: {
          id: number;
          historia_id: number | null;
          tipo_archivo: string;
          nombre_archivo: string;
          ruta_absoluta: string;
          ruta_relativa: string;
          tamaño_bytes: number | null;
          hash_archivo: string | null;
          duracion_segundos: number | null;
          formato: string | null;
          bitrate: string | null;
          sample_rate: number | null;
          canales: number | null;
          ancho_px: number | null;
          alto_px: number | null;
          fps: number | null;
          metadata_extra: any | null;
          descripcion: string | null;
          version: number;
          is_active: boolean;
          fecha_creacion: string;
          fecha_modificacion: string;
        };
        Insert: {
          historia_id?: number | null;
          tipo_archivo: string;
          nombre_archivo: string;
          ruta_absoluta: string;
          ruta_relativa: string;
          tamaño_bytes?: number | null;
          hash_archivo?: string | null;
          duracion_segundos?: number | null;
          formato?: string | null;
          bitrate?: string | null;
          sample_rate?: number | null;
          canales?: number | null;
          ancho_px?: number | null;
          alto_px?: number | null;
          fps?: number | null;
          metadata_extra?: any | null;
          descripcion?: string | null;
          version?: number;
          is_active?: boolean;
        };
        Update: {
          historia_id?: number | null;
          tipo_archivo?: string;
          nombre_archivo?: string;
          ruta_absoluta?: string;
          ruta_relativa?: string;
          tamaño_bytes?: number | null;
          hash_archivo?: string | null;
          duracion_segundos?: number | null;
          formato?: string | null;
          bitrate?: string | null;
          sample_rate?: number | null;
          canales?: number | null;
          ancho_px?: number | null;
          alto_px?: number | null;
          fps?: number | null;
          metadata_extra?: any | null;
          descripcion?: string | null;
          version?: number;
          is_active?: boolean;
        };
      };
    };
  };
}

export type Historia = Database['public']['Tables']['historias']['Row'];
export type HistoriaInsert = Database['public']['Tables']['historias']['Insert'];
export type HistoriaUpdate = Database['public']['Tables']['historias']['Update'];

export type Ubicacion = Database['public']['Tables']['ubicaciones']['Row'];
export type UbicacionInsert = Database['public']['Tables']['ubicaciones']['Insert'];

export type ArchivoMultimedia = Database['public']['Tables']['archivos_multimedia']['Row'];
export type ArchivoMultimediaInsert = Database['public']['Tables']['archivos_multimedia']['Insert'];
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, Save, RotateCcw, Database, AlertCircle, CheckCircle,
  ArrowLeft, Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import all the existing sections from nueva-historia
import HistoriasSection from './sections/HistoriasSection';
import UbicacionesSection from './sections/UbicacionesSection';
import TestigosSection from './sections/TestigosSection';
import EntidadesParanormalesSection from './sections/EntidadesParanormalesSection';
import ContextoAmbientalSection from './sections/ContextoAmbientalSection';
import ArchivosMultimediaSection from './sections/ArchivosMultimediaSection';
import ElementosClaveSection from './sections/ElementosClaveSection';
import FactoresCredibilidadSection from './sections/FactoresCredibilidadSection';
import DerechosSection from './sections/DerechosSection';
import PerformanceEsperadoSection from './sections/PerformanceEsperadoSection';
import { FieldIndicatorsLegend } from './shared/FieldIndicators';
import StorySearch from './StorySearch';
import JsonLoader from './JsonLoader';

// Import the form data interface from NuevaHistoria
interface EditStoryFormData {
  // Tabla: historias (55 columns)
  historias: {
    titulo_provisional: string;
    descripcion_corta: string;
    descripcion_larga: string;
    testimonio_completo: string;
    extracto_verbatim: string;
    historia_reescrita: string;
    suceso_principal_resumen: string;
    protagonistas_descripcion: string;
    fuente_relato: string;
    genero_principal: string;
    epoca_historica: string;
    nivel_credibilidad: number;
    nivel_impacto: number;
    ponderacion_impacto: number;
    potencial_adaptacion: number;
    nivel_verificacion: string;
    longitud_extracto_palabras: number;
    fecha_sucesos: string;
    fecha_evento_inicio: string;
    fecha_evento_fin: string;
    hora_evento: string;
    evento_recurrente: boolean;
    dificultad_produccion: number;
    tiempo_produccion_estimado: number;
    presupuesto_estimado: number;
    contenido_sensible: boolean;
    advertencias: string[];
    edad_minima_recomendada: number;
    duracion_impacto_emocional: string;
    banderas_rojas: string[];
    notas_adicionales: string;
    duracion_evento_minutos: number;
    patron_recurrencia: string;
    palabras_clave_patron: string[];
    hash_similarity: string;
    codigo_unico: string;
    fecha_transcripcion: string;
    estado_procesamiento: string;
    publicar_inmediatamente: boolean;
    [key: string]: any;
  };
  
  // Tabla: ubicaciones (24 columns)
  ubicacion: {
    pais: string;
    codigo_pais: string;
    nivel1_nombre: string;
    nivel1_codigo: string;
    nivel2_nombre: string;
    nivel2_codigo: string;
    nivel3_nombre: string;
    nivel4_nombre: string;
    latitud: number | null;
    longitud: number | null;
    precision_metros: number;
    descripcion_lugar: string;
    lugar_especifico: string;
    tipo_lugar: string;
    zona_horaria: string;
    altitud_metros: number | null;
    actividad_paranormal_reportada: boolean;
    numero_historias_reportadas: number;
    primera_actividad_reportada: string;
    ultima_actividad_reportada: string;
    verificada: boolean;
    fuente_verificacion: string;
    departamento: string;
    municipio: string;
  };
  
  // Tabla: testigos (15 columns)
  testigo_principal: {
    tipo_testigo: string;
    nombre_completo: string;
    pseudonimo: string;
    edad_aprox: number;
    ocupacion: string;
    relacion_evento: string;
    presencial: boolean;
    credibilidad_estimada: number;
    factores_credibilidad: any;
    antecedentes_paranormales: boolean;
    contacto_disponible: boolean;
    notas_testigo: string;
  };
  testigos_secundarios: any[];
  
  // Tabla: entidades_paranormales (23 columns)
  entidades_paranormales: any[];
  
  // Tabla: contexto_ambiental (17 columns)
  contexto_ambiental: {
    clima: string;
    temperatura: string;
    humedad: string;
    condiciones_luz: string;
    ruidos_ambiente: string;
    factores_externos: string;
    numero_personas: number;
    situacion_social: string;
    fase_lunar: string;
    festividad_religiosa: string;
    evento_historico: string;
    aniversario_especial: string;
    actividad_previa: string;
    estado_emocional: string;
    patron_temporal: boolean;
    hora_del_dia: string;
    estacion_año: string;
  };
  
  // Tabla: archivos_multimedia (23 columns)
  archivos_multimedia: any[];
  
  // Tabla: elementos_clave (7 columns)
  elementos_clave: string[];
  
  // Tabla: factores_credibilidad (13 columns)
  factores_credibilidad: {
    multiples_testigos: number;
    evidencia_fisica: number;
    consistencia_relatos: number;
    ubicacion_verificable: number;
    contexto_historico: number;
    sobriedad_testigo: number;
    conocimiento_previo: number;
    estado_emocional: number;
    motivaciones_secundarias: number;
    corroboracion_externa: number;
    documentacion_disponible: number;
  };
  
  // Tabla: derechos (9 columns)
  derechos: {
    derechos_uso: string;
    autorizacion_comercial: boolean;
    autorizacion_adaptacion: boolean;
    restricciones_uso: string;
    contacto_derechos: string;
    fecha_autorizacion: string;
    vigencia_derechos: string;
    notas_legales: string;
  };
  
  // Tabla: performance_esperado (7 columns)
  performance_esperado: {
    audiencia_objetivo: string;
    engagement_esperado: number;
    potencial_viral: number;
    impacto_emocional_esperado: number;
    duracion_interes_estimada: number;
    metricas_objetivo: any;
  };
}

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

const defaultFormData: EditStoryFormData = {
  historias: {
    titulo_provisional: '',
    descripcion_corta: '',
    descripcion_larga: '',
    testimonio_completo: '',
    extracto_verbatim: '',
    historia_reescrita: '',
    suceso_principal_resumen: '',
    protagonistas_descripcion: '',
    fuente_relato: '',
    genero_principal: '',
    epoca_historica: '',
    nivel_credibilidad: 1,
    nivel_impacto: 1,
    ponderacion_impacto: 1,
    potencial_adaptacion: 1,
    nivel_verificacion: 'sin_verificar',
    longitud_extracto_palabras: 0,
    fecha_sucesos: '',
    fecha_evento_inicio: '',
    fecha_evento_fin: '',
    hora_evento: '',
    evento_recurrente: false,
    dificultad_produccion: 1,
    tiempo_produccion_estimado: 0,
    presupuesto_estimado: 0,
    contenido_sensible: false,
    advertencias: [],
    edad_minima_recomendada: 13,
    duracion_impacto_emocional: '',
    banderas_rojas: [],
    notas_adicionales: '',
    duracion_evento_minutos: 0,
    patron_recurrencia: '',
    palabras_clave_patron: [],
    hash_similarity: '',
    codigo_unico: '',
    fecha_transcripcion: '',
    estado_procesamiento: 'borrador',
    publicar_inmediatamente: false,
  },
  ubicacion: {
    pais: 'Colombia',
    codigo_pais: 'CO',
    nivel1_nombre: '',
    nivel1_codigo: '',
    nivel2_nombre: '',
    nivel2_codigo: '',
    nivel3_nombre: '',
    nivel4_nombre: '',
    latitud: null,
    longitud: null,
    precision_metros: 0,
    descripcion_lugar: '',
    lugar_especifico: '',
    tipo_lugar: '',
    zona_horaria: 'America/Bogota',
    altitud_metros: null,
    actividad_paranormal_reportada: false,
    numero_historias_reportadas: 0,
    primera_actividad_reportada: '',
    ultima_actividad_reportada: '',
    verificada: false,
    fuente_verificacion: '',
    departamento: '',
    municipio: '',
  },
  testigo_principal: {
    tipo_testigo: 'principal',
    nombre_completo: '',
    pseudonimo: '',
    edad_aprox: 0,
    ocupacion: '',
    relacion_evento: '',
    presencial: true,
    credibilidad_estimada: 1,
    factores_credibilidad: {},
    antecedentes_paranormales: false,
    contacto_disponible: false,
    notas_testigo: '',
  },
  testigos_secundarios: [],
  entidades_paranormales: [],
  contexto_ambiental: {
    clima: '',
    temperatura: '',
    humedad: '',
    condiciones_luz: '',
    ruidos_ambiente: '',
    factores_externos: '',
    numero_personas: 1,
    situacion_social: '',
    fase_lunar: '',
    festividad_religiosa: '',
    evento_historico: '',
    aniversario_especial: '',
    actividad_previa: '',
    estado_emocional: '',
    patron_temporal: false,
    hora_del_dia: '',
    estacion_año: '',
  },
  archivos_multimedia: [],
  elementos_clave: [],
  factores_credibilidad: {
    multiples_testigos: 1,
    evidencia_fisica: 1,
    consistencia_relatos: 1,
    ubicacion_verificable: 1,
    contexto_historico: 1,
    sobriedad_testigo: 1,
    conocimiento_previo: 1,
    estado_emocional: 1,
    motivaciones_secundarias: 1,
    corroboracion_externa: 1,
    documentacion_disponible: 1,
  },
  derechos: {
    derechos_uso: '',
    autorizacion_comercial: false,
    autorizacion_adaptacion: false,
    restricciones_uso: '',
    contacto_derechos: '',
    fecha_autorizacion: '',
    vigencia_derechos: '',
    notas_legales: '',
  },
  performance_esperado: {
    audiencia_objetivo: '',
    engagement_esperado: 0,
    potencial_viral: 0,
    impacto_emocional_esperado: 0,
    duracion_interes_estimada: 0,
    metricas_objetivo: {},
  },
};

export default function EditarHistoria() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [editForm, setEditForm] = useState<EditStoryFormData>(defaultFormData);
  const [originalStoryId, setOriginalStoryId] = useState<number | null>(null);
  
  // File states
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  
  // Loading states
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [isLoadingJson, setIsLoadingJson] = useState(false);
  
  // Error and validation states
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load story data when a story is selected
  const handleStorySelect = async (story: Story) => {
    setSelectedStory(story);
    setOriginalStoryId(story.id);
    setLoadError(null);
    setIsLoadingStory(true);
    
    try {
      const response = await fetch(`/api/admin/historias?id=${story.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const storyData = result.historia || result.historias?.[0];
      
      // Transform the API response to match our form structure
      const formData: EditStoryFormData = {
        historias: {
          titulo_provisional: storyData.titulo_provisional || '',
          descripcion_corta: storyData.descripcion_corta || '',
          descripcion_larga: storyData.descripcion_larga || '',
          testimonio_completo: storyData.testimonio_completo || '',
          extracto_verbatim: storyData.extracto_verbatim || '',
          historia_reescrita: storyData.historia_reescrita || '',
          suceso_principal_resumen: storyData.suceso_principal_resumen || '',
          protagonistas_descripcion: storyData.protagonistas_descripcion || '',
          fuente_relato: storyData.fuente_relato || '',
          genero_principal: storyData.genero_principal || '',
          epoca_historica: storyData.epoca_historica || '',
          nivel_credibilidad: storyData.credibilidad_score || 1,
          nivel_impacto: storyData.ponderacion_impacto || 1,
          ponderacion_impacto: storyData.ponderacion_impacto || 1,
          potencial_adaptacion: storyData.potencial_adaptacion || 1,
          nivel_verificacion: storyData.nivel_verificacion || 'sin_verificar',
          longitud_extracto_palabras: storyData.longitud_extracto_palabras || 0,
          fecha_sucesos: storyData.fecha_evento_inicio || '',
          fecha_evento_inicio: storyData.fecha_evento_inicio || '',
          fecha_evento_fin: storyData.fecha_evento_fin || '',
          hora_evento: storyData.hora_evento || '',
          evento_recurrente: storyData.evento_recurrente || false,
          dificultad_produccion: storyData.dificultad_produccion || 1,
          tiempo_produccion_estimado: storyData.tiempo_produccion_estimado || 0,
          presupuesto_estimado: storyData.presupuesto_estimado || 0,
          contenido_sensible: storyData.contenido_sensible || false,
          advertencias: Array.isArray(storyData.advertencias) ? storyData.advertencias : [],
          edad_minima_recomendada: storyData.edad_minima_recomendada || 13,
          duracion_impacto_emocional: storyData.duracion_impacto_emocional || '',
          banderas_rojas: Array.isArray(storyData.banderas_rojas) ? storyData.banderas_rojas : [],
          notas_adicionales: storyData.notas_adicionales || '',
          duracion_evento_minutos: storyData.duracion_evento_minutos || 0,
          patron_recurrencia: storyData.patron_recurrencia || '',
          palabras_clave_patron: Array.isArray(storyData.palabras_clave_patron) ? storyData.palabras_clave_patron : [],
          hash_similarity: storyData.hash_similarity || '',
          codigo_unico: storyData.codigo_unico || '',
          fecha_transcripcion: storyData.fecha_transcripcion || '',
          estado_procesamiento: storyData.estado_procesamiento || 'borrador',
          publicar_inmediatamente: storyData.publicar_inmediatamente || false,
        },
        ubicacion: {
          pais: storyData.ubicaciones?.pais || 'Colombia',
          codigo_pais: storyData.ubicaciones?.codigo_pais || 'CO',
          nivel1_nombre: storyData.ubicaciones?.nivel1_nombre || '',
          nivel1_codigo: storyData.ubicaciones?.nivel1_codigo || '',
          nivel2_nombre: storyData.ubicaciones?.nivel2_nombre || '',
          nivel2_codigo: storyData.ubicaciones?.nivel2_codigo || '',
          nivel3_nombre: storyData.ubicaciones?.nivel3_nombre || '',
          nivel4_nombre: storyData.ubicaciones?.nivel4_nombre || '',
          latitud: storyData.ubicaciones?.latitud || null,
          longitud: storyData.ubicaciones?.longitud || null,
          precision_metros: storyData.ubicaciones?.precision_metros || 0,
          descripcion_lugar: storyData.ubicaciones?.descripcion_lugar || '',
          lugar_especifico: storyData.ubicaciones?.lugar_especifico || '',
          tipo_lugar: storyData.ubicaciones?.tipo_lugar || '',
          zona_horaria: storyData.ubicaciones?.zona_horaria || 'America/Bogota',
          altitud_metros: storyData.ubicaciones?.altitud_metros || null,
          actividad_paranormal_reportada: storyData.ubicaciones?.actividad_paranormal_reportada || false,
          numero_historias_reportadas: storyData.ubicaciones?.numero_historias_reportadas || 0,
          primera_actividad_reportada: storyData.ubicaciones?.primera_actividad_reportada || '',
          ultima_actividad_reportada: storyData.ubicaciones?.ultima_actividad_reportada || '',
          verificada: storyData.ubicaciones?.verificada || false,
          fuente_verificacion: storyData.ubicaciones?.fuente_verificacion || '',
          departamento: storyData.ubicaciones?.nivel1_nombre || '',
          municipio: storyData.ubicaciones?.nivel2_nombre || '',
        },
        testigo_principal: storyData.testigos?.find((t: any) => t.tipo_testigo === 'principal') || defaultFormData.testigo_principal,
        testigos_secundarios: storyData.testigos?.filter((t: any) => t.tipo_testigo === 'secundario') || [],
        entidades_paranormales: storyData.historia_elementos || [],
        contexto_ambiental: storyData.contexto_ambiental || defaultFormData.contexto_ambiental,
        archivos_multimedia: storyData.archivos_multimedia || [],
        elementos_clave: storyData.historia_elementos?.map((e: any) => e.elementos_clave?.elemento) || [],
        factores_credibilidad: storyData.factores_credibilidad || defaultFormData.factores_credibilidad,
        derechos: storyData.derechos || defaultFormData.derechos,
        performance_esperado: storyData.performance_esperado || defaultFormData.performance_esperado,
      };

      setEditForm(formData);
      setSaveSuccess(false);
      setValidationErrors([]);
      
    } catch (error) {
      console.error('Error loading story:', error);
      setLoadError('Error al cargar la historia. Por favor, intenta de nuevo.');
    } finally {
      setIsLoadingStory(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File, type: 'audio' | 'image') => {
    setIsUploadingFiles(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error uploading file');
      }
      
      const result = await response.json();
      
      // Update the form with the file URL
      const newArchivo = {
        tipo: type,
        nombre_archivo: file.name,
        url: result.secure_url,
        tamaño_bytes: file.size,
        formato: file.type,
        descripcion: `${type === 'audio' ? 'Audio' : 'Imagen'} principal de la historia`,
        duracion_segundos: type === 'audio' ? null : undefined,
        es_principal: true,
        publico: false,
        metadata: result,
      };
      
      setEditForm(prev => ({
        ...prev,
        archivos_multimedia: [...prev.archivos_multimedia.filter((a: any) => a.tipo !== type), newArchivo]
      }));
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setValidationErrors(prev => [...prev, `Error al subir ${type === 'audio' ? 'audio' : 'imagen'}`]);
    } finally {
      setIsUploadingFiles(false);
    }
  };

  // Handle JSON load
  const handleJsonLoad = async (file: File) => {
    setIsLoadingJson(true);
    setValidationErrors([]);
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Validate and merge JSON data with current form
      if (jsonData.historias) {
        setEditForm(prev => ({
          ...prev,
          ...jsonData,
        }));
      } else {
        throw new Error('Invalid JSON structure');
      }
      
    } catch (error) {
      console.error('Error loading JSON:', error);
      setValidationErrors(['Error al cargar archivo JSON. Verifique el formato.']);
    } finally {
      setIsLoadingJson(false);
    }
  };

  // Download JSON template
  const downloadJsonTemplate = () => {
    const blob = new Blob([JSON.stringify(editForm, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historia-${originalStoryId || 'template'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear form
  const clearForm = () => {
    setEditForm(defaultFormData);
    setSelectedStory(null);
    setOriginalStoryId(null);
    setValidationErrors([]);
    setSaveSuccess(false);
    setAudioFile(null);
    setImageFile(null);
    setJsonFile(null);
  };

  // Save/Update story
  const updateStory = async () => {
    if (!originalStoryId) {
      setValidationErrors(['No hay historia seleccionada para actualizar']);
      return;
    }

    setIsSubmittingStory(true);
    setValidationErrors([]);
    setSaveSuccess(false);
    
    try {
      const response = await fetch(`/api/admin/historias?id=${originalStoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Mapear el formulario al formato esperado por la BD
          titulo_provisional: editForm.historias.titulo_provisional,
          descripcion_corta: editForm.historias.descripcion_corta,
          descripcion_larga: editForm.historias.descripcion_larga,
          testimonio_completo: editForm.historias.testimonio_completo,
          extracto_verbatim: editForm.historias.extracto_verbatim,
          historia_reescrita: editForm.historias.historia_reescrita,
          suceso_principal_resumen: editForm.historias.suceso_principal_resumen,
          protagonistas_descripcion: editForm.historias.protagonistas_descripcion,
          fuente_relato: editForm.historias.fuente_relato,
          genero_principal: editForm.historias.genero_principal,
          epoca_historica: editForm.historias.epoca_historica,
          credibilidad_score: editForm.historias.nivel_credibilidad,
          ponderacion_impacto: editForm.historias.ponderacion_impacto,
          potencial_adaptacion: editForm.historias.potencial_adaptacion,
          nivel_verificacion: editForm.historias.nivel_verificacion,
          longitud_extracto_palabras: editForm.historias.longitud_extracto_palabras,
          fecha_evento_inicio: editForm.historias.fecha_evento_inicio,
          fecha_evento_fin: editForm.historias.fecha_evento_fin,
          hora_evento: editForm.historias.hora_evento,
          evento_recurrente: editForm.historias.evento_recurrente,
          dificultad_produccion: editForm.historias.dificultad_produccion,
          tiempo_produccion_estimado: editForm.historias.tiempo_produccion_estimado,
          presupuesto_estimado: editForm.historias.presupuesto_estimado,
          contenido_sensible: editForm.historias.contenido_sensible,
          advertencias: editForm.historias.advertencias,
          edad_minima_recomendada: editForm.historias.edad_minima_recomendada,
          duracion_impacto_emocional: editForm.historias.duracion_impacto_emocional,
          banderas_rojas: editForm.historias.banderas_rojas,
          notas_adicionales: editForm.historias.notas_adicionales,
          duracion_evento_minutos: editForm.historias.duracion_evento_minutos,
          patron_recurrencia: editForm.historias.patron_recurrencia,
          palabras_clave_patron: editForm.historias.palabras_clave_patron,
          hash_similarity: editForm.historias.hash_similarity,
          codigo_unico: editForm.historias.codigo_unico,
          fecha_transcripcion: editForm.historias.fecha_transcripcion,
          estado_procesamiento: editForm.historias.estado_procesamiento,
          derechos_uso: editForm.derechos.derechos_uso,
          autorizacion_comercial: editForm.derechos.autorizacion_comercial,
          autorizacion_adaptacion: editForm.derechos.autorizacion_adaptacion,
          restricciones_uso: editForm.derechos.restricciones_uso,
          contacto_derechos: editForm.derechos.contacto_derechos,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating story');
      }
      
      setSaveSuccess(true);
      
    } catch (error) {
      console.error('Error updating story:', error);
      setValidationErrors([error instanceof Error ? error.message : 'Error al actualizar la historia']);
    } finally {
      setIsSubmittingStory(false);
    }
  };

  // Testigo secundario functions
  const addTestigoSecundario = () => {
    const newTestigo = {
      tipo_testigo: 'secundario',
      nombre_completo: '',
      pseudonimo: '',
      edad_aprox: 0,
      ocupacion: '',
      relacion_evento: '',
      presencial: false,
      credibilidad_estimada: 1,
      factores_credibilidad: {},
      antecedentes_paranormales: false,
      contacto_disponible: false,
      notas_testigo: '',
    };
    
    setEditForm(prev => ({
      ...prev,
      testigos_secundarios: [...prev.testigos_secundarios, newTestigo]
    }));
  };

  const removeTestigoSecundario = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      testigos_secundarios: prev.testigos_secundarios.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateTestigoSecundario = (index: number, field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      testigos_secundarios: prev.testigos_secundarios.map((testigo: any, i: number) => 
        i === index ? { ...testigo, [field]: value } : testigo
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Editar Historia
          </h2>
          <p className="text-muted-foreground">
            Busca y edita historias existentes en la base de datos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedStory && (
            <>
              <Button variant="outline" onClick={clearForm} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Nueva Búsqueda
              </Button>
              <Button variant="outline" onClick={downloadJsonTemplate} className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Exportar JSON
              </Button>
              <Button 
                onClick={updateStory}
                disabled={isSubmittingStory}
                className="flex items-center gap-2"
              >
                {isSubmittingStory ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmittingStory ? 'Guardando...' : 'Actualizar Historia'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Historia actualizada exitosamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Load Error */}
      {loadError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {loadError}
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 text-lg">Errores de Validación</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!selectedStory ? (
        // Show search interface when no story is selected
        <StorySearch 
          onStorySelect={handleStorySelect} 
          selectedStoryId={null}
        />
      ) : (
        // Show edit form when a story is selected
        <div className="space-y-6">
          {/* Selected Story Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                Historia Seleccionada para Edición
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="outline" className="text-blue-700">
                  ID: {selectedStory.id}
                </Badge>
                <Badge variant="outline" className="text-blue-700">
                  {selectedStory.genero_principal || 'Sin género'}
                </Badge>
                <span className="text-blue-700 font-medium">
                  {selectedStory.titulo_provisional || 'Sin título'}
                </span>
                {isLoadingStory && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Cargando datos...
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* JSON Loader */}
          <JsonLoader
            jsonFile={jsonFile}
            setJsonFile={setJsonFile}
            isLoadingJson={isLoadingJson}
            handleJsonLoad={handleJsonLoad}
            downloadJsonTemplate={downloadJsonTemplate}
          />

          {/* Global Field Indicators Legend */}
          <FieldIndicatorsLegend />

          {/* Edit Form - Same structure as Nueva Historia */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column - Primary Tables */}
            <div className="space-y-6">
              {/* 1. TABLA: historias (55 columns) */}
              <HistoriasSection
                data={editForm.historias}
                setData={(data) => setEditForm(prev => ({ ...prev, historias: data }))}
              />

              {/* 2. TABLA: ubicaciones (24 columns) */}
              <UbicacionesSection
                data={editForm.ubicacion}
                setData={(data) => setEditForm(prev => ({ ...prev, ubicacion: data }))}
              />

              {/* 3. TABLA: contexto_ambiental (17 columns) */}
              <ContextoAmbientalSection
                data={editForm.contexto_ambiental}
                setData={(data) => setEditForm(prev => ({ ...prev, contexto_ambiental: data }))}
              />

              {/* 4. TABLA: factores_credibilidad (13 columns) */}
              <FactoresCredibilidadSection
                data={editForm.factores_credibilidad}
                setData={(data) => setEditForm(prev => ({ ...prev, factores_credibilidad: data }))}
              />

              {/* 5. TABLA: derechos (9 columns) */}
              <DerechosSection
                data={editForm.derechos}
                setData={(data) => setEditForm(prev => ({ ...prev, derechos: data }))}
              />
            </div>

            {/* Right Column - Related Tables */}
            <div className="space-y-6">
              {/* 6. TABLA: archivos_multimedia (23 columns) */}
              <ArchivosMultimediaSection
                audioFile={audioFile}
                setAudioFile={setAudioFile}
                imageFile={imageFile}
                setImageFile={setImageFile}
                isUploadingFiles={isUploadingFiles}
                handleFileUpload={handleFileUpload}
                data={editForm.archivos_multimedia}
                setData={(data) => setEditForm(prev => ({ ...prev, archivos_multimedia: data }))}
              />

              {/* 7. TABLA: testigos (15 columns) */}
              <TestigosSection
                testigo_principal={editForm.testigo_principal}
                testigos_secundarios={editForm.testigos_secundarios}
                setTestigoPrincipal={(data) => setEditForm(prev => ({ ...prev, testigo_principal: data }))}
                setTestigosSecundarios={(data) => setEditForm(prev => ({ ...prev, testigos_secundarios: data }))}
                addTestigoSecundario={addTestigoSecundario}
                removeTestigoSecundario={removeTestigoSecundario}
                updateTestigoSecundario={updateTestigoSecundario}
              />

              {/* 8. TABLA: entidades_paranormales (23 columns) */}
              <EntidadesParanormalesSection
                data={editForm.entidades_paranormales}
                setData={(data) => setEditForm(prev => ({ ...prev, entidades_paranormales: data }))}
              />

              {/* 9. TABLA: elementos_clave (7 columns) */}
              <ElementosClaveSection
                data={editForm.elementos_clave}
                setData={(data) => setEditForm(prev => ({ ...prev, elementos_clave: data }))}
              />

              {/* 10. TABLA: performance_esperado (7 columns) */}
              <PerformanceEsperadoSection
                data={editForm.performance_esperado}
                setData={(data) => setEditForm(prev => ({ ...prev, performance_esperado: data }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
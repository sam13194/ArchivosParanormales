'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Upload, RotateCcw, Save, FileText, Database
} from "lucide-react";

// Componentes organizados por tabla de DB
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
import JsonLoader from './JsonLoader';
import { FieldIndicatorsLegend } from './shared/FieldIndicators';

interface NewStoryFormData {
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

interface NuevaHistoriaProps {
  newStoryForm: NewStoryFormData;
  setNewStoryForm: (form: NewStoryFormData | ((prev: NewStoryFormData) => NewStoryFormData)) => void;
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  jsonFile: File | null;
  setJsonFile: (file: File | null) => void;
  isUploadingFiles: boolean;
  isSubmittingStory: boolean;
  isLoadingJson: boolean;
  validationErrors: string[];
  handleFileUpload: (file: File, type: 'audio' | 'image') => Promise<void>;
  handleJsonLoad: (file: File) => Promise<void>;
  downloadJsonTemplate: () => void;
  clearForm: () => void;
  createNewStory: () => Promise<void>;
  addTestigoSecundario: () => void;
  removeTestigoSecundario: (index: number) => void;
  updateTestigoSecundario: (index: number, field: string, value: any) => void;
}

export default function NuevaHistoria({
  newStoryForm,
  setNewStoryForm,
  audioFile,
  setAudioFile,
  imageFile,
  setImageFile,
  jsonFile,
  setJsonFile,
  isUploadingFiles,
  isSubmittingStory,
  isLoadingJson,
  validationErrors,
  handleFileUpload,
  handleJsonLoad,
  downloadJsonTemplate,
  clearForm,
  createNewStory,
  addTestigoSecundario,
  removeTestigoSecundario,
  updateTestigoSecundario
}: NuevaHistoriaProps) {
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            Nueva Historia
          </h2>
          <p className="text-muted-foreground">
            Formulario estructurado según las tablas de la base de datos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearForm} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
          <Button 
            onClick={createNewStory}
            disabled={isSubmittingStory}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmittingStory ? 'Guardando...' : 'Guardar Historia'}
          </Button>
        </div>
      </div>

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

      {/* Database Table Structure Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estructura de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 text-sm mb-3">
            Este formulario está organizado según las tablas de la base de datos para facilitar el mapeo:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <Badge variant="outline" className="text-blue-700">historias (55 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">ubicaciones (24 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">testigos (15 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">entidades_paranormales (23 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">contexto_ambiental (17 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">archivos_multimedia (23 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">elementos_clave (7 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">factores_credibilidad (13 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">derechos (9 cols)</Badge>
            <Badge variant="outline" className="text-blue-700">performance_esperado (7 cols)</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column - Primary Tables */}
        <div className="space-y-6">
          {/* 1. TABLA: historias (55 columns) */}
          <HistoriasSection
            data={newStoryForm.historias}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, historias: data }))}
          />

          {/* 2. TABLA: ubicaciones (24 columns) */}
          <UbicacionesSection
            data={newStoryForm.ubicacion}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, ubicacion: data }))}
          />

          {/* 3. TABLA: contexto_ambiental (17 columns) */}
          <ContextoAmbientalSection
            data={newStoryForm.contexto_ambiental}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, contexto_ambiental: data }))}
          />

          {/* 4. TABLA: factores_credibilidad (13 columns) */}
          <FactoresCredibilidadSection
            data={newStoryForm.factores_credibilidad}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, factores_credibilidad: data }))}
          />

          {/* 5. TABLA: derechos (9 columns) */}
          <DerechosSection
            data={newStoryForm.derechos}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, derechos: data }))}
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
            data={newStoryForm.archivos_multimedia}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, archivos_multimedia: data }))}
          />

          {/* 7. TABLA: testigos (15 columns) */}
          <TestigosSection
            testigo_principal={newStoryForm.testigo_principal}
            testigos_secundarios={newStoryForm.testigos_secundarios}
            setTestigoPrincipal={(data) => setNewStoryForm(prev => ({ ...prev, testigo_principal: data }))}
            setTestigosSecundarios={(data) => setNewStoryForm(prev => ({ ...prev, testigos_secundarios: data }))}
            addTestigoSecundario={addTestigoSecundario}
            removeTestigoSecundario={removeTestigoSecundario}
            updateTestigoSecundario={updateTestigoSecundario}
          />

          {/* 8. TABLA: entidades_paranormales (23 columns) */}
          <EntidadesParanormalesSection
            data={newStoryForm.entidades_paranormales}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, entidades_paranormales: data }))}
          />

          {/* 9. TABLA: elementos_clave (7 columns) */}
          <ElementosClaveSection
            data={newStoryForm.elementos_clave}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, elementos_clave: data }))}
          />

          {/* 10. TABLA: performance_esperado (7 columns) */}
          <PerformanceEsperadoSection
            data={newStoryForm.performance_esperado}
            setData={(data) => setNewStoryForm(prev => ({ ...prev, performance_esperado: data }))}
          />
        </div>
      </div>
    </div>
  );
}
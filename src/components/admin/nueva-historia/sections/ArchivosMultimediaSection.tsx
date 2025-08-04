'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, FileAudio, FileVideo, Plus, Trash2, Database, Check, AlertCircle } from "lucide-react";


interface ArchivoMultimedia {
  tipo_archivo: string;
  nombre_archivo: string;
  url_archivo: string;
  descripcion_archivo: string;
  tamaño_bytes: number;
  duracion_segundos: number;
  calidad_archivo: string;
  fecha_creacion: string;
  fuente_archivo: string;
  derechos_autor: string;
  evidencia_paranormal: boolean;
  relevancia_historia: number;
  timestamp_evento: string;
  coordenadas_captura: string;
  dispositivo_captura: string;
  condiciones_captura: string;
  procesamiento_aplicado: string;
  metadata_tecnica: any;
  verificacion_autenticidad: string;
  analisis_experto: string;
  transcripcion_texto: string;
  palabras_clave: string[];
  acceso_publico: boolean;
}

interface ArchivosMultimediaSectionProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isUploadingFiles: boolean;
  handleFileUpload: (file: File, type: 'audio' | 'image') => Promise<void>;
  data: ArchivoMultimedia[];
  setData: (data: ArchivoMultimedia[]) => void;
}

function ArchivoForm({ 
  data, 
  updateField, 
  onRemove,
  index 
}: { 
  data: ArchivoMultimedia; 
  updateField: (field: string, value: any) => void;
  onRemove: () => void;
  index: number;
}) {
  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'audio': return <FileAudio className="h-4 w-4" />;
      case 'imagen': return <FileImage className="h-4 w-4" />;
      case 'video': return <FileVideo className="h-4 w-4" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4 pl-6 border-l-2 border-gray-200">
      {/* Header con tipo de archivo y botón eliminar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getFileIcon(data.tipo_archivo)}
          <h5 className="font-medium text-sm">
            Archivo #{index + 1}: {data.nombre_archivo || 'Sin nombre'}
          </h5>
          <Badge variant="outline" className="text-xs">
            {data.tipo_archivo || 'Sin tipo'}
          </Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Información Básica del Archivo */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          📁 INFORMACIÓN BÁSICA
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* tipo_archivo */}
          <div className="space-y-2">
            <Label htmlFor="tipo_archivo">Tipo de Archivo *</Label>
            <Select 
              value={data.tipo_archivo || ''}
              onValueChange={(value) => updateField('tipo_archivo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="imagen">Imagen</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="documento">Documento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* nombre_archivo */}
          <div className="space-y-2">
            <Label htmlFor="nombre_archivo">Nombre del Archivo *</Label>
            <Input
              placeholder="Nombre descriptivo del archivo"
              value={data.nombre_archivo || ''}
              onChange={(e) => updateField('nombre_archivo', e.target.value)}
            />
          </div>

          {/* url_archivo */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="url_archivo">URL del Archivo *</Label>
            <Input
              placeholder="URL donde está almacenado el archivo"
              value={data.url_archivo || ''}
              onChange={(e) => updateField('url_archivo', e.target.value)}
              readOnly={data.url_archivo?.startsWith('http')} // Make read-only if it's a real URL
            />
            {data.url_archivo?.startsWith('http') && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                URL generada automáticamente
              </p>
            )}
          </div>
        </div>

        {/* descripcion_archivo */}
        <div className="space-y-2">
          <Label htmlFor="descripcion_archivo">Descripción del Archivo</Label>
          <Textarea
            placeholder="Describe el contenido y contexto del archivo"
            rows={2}
            value={data.descripcion_archivo || ''}
            onChange={(e) => updateField('descripcion_archivo', e.target.value)}
          />
        </div>
      </div>

      {/* Características Técnicas */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          ⚙️ CARACTERÍSTICAS TÉCNICAS
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* tamaño_bytes */}
          <div className="space-y-2">
            <Label htmlFor="tamaño_bytes">Tamaño (bytes)</Label>
            <Input
              type="number"
              min="0"
              placeholder="Tamaño del archivo en bytes"
              value={data.tamaño_bytes || ''}
              onChange={(e) => updateField('tamaño_bytes', parseInt(e.target.value) || 0)}
              readOnly={data.tamaño_bytes > 0} // Auto-populated field
            />
            {data.tamaño_bytes > 0 && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                {(data.tamaño_bytes / 1024 / 1024).toFixed(2)} MB - Detectado automáticamente
              </p>
            )}
          </div>

          {/* duracion_segundos */}
          <div className="space-y-2">
            <Label htmlFor="duracion_segundos">Duración (segundos)</Label>
            <Input
              type="number"
              min="0"
              placeholder="Para audio/video"
              value={data.duracion_segundos || ''}
              onChange={(e) => updateField('duracion_segundos', parseInt(e.target.value) || 0)}
            />
            {data.duracion_segundos > 0 && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                {Math.floor(data.duracion_segundos / 60)}:{(data.duracion_segundos % 60).toString().padStart(2, '0')} min
              </p>
            )}
          </div>

          {/* calidad_archivo */}
          <div className="space-y-2">
            <Label>Calidad del Archivo</Label>
            <Select 
              value={data.calidad_archivo || ''}
              onValueChange={(value) => updateField('calidad_archivo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona calidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="profesional">Profesional</SelectItem>
                <SelectItem value="amateur">Amateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* fecha_creacion */}
          <div className="space-y-2">
            <Label>Fecha de Creación</Label>
            <Input
              type="date"
              value={data.fecha_creacion || ''}
              onChange={(e) => updateField('fecha_creacion', e.target.value)}
            />
          </div>
        </div>

        {/* dispositivo_captura */}
        <div className="space-y-2">
          <Label>Dispositivo de Captura</Label>
          <Input
            placeholder="Ej: iPhone 12, Canon EOS, Grabadora Sony"
            value={data.dispositivo_captura || ''}
            onChange={(e) => updateField('dispositivo_captura', e.target.value)}
          />
        </div>
      </div>

      {/* Contexto de Captura */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          📍 CONTEXTO DE CAPTURA
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* timestamp_evento */}
          <div className="space-y-2">
            <Label>Timestamp del Evento</Label>
            <Input
              type="datetime-local"
              value={data.timestamp_evento || ''}
              onChange={(e) => updateField('timestamp_evento', e.target.value)}
            />
          </div>

          {/* coordenadas_captura */}
          <div className="space-y-2">
            <Label>Coordenadas de Captura</Label>
            <Input
              placeholder="Lat, Lng donde se capturó"
              value={data.coordenadas_captura || ''}
              onChange={(e) => updateField('coordenadas_captura', e.target.value)}
            />
          </div>
        </div>

        {/* condiciones_captura */}
        <div className="space-y-2">
          <Label>Condiciones de Captura</Label>
          <Textarea
            placeholder="Describe las condiciones durante la captura: iluminación, ruido, etc."
            rows={2}
            value={data.condiciones_captura || ''}
            onChange={(e) => updateField('condiciones_captura', e.target.value)}
          />
        </div>
      </div>

      {/* Relevancia y Análisis */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          🔍 RELEVANCIA Y ANÁLISIS
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* relevancia_historia */}
          <div className="space-y-2">
            <Label>Relevancia Historia (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={data.relevancia_historia || ''}
              onChange={(e) => updateField('relevancia_historia', parseInt(e.target.value) || 1)}
            />
          </div>

          {/* verificacion_autenticidad */}
          <div className="space-y-2">
            <Label>Verificación Autenticidad</Label>
            <Select 
              value={data.verificacion_autenticidad || ''}
              onValueChange={(value) => updateField('verificacion_autenticidad', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado verificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_verificado">No Verificado</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="verificado">Verificado</SelectItem>
                <SelectItem value="dudoso">Dudoso</SelectItem>
                <SelectItem value="falso">Falso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* evidencia_paranormal */}
          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              checked={data.evidencia_paranormal || false}
              onCheckedChange={(checked) => updateField('evidencia_paranormal', checked as boolean)}
            />
            <Label>¿Contiene evidencia paranormal?</Label>
          </div>

          {/* acceso_publico */}
          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              checked={data.acceso_publico || false}
              onCheckedChange={(checked) => updateField('acceso_publico', checked as boolean)}
            />
            <Label>Acceso público permitido</Label>
          </div>
        </div>

        {/* analisis_experto */}
        <div className="space-y-2">
          <Label>Análisis de Experto</Label>
          <Textarea
            placeholder="Análisis técnico o de expertos sobre el archivo"
            rows={2}
            value={data.analisis_experto || ''}
            onChange={(e) => updateField('analisis_experto', e.target.value)}
          />
        </div>

        {/* transcripcion_texto */}
        <div className="space-y-2">
          <Label>Transcripción de Texto</Label>
          <Textarea
            placeholder="Para archivos de audio: transcripción del contenido hablado"
            rows={3}
            value={data.transcripcion_texto || ''}
            onChange={(e) => updateField('transcripcion_texto', e.target.value)}
          />
        </div>
      </div>

      {/* Metadatos y Derechos */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          ⚖️ METADATOS Y DERECHOS
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* fuente_archivo */}
          <div className="space-y-2">
            <Label htmlFor="fuente_archivo">Fuente del Archivo *</Label>
            <Input
              placeholder="Quién proporcionó el archivo"
              value={data.fuente_archivo || ''}
              onChange={(e) => updateField('fuente_archivo', e.target.value)}
            />
          </div>

          {/* derechos_autor */}
          <div className="space-y-2">
            <Label htmlFor="derechos_autor">Derechos de Autor *</Label>
            <Input
              placeholder="Información sobre derechos"
              value={data.derechos_autor || ''}
              onChange={(e) => updateField('derechos_autor', e.target.value)}
            />
          </div>
        </div>

        {/* procesamiento_aplicado */}
        <div className="space-y-2">
          <Label>Procesamiento Aplicado</Label>
          <Textarea
            placeholder="Describe cualquier edición o procesamiento aplicado al archivo"
            rows={2}
            value={data.procesamiento_aplicado || ''}
            onChange={(e) => updateField('procesamiento_aplicado', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default function ArchivosMultimediaSection({
  audioFile,
  setAudioFile,
  imageFile,
  setImageFile,
  isUploadingFiles,
  handleFileUpload,
  data,
  setData
}: ArchivosMultimediaSectionProps) {
  
  const addArchivo = () => {
    const nuevoArchivo: ArchivoMultimedia = {
      tipo_archivo: '',
      nombre_archivo: '',
      url_archivo: '',
      descripcion_archivo: '',
      tamaño_bytes: 0,
      duracion_segundos: 0,
      calidad_archivo: '',
      fecha_creacion: '',
      fuente_archivo: '',
      derechos_autor: '',
      evidencia_paranormal: false,
      relevancia_historia: 1,
      timestamp_evento: '',
      coordenadas_captura: '',
      dispositivo_captura: '',
      condiciones_captura: '',
      procesamiento_aplicado: '',
      metadata_tecnica: {},
      verificacion_autenticidad: '',
      analisis_experto: '',
      transcripcion_texto: '',
      palabras_clave: [],
      acceso_publico: false
    };
    setData([...data, nuevoArchivo]);
  };

  const removeArchivo = (index: number) => {
    const nuevosArchivos = data.filter((_, i) => i !== index);
    setData(nuevosArchivos);
  };

  const updateArchivo = (index: number, field: string, value: any) => {
    const nuevosArchivos = [...data];
    nuevosArchivos[index] = { ...nuevosArchivos[index], [field]: value };
    setData(nuevosArchivos);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: archivos_multimedia
          <Badge variant="secondary" className="text-xs">23 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Sección de Upload Rápido */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📤 UPLOAD RÁPIDO
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Audio Upload */}
            <div className="space-y-2">
              <Label>Subir Audio</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudioFile(file);
                      handleFileUpload(file, 'audio');
                    }
                  }}
                  disabled={isUploadingFiles}
                />
                {audioFile && (
                  <Badge variant="outline">
                    {audioFile.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Subir Imagen</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      handleFileUpload(file, 'image');
                    }
                  }}
                  disabled={isUploadingFiles}
                />
                {imageFile && (
                  <Badge variant="outline">
                    {imageFile.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isUploadingFiles && (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">Subiendo archivos...</p>
            </div>
          )}
        </div>

        {/* Archivos Detallados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1 flex-1">
              📁 ARCHIVOS MULTIMEDIA DETALLADOS ({data.length})
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addArchivo}
              className="ml-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar Archivo
            </Button>
          </div>
          
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay archivos multimedia registrados</p>
              <p className="text-xs">Usa el upload rápido arriba o haz clic en "Agregar Archivo" para más detalles</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.map((archivo, index) => (
                <ArchivoForm
                  key={index}
                  data={archivo}
                  updateField={(field, value) => updateArchivo(index, field, value)}
                  onRemove={() => removeArchivo(index)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
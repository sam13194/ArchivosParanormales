'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Database, Clock } from "lucide-react";
import { useState } from 'react';

interface HistoriasSectionProps {
  data: {
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
  setData: (data: any) => void;
}

export default function HistoriasSection({ data, setData }: HistoriasSectionProps) {
  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: historias
          <Badge variant="secondary" className="text-xs">55 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Información Básica de la Historia */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📝 INFORMACIÓN BÁSICA
          </h4>
          
          {/* titulo_provisional */}
          <div className="space-y-2">
            <Label htmlFor="titulo_provisional">Título Provisional *</Label>
            <Input
              id="titulo_provisional"
              placeholder="Ej: La Casa Embrujada de la Candelaria"
              value={data.titulo_provisional || ''}
              onChange={(e) => updateField('titulo_provisional', e.target.value)}
            />
          </div>

          {/* descripcion_corta */}
          <div className="space-y-2">
            <Label htmlFor="descripcion_corta">Descripción Corta *</Label>
            <Textarea
              id="descripcion_corta"
              placeholder="Resumen breve de la historia (máximo 150 caracteres)"
              rows={2}
              maxLength={150}
              value={data.descripcion_corta || ''}
              onChange={(e) => updateField('descripcion_corta', e.target.value)}
            />
            <div className="text-right text-xs text-muted-foreground">
              {(data.descripcion_corta || '').length}/150
            </div>
          </div>

          {/* descripcion_larga */}
          <div className="space-y-2">
            <Label htmlFor="descripcion_larga">Descripción Larga</Label>
            <Textarea
              id="descripcion_larga"
              placeholder="Descripción detallada de la historia"
              rows={3}
              value={data.descripcion_larga || ''}
              onChange={(e) => updateField('descripcion_larga', e.target.value)}
            />
          </div>

          {/* suceso_principal_resumen */}
          <div className="space-y-2">
            <Label htmlFor="suceso_principal_resumen">Suceso Principal (Resumen)</Label>
            <Textarea
              id="suceso_principal_resumen"
              placeholder="Resumen del evento principal"
              rows={2}
              value={data.suceso_principal_resumen || ''}
              onChange={(e) => updateField('suceso_principal_resumen', e.target.value)}
            />
          </div>

          {/* protagonistas_descripcion */}
          <div className="space-y-2">
            <Label htmlFor="protagonistas_descripcion">Descripción de Protagonistas</Label>
            <Input
              id="protagonistas_descripcion"
              placeholder="Ej: María López, 35 años, ama de casa"
              value={data.protagonistas_descripcion || ''}
              onChange={(e) => updateField('protagonistas_descripcion', e.target.value)}
            />
          </div>
        </div>

        {/* Contenido del Testimonio */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🎤 CONTENIDO DEL TESTIMONIO
          </h4>

          {/* testimonio_completo */}
          <div className="space-y-2">
            <Label htmlFor="testimonio_completo">Testimonio Completo *</Label>
            <Textarea
              id="testimonio_completo"
              placeholder="Testimonio completo tal como fue relatado..."
              rows={6}
              value={data.testimonio_completo || ''}
              onChange={(e) => updateField('testimonio_completo', e.target.value)}
            />
          </div>

          {/* extracto_verbatim */}
          <div className="space-y-2">
            <Label htmlFor="extracto_verbatim">Extracto Verbatim</Label>
            <Textarea
              id="extracto_verbatim"
              placeholder="Frase o párrafo exacto más impactante del testimonio"
              rows={2}
              value={data.extracto_verbatim || ''}
              onChange={(e) => updateField('extracto_verbatim', e.target.value)}
            />
          </div>

          {/* historia_reescrita */}
          <div className="space-y-2">
            <Label htmlFor="historia_reescrita">Historia Reescrita</Label>
            <Textarea
              id="historia_reescrita"
              placeholder="Versión narrativa y literaria de la historia"
              rows={4}
              value={data.historia_reescrita || ''}
              onChange={(e) => updateField('historia_reescrita', e.target.value)}
            />
          </div>

          {/* longitud_extracto_palabras */}
          <div className="space-y-2">
            <Label htmlFor="longitud_extracto_palabras">Longitud Extracto (Palabras)</Label>
            <Input
              id="longitud_extracto_palabras"
              type="number"
              placeholder="Número de palabras del extracto"
              value={data.longitud_extracto_palabras || ''}
              onChange={(e) => updateField('longitud_extracto_palabras', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Clasificación */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🏷️ CLASIFICACIÓN
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {/* fuente_relato */}
            <div className="space-y-2">
              <Label htmlFor="fuente_relato">Fuente del Relato *</Label>
              <Select 
                value={data.fuente_relato || ''}
                onValueChange={(value) => updateField('fuente_relato', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llamada_oyente">Llamada de Oyente</SelectItem>
                  <SelectItem value="historia_programa">Historia del Programa</SelectItem>
                  <SelectItem value="investigacion_propia">Investigación Propia</SelectItem>
                  <SelectItem value="anonimo">Anónimo</SelectItem>
                  <SelectItem value="redes_sociales">Redes Sociales</SelectItem>
                  <SelectItem value="correo_electronico">Correo Electrónico</SelectItem>
                  <SelectItem value="entrevista_presencial">Entrevista Presencial</SelectItem>
                  <SelectItem value="testimonio_escrito">Testimonio Escrito</SelectItem>
                  <SelectItem value="tercera_persona">Tercera Persona</SelectItem>
                  <SelectItem value="archivo_historico">Archivo Histórico</SelectItem>
                  <SelectItem value="periodico_local">Periódico Local</SelectItem>
                  <SelectItem value="transmision_tv">Transmisión TV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* genero_principal */}
            <div className="space-y-2">
              <Label htmlFor="genero_principal">Género Principal *</Label>
              <Select 
                value={data.genero_principal || ''}
                onValueChange={(value) => updateField('genero_principal', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paranormal">Paranormal</SelectItem>
                  <SelectItem value="fantasmas_apariciones">Fantasmas y Apariciones</SelectItem>
                  <SelectItem value="ovnis_extraterrestres">OVNIs y Extraterrestres</SelectItem>
                  <SelectItem value="criptozoologia">Criptozoología</SelectItem>
                  <SelectItem value="lugares_malditos">Lugares Malditos</SelectItem>
                  <SelectItem value="terror_psicologico">Terror Psicológico</SelectItem>
                  <SelectItem value="poltergeist">Poltergeist</SelectItem>
                  <SelectItem value="posesiones">Posesiones</SelectItem>
                  <SelectItem value="casas_embrujadas">Casas Embrujadas</SelectItem>
                  <SelectItem value="experiencias_cercanas_muerte">Experiencias Cercanas a la Muerte</SelectItem>
                  <SelectItem value="premoniciones">Premoniciones</SelectItem>
                  <SelectItem value="rituales_ocultismo">Rituales y Ocultismo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* epoca_historica */}
          <div className="space-y-2">
            <Label htmlFor="epoca_historica">Época Histórica</Label>
            <Input
              id="epoca_historica"
              placeholder="Ej: Contemporánea, Siglo XX, Colonial"
              value={data.epoca_historica || ''}
              onChange={(e) => updateField('epoca_historica', e.target.value)}
            />
          </div>

          {/* nivel_verificacion */}
          <div className="space-y-2">
            <Label htmlFor="nivel_verificacion">Nivel de Verificación</Label>
            <Select 
              value={data.nivel_verificacion || ''}
              onValueChange={(value) => updateField('nivel_verificacion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sin_verificar">Sin Verificar</SelectItem>
                <SelectItem value="testimonio_unico">Testimonio Único</SelectItem>
                <SelectItem value="multiples_testigos">Múltiples Testigos</SelectItem>
                <SelectItem value="evidencia_fisica">Evidencia Física</SelectItem>
                <SelectItem value="investigacion_completa">Investigación Completa</SelectItem>
                <SelectItem value="verificado_experto">Verificado por Experto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Métricas de Evaluación */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📊 MÉTRICAS DE EVALUACIÓN
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {/* nivel_credibilidad */}
            <div className="space-y-2">
              <Label htmlFor="nivel_credibilidad">Nivel de Credibilidad (0-5)</Label>
              <Input
                id="nivel_credibilidad"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={data.nivel_credibilidad || ''}
                onChange={(e) => updateField('nivel_credibilidad', parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* nivel_impacto */}
            <div className="space-y-2">
              <Label htmlFor="nivel_impacto">Nivel de Impacto (1-5)</Label>
              <Input
                id="nivel_impacto"
                type="number"
                min="1"
                max="5"
                value={data.nivel_impacto || ''}
                onChange={(e) => updateField('nivel_impacto', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* ponderacion_impacto */}
            <div className="space-y-2">
              <Label htmlFor="ponderacion_impacto">Ponderación Impacto (1-5)</Label>
              <Input
                id="ponderacion_impacto"
                type="number"
                min="1"
                max="5"
                value={data.ponderacion_impacto || ''}
                onChange={(e) => updateField('ponderacion_impacto', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* potencial_adaptacion */}
            <div className="space-y-2">
              <Label htmlFor="potencial_adaptacion">Potencial Adaptación (1-3)</Label>
              <Input
                id="potencial_adaptacion"
                type="number"
                min="1"
                max="3"
                value={data.potencial_adaptacion || ''}
                onChange={(e) => updateField('potencial_adaptacion', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>

        {/* Fechas y Temporalidad */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📅 FECHAS Y TEMPORALIDAD
          </h4>

          <div className="grid grid-cols-3 gap-4">
            {/* fecha_sucesos */}
            <div className="space-y-2">
              <Label htmlFor="fecha_sucesos">Fecha de Sucesos</Label>
              <Input
                id="fecha_sucesos"
                type="text"
                value={data.fecha_sucesos || 'Desconocido'}
                onChange={(e) => updateField('fecha_sucesos', e.target.value)}
                onFocus={() => {
                  if (data.fecha_sucesos === 'Desconocido') {
                    updateField('fecha_sucesos', '');
                  }
                }}
                onBlur={() => {
                  if (data.fecha_sucesos === '') {
                    updateField('fecha_sucesos', 'Desconocido');
                  }
                }}
                placeholder="Ej: 2023-01-15, 1995-2005, Desconocido"
                className={data.fecha_sucesos === 'Desconocido' ? 'text-muted-foreground cursor-pointer' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Acepta fechas exactas (YYYY-MM-DD), intervalos (YYYY-YYYY) o "Desconocido"
              </p>
            </div>

            {/* fecha_evento_inicio */}
            <div className="space-y-2">
              <Label htmlFor="fecha_evento_inicio">Fecha Evento Inicio</Label>
              <Input
                id="fecha_evento_inicio"
                type={data.fecha_evento_inicio === 'Desconocido' ? 'text' : 'date'}
                value={data.fecha_evento_inicio || 'Desconocido'}
                onChange={(e) => updateField('fecha_evento_inicio', e.target.value)}
                onFocus={() => {
                  if (data.fecha_evento_inicio === 'Desconocido') {
                    updateField('fecha_evento_inicio', '');
                  }
                }}
                onBlur={() => {
                  if (data.fecha_evento_inicio === '') {
                    updateField('fecha_evento_inicio', 'Desconocido');
                  }
                }}
                placeholder="Desconocido"
                className={data.fecha_evento_inicio === 'Desconocido' ? 'text-muted-foreground cursor-pointer' : ''}
              />
            </div>

            {/* fecha_evento_fin */}
            <div className="space-y-2">
              <Label htmlFor="fecha_evento_fin">Fecha Evento Fin</Label>
              <Input
                id="fecha_evento_fin"
                type={data.fecha_evento_fin === 'Desconocido' ? 'text' : 'date'}
                value={data.fecha_evento_fin || 'Desconocido'}
                onChange={(e) => updateField('fecha_evento_fin', e.target.value)}
                onFocus={() => {
                  if (data.fecha_evento_fin === 'Desconocido') {
                    updateField('fecha_evento_fin', '');
                  }
                }}
                onBlur={() => {
                  if (data.fecha_evento_fin === '') {
                    updateField('fecha_evento_fin', 'Desconocido');
                  }
                }}
                placeholder="Desconocido"
                className={data.fecha_evento_fin === 'Desconocido' ? 'text-muted-foreground cursor-pointer' : ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* hora_evento */}
            <div className="space-y-2">
              <Label htmlFor="hora_evento" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora del Evento
              </Label>
              <HoraEventoField 
                value={data.hora_evento || ''} 
                onChange={(value) => updateField('hora_evento', value)}
              />
            </div>

            {/* duracion_evento_minutos */}
            <div className="space-y-2">
              <Label htmlFor="duracion_evento_minutos">Duración Evento (minutos)</Label>
              <Input
                id="duracion_evento_minutos"
                type="number"
                min="0"
                value={data.duracion_evento_minutos || ''}
                onChange={(e) => updateField('duracion_evento_minutos', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* evento_recurrente */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="evento_recurrente"
              checked={data.evento_recurrente || false}
              onCheckedChange={(checked) => updateField('evento_recurrente', checked as boolean)}
            />
            <Label htmlFor="evento_recurrente">Evento Recurrente</Label>
          </div>

          {/* patron_recurrencia */}
          <div className="space-y-2">
            <Label htmlFor="patron_recurrencia">Patrón de Recurrencia</Label>
            <Textarea
              id="patron_recurrencia"
              placeholder="Describe el patrón de repetición del evento"
              rows={2}
              value={data.patron_recurrencia || ''}
              onChange={(e) => updateField('patron_recurrencia', e.target.value)}
            />
          </div>
        </div>

        {/* Producción */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🎬 PRODUCCIÓN
          </h4>

          <div className="grid grid-cols-3 gap-4">
            {/* dificultad_produccion */}
            <div className="space-y-2">
              <Label htmlFor="dificultad_produccion">Dificultad Producción (1-5)</Label>
              <Input
                id="dificultad_produccion"
                type="number"
                min="1"
                max="5"
                value={data.dificultad_produccion || ''}
                onChange={(e) => updateField('dificultad_produccion', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* tiempo_produccion_estimado */}
            <div className="space-y-2">
              <Label htmlFor="tiempo_produccion_estimado">Tiempo Producción (min)</Label>
              <Input
                id="tiempo_produccion_estimado"
                type="number"
                min="0"
                value={data.tiempo_produccion_estimado || ''}
                onChange={(e) => updateField('tiempo_produccion_estimado', parseInt(e.target.value) || 0)}
              />
            </div>

            {/* presupuesto_estimado */}
            <div className="space-y-2">
              <Label htmlFor="presupuesto_estimado">Presupuesto Estimado (COP)</Label>
              <Input
                id="presupuesto_estimado"
                type="number"
                min="0"
                step="1000"
                value={data.presupuesto_estimado || ''}
                onChange={(e) => updateField('presupuesto_estimado', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Contenido y Advertencias */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            ⚠️ CONTENIDO Y ADVERTENCIAS
          </h4>
          
          {/* contenido_sensible */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contenido_sensible"
              checked={data.contenido_sensible || false}
              onCheckedChange={(checked) => updateField('contenido_sensible', checked as boolean)}
            />
            <Label htmlFor="contenido_sensible">Contenido Sensible</Label>
          </div>

          {/* advertencias */}
          <div className="space-y-2">
            <Label htmlFor="advertencias">Advertencias (separadas por comas)</Label>
            <Textarea
              id="advertencias"
              placeholder="Ej: Contenido violento, Lenguaje fuerte, Escenas perturbadoras"
              rows={2}
              value={data.advertencias?.join(', ') || ''}
              onChange={(e) => updateField('advertencias', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
          </div>
          
          {/* banderas_rojas */}
          <div className="space-y-2">
            <Label htmlFor="banderas_rojas">Banderas Rojas (separadas por comas)</Label>
            <Textarea
              id="banderas_rojas"
              placeholder="Ej: Inconsistencias temporales, Testigo bajo influencia"
              rows={2}
              value={data.banderas_rojas?.join(', ') || ''}
              onChange={(e) => updateField('banderas_rojas', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
          </div>
          
          {/* palabras_clave_patron */}
          <div className="space-y-2">
            <Label htmlFor="palabras_clave_patron">Palabras Clave del Patrón</Label>
            <Input
              id="palabras_clave_patron"
              placeholder="Ej: recurrente, nocturno, familiar"
              value={data.palabras_clave_patron?.join(', ') || ''}
              onChange={(e) => updateField('palabras_clave_patron', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
          </div>

          {/* edad_minima_recomendada */}
          <div className="space-y-2">
            <Label htmlFor="edad_minima_recomendada">Edad Mínima Recomendada</Label>
            <Input
              id="edad_minima_recomendada"
              type="number"
              min="0"
              max="18"
              value={data.edad_minima_recomendada || ''}
              onChange={(e) => updateField('edad_minima_recomendada', parseInt(e.target.value) || 0)}
            />
          </div>

          {/* duracion_impacto_emocional */}
          <div className="space-y-2">
            <Label htmlFor="duracion_impacto_emocional">Duración Impacto Emocional</Label>
            <Select 
              value={data.duracion_impacto_emocional || ''}
              onValueChange={(value) => updateField('duracion_impacto_emocional', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la duración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="intenso">Intenso</SelectItem>
                <SelectItem value="permanente">Permanente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📋 INFORMACIÓN ADICIONAL
          </h4>

          {/* notas_adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notas_adicionales">Notas Adicionales</Label>
            <Textarea
              id="notas_adicionales"
              placeholder="Información adicional relevante sobre la historia"
              rows={3}
              value={data.notas_adicionales || ''}
              onChange={(e) => updateField('notas_adicionales', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* hash_similarity */}
            <div className="space-y-2">
              <Label htmlFor="hash_similarity">Hash Similarity</Label>
              <Input
                id="hash_similarity"
                placeholder="Hash para detectar duplicados"
                value={data.hash_similarity || ''}
                onChange={(e) => updateField('hash_similarity', e.target.value)}
              />
            </div>

            {/* codigo_unico */}
            <div className="space-y-2">
              <Label htmlFor="codigo_unico">Código Único</Label>
              <Input
                id="codigo_unico"
                placeholder="Código identificador único"
                value={data.codigo_unico || ''}
                onChange={(e) => updateField('codigo_unico', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* fecha_transcripcion */}
            <div className="space-y-2">
              <Label htmlFor="fecha_transcripcion">Fecha Transcripción</Label>
              <Input
                id="fecha_transcripcion"
                type="date"
                value={data.fecha_transcripcion || ''}
                onChange={(e) => updateField('fecha_transcripcion', e.target.value)}
              />
            </div>

            {/* estado_procesamiento */}
            <div className="space-y-2">
              <Label htmlFor="estado_procesamiento">Estado Procesamiento</Label>
              <Select 
                value={data.estado_procesamiento || ''}
                onValueChange={(value) => updateField('estado_procesamiento', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extraida">Extraída</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                  <SelectItem value="aprobada">Aprobada</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                  <SelectItem value="publicada">Publicada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* publicar_inmediatamente */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="publicar_inmediatamente"
              checked={data.publicar_inmediatamente || false}
              onCheckedChange={(checked) => updateField('publicar_inmediatamente', checked as boolean)}
            />
            <Label htmlFor="publicar_inmediatamente">Publicar Inmediatamente</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para manejar hora_evento con formato flexible
function HoraEventoField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [mode, setMode] = useState<'time' | 'text'>(
    // Determinar modo inicial basado en el valor actual
    value && (value.includes(':') || /^\d{2}:\d{2}/.test(value)) ? 'time' : 'text'
  );

  const textualOptions = [
    'Nocturno', 'Madrugada', 'Amanecer', 'Mañana', 'Mediodía', 
    'Tarde', 'Atardecer', 'Noche', 'Media noche', 'Desconocido'
  ];

  const handleTimeChange = (newValue: string) => {
    // Convertir de HH:MM a HH:MM:SS si es necesario
    if (newValue && !newValue.includes(':00')) {
      newValue = newValue + ':00';
    }
    onChange(newValue);
  };

  const getTimeValue = () => {
    if (mode === 'time' && value && value.includes(':')) {
      // Extraer solo HH:MM del formato HH:MM:SS
      return value.split(':').slice(0, 2).join(':');
    }
    return '';
  };

  return (
    <div className="space-y-2">
      {/* Selector de modo */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === 'time' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('time')}
        >
          Hora específica
        </Button>
        <Button
          type="button"
          variant={mode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('text')}
        >
          Descripción
        </Button>
      </div>

      {/* Campo según el modo */}
      {mode === 'time' ? (
        <Input
          type="time"
          value={getTimeValue()}
          onChange={(e) => handleTimeChange(e.target.value)}
          placeholder="Selecciona hora específica"
        />
      ) : (
        <div className="space-y-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona momento del día" />
            </SelectTrigger>
            <SelectContent>
              {textualOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Campo de texto libre para valores personalizados */}
          <Input
            placeholder="O escribe un valor personalizado..."
            value={!textualOptions.includes(value) ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
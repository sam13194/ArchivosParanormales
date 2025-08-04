'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Cloud, Database } from "lucide-react";
import { useState, useEffect } from 'react';

interface ContextoAmbientalSectionProps {
  data: {
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
  setData: (data: any) => void;
}

export default function ContextoAmbientalSection({ data, setData }: ContextoAmbientalSectionProps) {
  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: contexto_ambiental
          <Badge variant="secondary" className="text-xs">17 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Condiciones Atmosféricas */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🌤️ CONDICIONES ATMOSFÉRICAS
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* clima */}
            <div className="space-y-2">
              <Label htmlFor="clima">Clima</Label>
              <ClimaField 
                value={data.clima || ''} 
                onChange={(value) => updateField('clima', value)}
              />
            </div>

            {/* temperatura */}
            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura</Label>
              <Input
                id="temperatura"
                placeholder="Ej: 18°C, Templado, Frío"
                value={data.temperatura || ''}
                onChange={(e) => updateField('temperatura', e.target.value)}
              />
            </div>

            {/* humedad */}
            <div className="space-y-2">
              <Label htmlFor="humedad">Humedad</Label>
              <Input
                id="humedad"
                placeholder="Ej: 65%, Alta, Normal"
                value={data.humedad || ''}
                onChange={(e) => updateField('humedad', e.target.value)}
              />
            </div>

            {/* condiciones_luz */}
            <div className="space-y-2">
              <Label htmlFor="condiciones_luz">Condiciones de Luz</Label>
              <CondicionesLuzField 
                value={data.condiciones_luz || ''} 
                onChange={(value) => updateField('condiciones_luz', value)}
              />
            </div>
          </div>
        </div>

        {/* Ambiente Sonoro y Factores Externos */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🔊 AMBIENTE SONORO Y FACTORES EXTERNOS
          </h4>
          
          {/* ruidos_ambiente */}
          <div className="space-y-2">
            <Label htmlFor="ruidos_ambiente">Ruidos del Ambiente</Label>
            <Textarea
              id="ruidos_ambiente"
              placeholder="Describe los sonidos presentes durante el evento: tráfico, viento, animales, música, etc."
              rows={2}
              value={data.ruidos_ambiente || ''}
              onChange={(e) => updateField('ruidos_ambiente', e.target.value)}
            />
          </div>

          {/* factores_externos */}
          <div className="space-y-2">
            <Label htmlFor="factores_externos">Factores Externos</Label>
            <Textarea
              id="factores_externos"
              placeholder="Otros factores que podrían haber influido: construcciones cercanas, eventos locales, etc."
              rows={2}
              value={data.factores_externos || ''}
              onChange={(e) => updateField('factores_externos', e.target.value)}
            />
          </div>
        </div>

        {/* Contexto Social */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            👥 CONTEXTO SOCIAL
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* numero_personas */}
            <div className="space-y-2">
              <Label htmlFor="numero_personas">Número de Personas Presentes</Label>
              <Input
                id="numero_personas"
                type="number"
                min="0"
                placeholder="Cantidad de personas en el lugar"
                value={data.numero_personas || ''}
                onChange={(e) => updateField('numero_personas', parseInt(e.target.value) || 0)}
              />
            </div>

            {/* situacion_social */}
            <div className="space-y-2">
              <Label htmlFor="situacion_social">Situación Social</Label>
              <SituacionSocialField 
                value={data.situacion_social || ''} 
                onChange={(value) => updateField('situacion_social', value)}
              />
            </div>

            {/* estado_emocional */}
            <div className="space-y-2">
              <Label htmlFor="estado_emocional">Estado Emocional</Label>
              <Select 
                value={data.estado_emocional || ''}
                onValueChange={(value) => updateField('estado_emocional', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tranquilo">Tranquilo</SelectItem>
                  <SelectItem value="feliz">Feliz</SelectItem>
                  <SelectItem value="triste">Triste</SelectItem>
                  <SelectItem value="ansioso">Ansioso</SelectItem>
                  <SelectItem value="estresado">Estresado</SelectItem>
                  <SelectItem value="deprimido">Deprimido</SelectItem>
                  <SelectItem value="emocionado">Emocionado</SelectItem>
                  <SelectItem value="nervioso">Nervioso</SelectItem>
                  <SelectItem value="relajado">Relajado</SelectItem>
                  <SelectItem value="preocupado">Preocupado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* actividad_previa */}
            <div className="space-y-2">
              <Label htmlFor="actividad_previa">Actividad Previa</Label>
              <Input
                id="actividad_previa"
                placeholder="¿Qué estaba haciendo antes del evento?"
                value={data.actividad_previa || ''}
                onChange={(e) => updateField('actividad_previa', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contexto Temporal y Astronómico */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🌙 CONTEXTO TEMPORAL Y ASTRONÓMICO
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* hora_del_dia */}
            <div className="space-y-2">
              <Label htmlFor="hora_del_dia">Hora del Día</Label>
              <HoraDelDiaField 
                value={data.hora_del_dia || ''} 
                onChange={(value) => updateField('hora_del_dia', value)}
              />
            </div>

            {/* estacion_año */}
            <div className="space-y-2">
              <Label htmlFor="estacion_año">Estación del Año</Label>
              <EstacionAñoField 
                value={data.estacion_año || ''} 
                onChange={(value) => updateField('estacion_año', value)}
              />
            </div>

            {/* fase_lunar */}
            <div className="space-y-2">
              <Label htmlFor="fase_lunar">Fase Lunar</Label>
              <Select 
                value={data.fase_lunar || ''}
                onValueChange={(value) => updateField('fase_lunar', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luna_nueva">Luna Nueva</SelectItem>
                  <SelectItem value="cuarto_creciente">Cuarto Creciente</SelectItem>
                  <SelectItem value="luna_llena">Luna Llena</SelectItem>
                  <SelectItem value="cuarto_menguante">Cuarto Menguante</SelectItem>
                  <SelectItem value="desconocida">Desconocida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* patron_temporal */}
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="patron_temporal"
                checked={data.patron_temporal || false}
                onCheckedChange={(checked) => updateField('patron_temporal', checked as boolean)}
              />
              <Label htmlFor="patron_temporal">Patrón Temporal Identificado</Label>
            </div>
          </div>
        </div>

        {/* Contexto Cultural y Religioso */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            ⛪ CONTEXTO CULTURAL Y RELIGIOSO
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* festividad_religiosa */}
            <div className="space-y-2">
              <Label htmlFor="festividad_religiosa">Festividad Religiosa</Label>
              <Input
                id="festividad_religiosa"
                placeholder="Ej: Semana Santa, Día de los Muertos"
                value={data.festividad_religiosa || ''}
                onChange={(e) => updateField('festividad_religiosa', e.target.value)}
              />
            </div>

            {/* evento_historico */}
            <div className="space-y-2">
              <Label htmlFor="evento_historico">Evento Histórico</Label>
              <Input
                id="evento_historico"
                placeholder="Coincidencia con eventos históricos relevantes"
                value={data.evento_historico || ''}
                onChange={(e) => updateField('evento_historico', e.target.value)}
              />
            </div>

            {/* aniversario_especial */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="aniversario_especial">Aniversario Especial</Label>
              <Input
                id="aniversario_especial"
                placeholder="Aniversario de muerte, tragedia, evento significativo, etc."
                value={data.aniversario_especial || ''}
                onChange={(e) => updateField('aniversario_especial', e.target.value)}
              />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

// Componente para manejar campo clima with flexible input
function ClimaField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'despejado',
    'parcialmente_nublado', 
    'nublado',
    'lluvioso',
    'tormentoso',
    'neblina',
    'ventoso',
    'calido',
    'frio'
  ];

  const predefinedLabels = {
    'despejado': 'Despejado',
    'parcialmente_nublado': 'Parcialmente Nublado',
    'nublado': 'Nublado', 
    'lluvioso': 'Lluvioso',
    'tormentoso': 'Tormentoso',
    'neblina': 'Neblina',
    'ventoso': 'Ventoso',
    'calido': 'Cálido',
    'frio': 'Frío'
  };

  // Detectar si el valor actual no está en las opciones predefinidas
  const isCustomValue = value && !predefinedOptions.includes(value);

  // Efecto para activar modo personalizado si el valor no está en predefinidos
  useEffect(() => {
    if (isCustomValue) {
      setUseCustom(true);
    }
  }, [isCustomValue]);

  return (
    <div className="space-y-2">
      {/* Toggle entre opciones predefinidas y personalizado */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            !useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(false)}
        >
          Opciones predefinidas
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(true)}
        >
          Personalizado
        </button>
      </div>

      {/* Campo según el modo */}
      {useCustom ? (
        <Input
          placeholder="Ej: Fresco / Frío nocturno, Templado con brisa, etc."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el clima" />
          </SelectTrigger>
          <SelectContent>
            {predefinedOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {predefinedLabels[option as keyof typeof predefinedLabels]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Mostrar valor actual si es personalizado y estamos en modo predefinido */}
      {isCustomValue && !useCustom && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Valor actual: <span className="font-medium">{value}</span>
          <span className="text-xs ml-2">(Cambia a "Personalizado" para editarlo)</span>
        </div>
      )}
    </div>
  );
}

// Componente para manejar condiciones de luz con formato flexible
function CondicionesLuzField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'luz_natural_dia',
    'amanecer',
    'atardecer', 
    'noche_despejada',
    'noche_luna_llena',
    'noche_luna_nueva',
    'luz_artificial',
    'penumbra',
    'oscuridad_total'
  ];

  const predefinedLabels = {
    'luz_natural_dia': 'Luz Natural Día',
    'amanecer': 'Amanecer',
    'atardecer': 'Atardecer',
    'noche_despejada': 'Noche Despejada',
    'noche_luna_llena': 'Noche Luna Llena',
    'noche_luna_nueva': 'Noche Luna Nueva',
    'luz_artificial': 'Luz Artificial',
    'penumbra': 'Penumbra',
    'oscuridad_total': 'Oscuridad Total'
  };

  // Detectar si el valor actual no está en las opciones predefinidas
  const isCustomValue = value && !predefinedOptions.includes(value);

  // Efecto para activar modo personalizado si el valor no está en predefinidos
  useEffect(() => {
    if (isCustomValue) {
      setUseCustom(true);
    }
  }, [isCustomValue]);

  return (
    <div className="space-y-2">
      {/* Toggle entre opciones predefinidas y personalizado */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            !useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(false)}
        >
          Opciones predefinidas
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(true)}
        >
          Personalizado
        </button>
      </div>

      {/* Campo según el modo */}
      {useCustom ? (
        <Input
          placeholder="Ej: Oscuridad, luz de luna ocasional, luz artificial tenue de los pasillos"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona condiciones de luz" />
          </SelectTrigger>
          <SelectContent>
            {predefinedOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {predefinedLabels[option as keyof typeof predefinedLabels]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Mostrar valor actual si es personalizado y estamos en modo predefinido */}
      {isCustomValue && !useCustom && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Valor actual: <span className="font-medium">{value}</span>
          <span className="text-xs ml-2">(Cambia a "Personalizado" para editarlo)</span>
        </div>
      )}
    </div>
  );
}// Componente para manejar situación social con formato flexible
function SituacionSocialField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'reunion_familiar',
    'reunion_amigos',
    'evento_social',
    'trabajo',
    'soledad',
    'pareja',
    'grupo_pequeño',
    'multitud',
    'desconocidos'
  ];

  const predefinedLabels = {
    'reunion_familiar': 'Reunión Familiar',
    'reunion_amigos': 'Reunión de Amigos',
    'evento_social': 'Evento Social',
    'trabajo': 'Trabajo',
    'soledad': 'Soledad',
    'pareja': 'En Pareja',
    'grupo_pequeño': 'Grupo Pequeño',
    'multitud': 'Multitud',
    'desconocidos': 'Con Desconocidos'
  };

  // Detectar si el valor actual no está en las opciones predefinidas
  const isCustomValue = value && !predefinedOptions.includes(value);

  // Efecto para activar modo personalizado si el valor no está en predefinidos
  useEffect(() => {
    if (isCustomValue) {
      setUseCustom(true);
    }
  }, [isCustomValue]);

  return (
    <div className="space-y-2">
      {/* Toggle entre opciones predefinidas y personalizado */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            !useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(false)}
        >
          Opciones predefinidas
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(true)}
        >
          Personalizado
        </button>
      </div>

      {/* Campo según el modo */}
      {useCustom ? (
        <Input
          placeholder="Ej: Aislamiento laboral, entorno de alta tensión psicológica"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona situación social" />
          </SelectTrigger>
          <SelectContent>
            {predefinedOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {predefinedLabels[option as keyof typeof predefinedLabels]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Mostrar valor actual si es personalizado y estamos en modo predefinido */}
      {isCustomValue && !useCustom && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Valor actual: <span className="font-medium">{value}</span>
          <span className="text-xs ml-2">(Cambia a "Personalizado" para editarlo)</span>
        </div>
      )}
    </div>
  );
}// Componente para manejar hora del día con formato flexible
function HoraDelDiaField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'madrugada',
    'mañana',
    'tarde',
    'noche'
  ];

  const predefinedLabels = {
    'madrugada': 'Madrugada (00:00-06:00)',
    'mañana': 'Mañana (06:00-12:00)',
    'tarde': 'Tarde (12:00-18:00)',
    'noche': 'Noche (18:00-24:00)'
  };

  // Detectar si el valor actual no está en las opciones predefinidas
  const isCustomValue = value && !predefinedOptions.includes(value);

  // Efecto para activar modo personalizado si el valor no está en predefinidos
  useEffect(() => {
    if (isCustomValue) {
      setUseCustom(true);
    }
  }, [isCustomValue]);

  return (
    <div className="space-y-2">
      {/* Toggle entre opciones predefinidas y personalizado */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            !useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(false)}
        >
          Opciones predefinidas
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(true)}
        >
          Personalizado
        </button>
      </div>

      {/* Campo según el modo */}
      {useCustom ? (
        <Input
          placeholder="Ej: Noche / Madrugada, Amanecer temprano, etc."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona período del día" />
          </SelectTrigger>
          <SelectContent>
            {predefinedOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {predefinedLabels[option as keyof typeof predefinedLabels]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Mostrar valor actual si es personalizado y estamos en modo predefinido */}
      {isCustomValue && !useCustom && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Valor actual: <span className="font-medium">{value}</span>
          <span className="text-xs ml-2">(Cambia a "Personalizado" para editarlo)</span>
        </div>
      )}
    </div>
  );
}

// Componente para manejar estación del año con formato flexible (incluyendo null)
function EstacionAñoField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'verano',
    'otoño',
    'invierno',
    'primavera',
    'epoca_seca',
    'epoca_lluvias',
    'null',
    'desconocido'
  ];

  const predefinedLabels = {
    'verano': 'Verano',
    'otoño': 'Otoño',
    'invierno': 'Invierno',
    'primavera': 'Primavera',
    'epoca_seca': 'Época Seca',
    'epoca_lluvias': 'Época de Lluvias',
    'null': 'No especificado (null)',
    'desconocido': 'Desconocido'
  };

  // Detectar si el valor actual no está en las opciones predefinidas
  const isCustomValue = value && !predefinedOptions.includes(value);

  // Efecto para activar modo personalizado si el valor no está en predefinidos
  useEffect(() => {
    if (isCustomValue) {
      setUseCustom(true);
    }
  }, [isCustomValue]);

  return (
    <div className="space-y-2">
      {/* Toggle entre opciones predefinidas y personalizado */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            !useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(false)}
        >
          Opciones predefinidas
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-xs rounded ${
            useCustom 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setUseCustom(true)}
        >
          Personalizado
        </button>
      </div>

      {/* Campo según el modo */}
      {useCustom ? (
        <Input
          placeholder="Ej: Transición verano-otoño, Estación indefinida, null"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona estación del año" />
          </SelectTrigger>
          <SelectContent>
            {predefinedOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {predefinedLabels[option as keyof typeof predefinedLabels]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Mostrar valor actual si es personalizado y estamos en modo predefinido */}
      {isCustomValue && !useCustom && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Valor actual: <span className="font-medium">{value}</span>
          <span className="text-xs ml-2">(Cambia a "Personalizado" para editarlo)</span>
        </div>
      )}
    </div>
  );
}
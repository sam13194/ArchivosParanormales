'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ghost, Plus, Trash2, Database } from "lucide-react";
import { useState, useEffect } from 'react';

interface EntidadParanormal {
  tipo_entidad: string;
  nombre_entidad: string;
  descripcion_fisica: string;
  comportamiento: string;
  nivel_agresividad: number;
  frecuencia_aparicion: string;
  horarios_actividad: string;
  interaccion_fisica: boolean;
  comunicacion_verbal: boolean;
  comunicacion_no_verbal: boolean;
  objetos_afectados: string;
  temperatura_cambios: boolean;
  olores_asociados: string;
  sonidos_caracteristicos: string;
  patron_movimiento: string;
  reaccion_presencia_humana: string;
  vinculos_emocionales: string;
  historia_previa_lugar: string;
  metodos_interaccion: string;
  respuesta_rituales: string;
  evidencia_fisica_dejada: string;
  testigos_multiples: boolean;
  consistencia_apariciones: number;
}

interface EntidadesParanormalesSectionProps {
  data: EntidadParanormal[];
  setData: (data: EntidadParanormal[]) => void;
}

function EntidadForm({ 
  data, 
  updateField, 
  onRemove 
}: { 
  data: EntidadParanormal; 
  updateField: (field: string, value: any) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-4 pl-6 border-l-2 border-purple-200">
      {/* Header con botón de eliminar */}
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-sm">
          {data.nombre_entidad || `Entidad: ${data.tipo_entidad || 'Sin especificar'}`}
        </h5>
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

      {/* Información Básica */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          👻 INFORMACIÓN BÁSICA
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* tipo_entidad */}
          <div className="space-y-2">
            <Label>Tipo de Entidad</Label>
            <TipoEntidadField 
              value={data.tipo_entidad || ''} 
              onChange={(value) => updateField('tipo_entidad', value)}
            />
          </div>

          {/* nombre_entidad */}
          <div className="space-y-2">
            <Label>Nombre de la Entidad</Label>
            <Input
              placeholder="Nombre o apodo dado a la entidad"
              value={data.nombre_entidad || ''}
              onChange={(e) => updateField('nombre_entidad', e.target.value)}
            />
          </div>
        </div>

        {/* descripcion_fisica */}
        <div className="space-y-2">
          <Label>Descripción Física</Label>
          <Textarea
            placeholder="Describe la apariencia física de la entidad: forma, color, tamaño, vestimenta, etc."
            rows={3}
            value={data.descripcion_fisica || ''}
            onChange={(e) => updateField('descripcion_fisica', e.target.value)}
          />
        </div>

        {/* comportamiento */}
        <div className="space-y-2">
          <Label>Comportamiento</Label>
          <Textarea
            placeholder="Describe el comportamiento observado de la entidad"
            rows={2}
            value={data.comportamiento || ''}
            onChange={(e) => updateField('comportamiento', e.target.value)}
          />
        </div>
      </div>

      {/* Características de Actividad */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          ⚡ CARACTERÍSTICAS DE ACTIVIDAD
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* nivel_agresividad */}
          <div className="space-y-2">
            <Label>Nivel de Agresividad (0-5)</Label>
            <Input
              type="number"
              min="0"
              max="5"
              value={data.nivel_agresividad || ''}
              onChange={(e) => updateField('nivel_agresividad', parseInt(e.target.value) || 0)}
            />
          </div>

          {/* frecuencia_aparicion */}
          <div className="space-y-2">
            <Label>Frecuencia de Aparición</Label>
            <FrecuenciaAparicionField 
              value={data.frecuencia_aparicion || ''} 
              onChange={(value) => updateField('frecuencia_aparicion', value)}
            />
          </div>

          {/* horarios_actividad */}
          <div className="space-y-2">
            <Label>Horarios de Actividad</Label>
            <Input
              placeholder="Ej: 3:00 AM, Medianoche, Madrugada"
              value={data.horarios_actividad || ''}
              onChange={(e) => updateField('horarios_actividad', e.target.value)}
            />
          </div>

          {/* consistencia_apariciones */}
          <div className="space-y-2">
            <Label>Consistencia Apariciones (0-5)</Label>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={data.consistencia_apariciones || ''}
              onChange={(e) => updateField('consistencia_apariciones', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* patron_movimiento */}
        <div className="space-y-2">
          <Label>Patrón de Movimiento</Label>
          <Input
            placeholder="Describe cómo se mueve la entidad"
            value={data.patron_movimiento || ''}
            onChange={(e) => updateField('patron_movimiento', e.target.value)}
          />
        </div>
      </div>

      {/* Interacciones */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          🤝 INTERACCIONES
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Checkboxes de interacción */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={data.interaccion_fisica || false}
                onCheckedChange={(checked) => updateField('interaccion_fisica', checked as boolean)}
              />
              <Label>Interacción Física</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={data.comunicacion_verbal || false}
                onCheckedChange={(checked) => updateField('comunicacion_verbal', checked as boolean)}
              />
              <Label>Comunicación Verbal</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={data.comunicacion_no_verbal || false}
                onCheckedChange={(checked) => updateField('comunicacion_no_verbal', checked as boolean)}
              />
              <Label>Comunicación No Verbal</Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={data.temperatura_cambios || false}
                onCheckedChange={(checked) => updateField('temperatura_cambios', checked as boolean)}
              />
              <Label>Cambios de Temperatura</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={data.testigos_multiples || false}
                onCheckedChange={(checked) => updateField('testigos_multiples', checked as boolean)}
              />
              <Label>Testigos Múltiples</Label>
            </div>
          </div>
        </div>

        {/* reaccion_presencia_humana */}
        <div className="space-y-2">
          <Label>Reacción a Presencia Humana</Label>
          <ReaccionPresenciaField 
            value={data.reaccion_presencia_humana || ''} 
            onChange={(value) => updateField('reaccion_presencia_humana', value)}
          />
        </div>
      </div>

      {/* Manifestaciones Sensoriales */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          👃 MANIFESTACIONES SENSORIALES
        </h6>
        
        <div className="grid grid-cols-2 gap-4">
          {/* olores_asociados */}
          <div className="space-y-2">
            <Label>Olores Asociados</Label>
            <Input
              placeholder="Ej: Flores, Azufre, Perfume"
              value={data.olores_asociados || ''}
              onChange={(e) => updateField('olores_asociados', e.target.value)}
            />
          </div>

          {/* sonidos_caracteristicos */}
          <div className="space-y-2">
            <Label>Sonidos Característicos</Label>
            <Input
              placeholder="Ej: Pasos, Lamentos, Cadenas"
              value={data.sonidos_caracteristicos || ''}
              onChange={(e) => updateField('sonidos_caracteristicos', e.target.value)}
            />
          </div>
        </div>

        {/* objetos_afectados */}
        <div className="space-y-2">
          <Label>Objetos Afectados</Label>
          <Textarea
            placeholder="Describe objetos que la entidad mueve, afecta o con los que interactúa"
            rows={2}
            value={data.objetos_afectados || ''}
            onChange={(e) => updateField('objetos_afectados', e.target.value)}
          />
        </div>
      </div>

      {/* Contexto y Historia */}
      <div className="space-y-4">
        <h6 className="font-medium text-xs text-muted-foreground border-b pb-1">
          📚 CONTEXTO Y HISTORIA
        </h6>
        
        {/* historia_previa_lugar */}
        <div className="space-y-2">
          <Label>Historia Previa del Lugar</Label>
          <Textarea
            placeholder="Historia conocida sobre la entidad o el lugar donde aparece"
            rows={2}
            value={data.historia_previa_lugar || ''}
            onChange={(e) => updateField('historia_previa_lugar', e.target.value)}
          />
        </div>

        {/* vinculos_emocionales */}
        <div className="space-y-2">
          <Label>Vínculos Emocionales</Label>
          <Input
            placeholder="Conexiones emocionales con personas o lugares"
            value={data.vinculos_emocionales || ''}
            onChange={(e) => updateField('vinculos_emocionales', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* metodos_interaccion */}
          <div className="space-y-2">
            <Label>Métodos de Interacción</Label>
            <Input
              placeholder="Formas de comunicarse con la entidad"
              value={data.metodos_interaccion || ''}
              onChange={(e) => updateField('metodos_interaccion', e.target.value)}
            />
          </div>

          {/* respuesta_rituales */}
          <div className="space-y-2">
            <Label>Respuesta a Rituales</Label>
            <Input
              placeholder="Reacción a oraciones, bendiciones, etc."
              value={data.respuesta_rituales || ''}
              onChange={(e) => updateField('respuesta_rituales', e.target.value)}
            />
          </div>
        </div>

        {/* evidencia_fisica_dejada */}
        <div className="space-y-2">
          <Label>Evidencia Física Dejada</Label>
          <Textarea
            placeholder="Rastros físicos, marcas, objetos movidos, etc."
            rows={2}
            value={data.evidencia_fisica_dejada || ''}
            onChange={(e) => updateField('evidencia_fisica_dejada', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default function EntidadesParanormalesSection({ data, setData }: EntidadesParanormalesSectionProps) {
  
  const addEntidad = () => {
    const nuevaEntidad: EntidadParanormal = {
      tipo_entidad: '',
      nombre_entidad: '',
      descripcion_fisica: '',
      comportamiento: '',
      nivel_agresividad: 0,
      frecuencia_aparicion: '',
      horarios_actividad: '',
      interaccion_fisica: false,
      comunicacion_verbal: false,
      comunicacion_no_verbal: false,
      objetos_afectados: '',
      temperatura_cambios: false,
      olores_asociados: '',
      sonidos_caracteristicos: '',
      patron_movimiento: '',
      reaccion_presencia_humana: '',
      vinculos_emocionales: '',
      historia_previa_lugar: '',
      metodos_interaccion: '',
      respuesta_rituales: '',
      evidencia_fisica_dejada: '',
      testigos_multiples: false,
      consistencia_apariciones: 0
    };
    setData([...data, nuevaEntidad]);
  };

  const removeEntidad = (index: number) => {
    const nuevasEntidades = data.filter((_, i) => i !== index);
    setData(nuevasEntidades);
  };

  const updateEntidad = (index: number, field: string, value: any) => {
    const nuevasEntidades = [...data];
    nuevasEntidades[index] = { ...nuevasEntidades[index], [field]: value };
    setData(nuevasEntidades);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: entidades_paranormales
          <Badge variant="secondary" className="text-xs">23 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1 flex-1">
            👻 ENTIDADES PARANORMALES ({data.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEntidad}
            className="ml-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar Entidad
          </Button>
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Ghost className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay entidades paranormales registradas</p>
            <p className="text-xs">Haz clic en "Agregar Entidad" para describir las entidades involucradas</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((entidad, index) => (
              <EntidadForm
                key={index}
                data={entidad}
                updateField={(field, value) => updateEntidad(index, field, value)}
                onRemove={() => removeEntidad(index)}
              />
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}// Componente para manejar tipo de entidad con formato flexible
function TipoEntidadField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'fantasma',
    'aparicion',
    'poltergeist',
    'espiritu',
    'demonio',
    'sombra',
    'orbe',
    'voz_desincorporada',
    'presencia_invisible',
    'energia_negativa',
    'extraterrestre',
    'criptido',
    'otro'
  ];

  const predefinedLabels = {
    'fantasma': 'Fantasma',
    'aparicion': 'Aparición',
    'poltergeist': 'Poltergeist',
    'espiritu': 'Espíritu',
    'demonio': 'Demonio',
    'sombra': 'Sombra',
    'orbe': 'Orbe',
    'voz_desincorporada': 'Voz Desincorporada',
    'presencia_invisible': 'Presencia Invisible',
    'energia_negativa': 'Energía Negativa',
    'extraterrestre': 'Extraterrestre',
    'criptido': 'Criptido',
    'otro': 'Otro'
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
          placeholder="Ej: Humano con habilidades psíquicas / Aparición"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de entidad" />
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
}// Componente para manejar frecuencia de aparición con formato flexible
function FrecuenciaAparicionField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'unica',
    'ocasional',
    'frecuente',
    'diaria',
    'semanal',
    'mensual',
    'estacional',
    'impredecible'
  ];

  const predefinedLabels = {
    'unica': 'Única vez',
    'ocasional': 'Ocasional',
    'frecuente': 'Frecuente',
    'diaria': 'Diaria',
    'semanal': 'Semanal',
    'mensual': 'Mensual',
    'estacional': 'Estacional',
    'impredecible': 'Impredecible'
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
          placeholder="Ej: Intermitente, intensificándose hacia el final"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona frecuencia de aparición" />
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
}// Componente para manejar reacción a presencia humana con formato flexible
function ReaccionPresenciaField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'indiferente',
    'evita_contacto',
    'busca_atencion',
    'agresiva',
    'curiosa',
    'protectora',
    'territorial'
  ];

  const predefinedLabels = {
    'indiferente': 'Indiferente',
    'evita_contacto': 'Evita Contacto',
    'busca_atencion': 'Busca Atención',
    'agresiva': 'Agresiva',
    'curiosa': 'Curiosa',
    'protectora': 'Protectora',
    'territorial': 'Territorial'
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
          placeholder="Ej: Se vuelve más agresiva cuando se acercan, pero huye si la confrontan directamente"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona reacción" />
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
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2, Database } from "lucide-react";
import { useState, useEffect } from 'react';

interface TestigoData {
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
}

interface TestigosSectionProps {
  testigo_principal: TestigoData;
  testigos_secundarios: TestigoData[];
  setTestigoPrincipal: (data: TestigoData) => void;
  setTestigosSecundarios: (data: TestigoData[]) => void;
  addTestigoSecundario: () => void;
  removeTestigoSecundario: (index: number) => void;
  updateTestigoSecundario: (index: number, field: string, value: any) => void;
}

function TestigoForm({ 
  data, 
  updateField, 
  isPrincipal = false 
}: { 
  data: TestigoData; 
  updateField: (field: string, value: any) => void;
  isPrincipal?: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Información Básica del Testigo */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm text-muted-foreground border-b pb-1">
          👤 INFORMACIÓN PERSONAL
        </h5>
        
        <div className="grid grid-cols-2 gap-4">
          {/* tipo_testigo */}
          <div className="space-y-2">
            <Label htmlFor="tipo_testigo">Tipo de Testigo</Label>
            <Select 
              value={data.tipo_testigo || ''}
              onValueChange={(value) => updateField('tipo_testigo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="principal">Principal</SelectItem>
                <SelectItem value="secundario">Secundario</SelectItem>
                <SelectItem value="tercero">Tercero</SelectItem>
                <SelectItem value="familiar">Familiar</SelectItem>
                <SelectItem value="acompañante">Acompañante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* nombre_completo */}
          <div className="space-y-2">
            <Label htmlFor="nombre_completo">Nombre Completo</Label>
            <Input
              id="nombre_completo"
              placeholder="Nombre completo del testigo"
              value={data.nombre_completo || ''}
              onChange={(e) => updateField('nombre_completo', e.target.value)}
            />
          </div>

          {/* pseudonimo */}
          <div className="space-y-2">
            <Label htmlFor="pseudonimo">Pseudónimo</Label>
            <Input
              id="pseudonimo"
              placeholder="Nombre público para proteger identidad"
              value={data.pseudonimo || ''}
              onChange={(e) => updateField('pseudonimo', e.target.value)}
            />
          </div>

          {/* edad_aprox */}
          <div className="space-y-2">
            <Label htmlFor="edad_aprox">Edad Aproximada</Label>
            <Input
              id="edad_aprox"
              type="number"
              min="0"
              max="120"
              placeholder="Edad en años"
              value={data.edad_aprox || ''}
              onChange={(e) => updateField('edad_aprox', parseInt(e.target.value) || 0)}
            />
          </div>

          {/* ocupacion */}
          <div className="space-y-2">
            <Label htmlFor="ocupacion">Ocupación</Label>
            <Input
              id="ocupacion"
              placeholder="Profesión o trabajo"
              value={data.ocupacion || ''}
              onChange={(e) => updateField('ocupacion', e.target.value)}
            />
          </div>

          {/* relacion_evento */}
          <div className="space-y-2">
            <Label htmlFor="relacion_evento">Relación con el Evento</Label>
            <RelacionEventoField 
              value={data.relacion_evento || ''} 
              onChange={(value) => updateField('relacion_evento', value)}
            />
          </div>
        </div>
      </div>

      {/* Características del Testimonio */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm text-muted-foreground border-b pb-1">
          🎯 CARACTERÍSTICAS DEL TESTIMONIO
        </h5>

        <div className="grid grid-cols-2 gap-4">
          {/* credibilidad_estimada */}
          <div className="space-y-2">
            <Label htmlFor="credibilidad_estimada">Credibilidad Estimada (0-5)</Label>
            <Input
              id="credibilidad_estimada"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={data.credibilidad_estimada || ''}
              onChange={(e) => updateField('credibilidad_estimada', parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* presencial */}
          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="presencial"
              checked={data.presencial || false}
              onCheckedChange={(checked) => updateField('presencial', checked as boolean)}
            />
            <Label htmlFor="presencial">Testigo Presencial</Label>
          </div>

          {/* antecedentes_paranormales */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="antecedentes_paranormales"
              checked={data.antecedentes_paranormales || false}
              onCheckedChange={(checked) => updateField('antecedentes_paranormales', checked as boolean)}
            />
            <Label htmlFor="antecedentes_paranormales">Antecedentes Paranormales</Label>
          </div>

          {/* contacto_disponible */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contacto_disponible"
              checked={data.contacto_disponible || false}
              onCheckedChange={(checked) => updateField('contacto_disponible', checked as boolean)}
            />
            <Label htmlFor="contacto_disponible">Contacto Disponible</Label>
          </div>
        </div>
      </div>

      {/* Notas del Testigo */}
      <div className="space-y-2">
        <Label htmlFor="notas_testigo">Notas del Testigo</Label>
        <Textarea
          id="notas_testigo"
          placeholder="Observaciones adicionales sobre el testigo, su comportamiento, confiabilidad, etc."
          rows={3}
          value={data.notas_testigo || ''}
          onChange={(e) => updateField('notas_testigo', e.target.value)}
        />
      </div>
    </div>
  );
}

export default function TestigosSection({
  testigo_principal,
  testigos_secundarios,
  setTestigoPrincipal,
  setTestigosSecundarios,
  addTestigoSecundario,
  removeTestigoSecundario,
  updateTestigoSecundario
}: TestigosSectionProps) {
  
  const updateTestigoPrincipal = (field: string, value: any) => {
    setTestigoPrincipal({ ...testigo_principal, [field]: value });
  };

  const updateSecundario = (index: number, field: string, value: any) => {
    updateTestigoSecundario(index, field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: testigos
          <Badge variant="secondary" className="text-xs">15 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Testigo Principal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1 flex-1">
              🎤 TESTIGO PRINCIPAL
            </h4>
          </div>
          
          <div className="pl-6 border-l-2 border-blue-200">
            <TestigoForm 
              data={testigo_principal}
              updateField={updateTestigoPrincipal}
              isPrincipal={true}
            />
          </div>
        </div>

        {/* Testigos Secundarios */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1 flex-1">
              👥 TESTIGOS SECUNDARIOS ({testigos_secundarios.length})
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTestigoSecundario}
              className="ml-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar Testigo
            </Button>
          </div>
          
          {testigos_secundarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay testigos secundarios</p>
              <p className="text-xs">Haz clic en "Agregar Testigo" para añadir más testigos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testigos_secundarios.map((testigo, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-sm">
                      Testigo Secundario #{index + 1}
                    </h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestigoSecundario(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <TestigoForm 
                    data={testigo}
                    updateField={(field, value) => updateSecundario(index, field, value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}// Componente para manejar relación con evento con formato flexible
function RelacionEventoField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [useCustom, setUseCustom] = useState(false);

  const predefinedOptions = [
    'protagonista',
    'testigo_directo',
    'testigo_indirecto',
    'investigador',
    'familiar_afectado',
    'vecino',
    'autoridad',
    'otro'
  ];

  const predefinedLabels = {
    'protagonista': 'Protagonista',
    'testigo_directo': 'Testigo Directo',
    'testigo_indirecto': 'Testigo Indirecto',
    'investigador': 'Investigador',
    'familiar_afectado': 'Familiar Afectado',
    'vecino': 'Vecino',
    'autoridad': 'Autoridad',
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
          placeholder="Ej: Trabajador del lugar (enfermero) durante los 10 años que duraron los sucesos"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Select 
          value={predefinedOptions.includes(value) ? value : ''}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la relación con el evento" />
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
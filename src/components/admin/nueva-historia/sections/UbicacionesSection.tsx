'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapPin, Database } from "lucide-react";
import { 
  FieldLabel, 
  FieldHelpText, 
  getFieldInputClass, 
  getSelectTriggerClass, 
  getTextareaClass, 
  getFieldStatus 
} from '../shared/FieldIndicators';

interface UbicacionesSectionProps {
  data: {
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
  setData: (data: any) => void;
}

export default function UbicacionesSection({ data, setData }: UbicacionesSectionProps) {
  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: ubicaciones
          <Badge variant="secondary" className="text-xs">24 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Información Geográfica Básica */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🌍 INFORMACIÓN GEOGRÁFICA
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* pais */}
            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                value={data.pais || 'Colombia'}
                onChange={(e) => updateField('pais', e.target.value)}
              />
            </div>

            {/* codigo_pais */}
            <div className="space-y-2">
              <Label htmlFor="codigo_pais">Código País (ISO)</Label>
              <Input
                id="codigo_pais"
                placeholder="CO"
                value={data.codigo_pais || 'CO'}
                onChange={(e) => updateField('codigo_pais', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* División Administrativa */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🏛️ DIVISIÓN ADMINISTRATIVA
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* nivel1_nombre (Departamento/Estado) */}
            <div className="space-y-2">
              <Label htmlFor="nivel1_nombre">Departamento/Estado</Label>
              <Input
                id="nivel1_nombre"
                placeholder="Ej: Cundinamarca, Antioquia"
                value={data.nivel1_nombre || ''}
                onChange={(e) => updateField('nivel1_nombre', e.target.value)}
              />
            </div>

            {/* nivel1_codigo */}
            <div className="space-y-2">
              <Label htmlFor="nivel1_codigo">Código Departamento</Label>
              <Input
                id="nivel1_codigo"
                placeholder="Ej: CUN, ANT"
                value={data.nivel1_codigo || ''}
                onChange={(e) => updateField('nivel1_codigo', e.target.value)}
              />
            </div>

            {/* nivel2_nombre (Ciudad/Municipio) */}
            <div className="space-y-2">
              <Label htmlFor="nivel2_nombre">Ciudad/Municipio</Label>
              <Input
                id="nivel2_nombre"
                placeholder="Ej: Bogotá, Medellín"
                value={data.nivel2_nombre || ''}
                onChange={(e) => updateField('nivel2_nombre', e.target.value)}
              />
            </div>

            {/* nivel2_codigo */}
            <div className="space-y-2">
              <Label htmlFor="nivel2_codigo">Código Ciudad</Label>
              <Input
                id="nivel2_codigo"
                placeholder="Ej: BOG, MED"
                value={data.nivel2_codigo || ''}
                onChange={(e) => updateField('nivel2_codigo', e.target.value)}
              />
            </div>

            {/* nivel3_nombre (Localidad/Comuna) */}
            <div className="space-y-2">
              <Label htmlFor="nivel3_nombre">Localidad/Comuna</Label>
              <Input
                id="nivel3_nombre"
                placeholder="Ej: La Candelaria, El Poblado"
                value={data.nivel3_nombre || ''}
                onChange={(e) => updateField('nivel3_nombre', e.target.value)}
              />
            </div>

            {/* nivel4_nombre (Barrio/Vereda) */}
            <div className="space-y-2">
              <Label htmlFor="nivel4_nombre">Barrio/Vereda</Label>
              <Input
                id="nivel4_nombre"
                placeholder="Ej: Centro Histórico, Las Palmas"
                value={data.nivel4_nombre || ''}
                onChange={(e) => updateField('nivel4_nombre', e.target.value)}
              />
            </div>
          </div>

          {/* Campos adicionales de compatibilidad */}
          <div className="grid grid-cols-2 gap-4">
            {/* departamento */}
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento (Legacy)</Label>
              <Input
                id="departamento"
                placeholder="Campo de compatibilidad"
                value={data.departamento || ''}
                onChange={(e) => updateField('departamento', e.target.value)}
              />
            </div>

            {/* municipio */}
            <div className="space-y-2">
              <Label htmlFor="municipio">Municipio (Legacy)</Label>
              <Input
                id="municipio"
                placeholder="Campo de compatibilidad"
                value={data.municipio || ''}
                onChange={(e) => updateField('municipio', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Coordenadas Geográficas */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📍 COORDENADAS GEOGRÁFICAS
          </h4>
          
          <div className="grid grid-cols-3 gap-4">
            {/* latitud */}
            <div className="space-y-2">
              <Label htmlFor="latitud">Latitud</Label>
              <Input
                id="latitud"
                type="number"
                step="0.000001"
                placeholder="4.6097"
                value={data.latitud || ''}
                onChange={(e) => updateField('latitud', parseFloat(e.target.value) || null)}
              />
            </div>

            {/* longitud */}
            <div className="space-y-2">
              <Label htmlFor="longitud">Longitud</Label>
              <Input
                id="longitud"
                type="number"
                step="0.000001"
                placeholder="-74.0817"
                value={data.longitud || ''}
                onChange={(e) => updateField('longitud', parseFloat(e.target.value) || null)}
              />
            </div>

            {/* precision_metros */}
            <div className="space-y-2">
              <Label htmlFor="precision_metros">Precisión (metros)</Label>
              <Input
                id="precision_metros"
                type="number"
                min="1"
                placeholder="100"
                value={data.precision_metros || ''}
                onChange={(e) => updateField('precision_metros', parseInt(e.target.value) || 100)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* zona_horaria */}
            <div className="space-y-2">
              <Label htmlFor="zona_horaria">Zona Horaria</Label>
              <Select 
                value={data.zona_horaria || ''}
                onValueChange={(value) => updateField('zona_horaria', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Bogota">America/Bogota</SelectItem>
                  <SelectItem value="America/Caracas">America/Caracas</SelectItem>
                  <SelectItem value="America/Lima">America/Lima</SelectItem>
                  <SelectItem value="America/Mexico_City">America/Mexico_City</SelectItem>
                  <SelectItem value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* altitud_metros */}
            <div className="space-y-2">
              <Label htmlFor="altitud_metros">Altitud (metros)</Label>
              <Input
                id="altitud_metros"
                type="number"
                placeholder="2640"
                value={data.altitud_metros || ''}
                onChange={(e) => updateField('altitud_metros', parseInt(e.target.value) || null)}
              />
            </div>
          </div>
        </div>

        {/* Descripción del Lugar */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🏘️ DESCRIPCIÓN DEL LUGAR
          </h4>
          
          {/* lugar_especifico */}
          <div className="space-y-2">
            <Label htmlFor="lugar_especifico">Lugar Específico</Label>
            <Input
              id="lugar_especifico"
              placeholder="Ej: Hotel Tequendama, Casa de la Familia García"
              value={data.lugar_especifico || ''}
              onChange={(e) => updateField('lugar_especifico', e.target.value)}
            />
          </div>

          {/* tipo_lugar */}
          <div className="space-y-2">
            <Label htmlFor="tipo_lugar">Tipo de Lugar</Label>
            <Select 
              value={data.tipo_lugar || ''}
              onValueChange={(value) => updateField('tipo_lugar', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa_residencial">Casa Residencial</SelectItem>
                <SelectItem value="edificio_apartamentos">Edificio de Apartamentos</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="escuela">Escuela</SelectItem>
                <SelectItem value="iglesia">Iglesia</SelectItem>
                <SelectItem value="cementerio">Cementerio</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="parque">Parque</SelectItem>
                <SelectItem value="bosque">Bosque</SelectItem>
                <SelectItem value="carretera">Carretera</SelectItem>
                <SelectItem value="hospital_abandonado">Hospital Abandonado</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* descripcion_lugar */}
          <div className="space-y-2">
            <Label htmlFor="descripcion_lugar">Descripción del Lugar</Label>
            <Textarea
              id="descripcion_lugar"
              placeholder="Descripción detallada del lugar donde ocurrieron los eventos..."
              rows={3}
              value={data.descripcion_lugar || ''}
              onChange={(e) => updateField('descripcion_lugar', e.target.value)}
            />
          </div>
        </div>

        {/* Historial Paranormal */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            👻 HISTORIAL PARANORMAL DEL LUGAR
          </h4>
          
          {/* actividad_paranormal_reportada */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="actividad_paranormal_reportada"
              checked={data.actividad_paranormal_reportada || false}
              onCheckedChange={(checked) => updateField('actividad_paranormal_reportada', checked as boolean)}
            />
            <Label htmlFor="actividad_paranormal_reportada">
              ¿Se ha reportado actividad paranormal previa en este lugar?
            </Label>
          </div>

          {data.actividad_paranormal_reportada && (
            <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-orange-200">
              {/* numero_historias_reportadas */}
              <div className="space-y-2">
                <Label htmlFor="numero_historias_reportadas">Número de Historias Reportadas</Label>
                <Input
                  id="numero_historias_reportadas"
                  type="number"
                  min="0"
                  value={data.numero_historias_reportadas || ''}
                  onChange={(e) => updateField('numero_historias_reportadas', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* primera_actividad_reportada */}
              <div className="space-y-2">
                <Label htmlFor="primera_actividad_reportada">Primera Actividad Reportada</Label>
                <Input
                  id="primera_actividad_reportada"
                  type="date"
                  value={data.primera_actividad_reportada || ''}
                  onChange={(e) => updateField('primera_actividad_reportada', e.target.value)}
                />
              </div>

              {/* ultima_actividad_reportada */}
              <div className="space-y-2">
                <Label htmlFor="ultima_actividad_reportada">Última Actividad Reportada</Label>
                <Input
                  id="ultima_actividad_reportada"
                  type="date"
                  value={data.ultima_actividad_reportada || ''}
                  onChange={(e) => updateField('ultima_actividad_reportada', e.target.value)}
                />
              </div>

              {/* fuente_verificacion */}
              <div className="space-y-2">
                <Label htmlFor="fuente_verificacion">Fuente de Verificación</Label>
                <Input
                  id="fuente_verificacion"
                  placeholder="Ej: Testigos locales, Archivos municipales"
                  value={data.fuente_verificacion || ''}
                  onChange={(e) => updateField('fuente_verificacion', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* verificada */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verificada"
              checked={data.verificada || false}
              onCheckedChange={(checked) => updateField('verificada', checked as boolean)}
            />
            <Label htmlFor="verificada">
              Ubicación Verificada (confirmada su existencia)
            </Label>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
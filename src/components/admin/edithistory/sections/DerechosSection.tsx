'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Scale, Database } from "lucide-react";

interface DerechosSectionProps {
  data: {
    derechos_uso: string;
    autorizacion_comercial: boolean;
    autorizacion_adaptacion: boolean;
    restricciones_uso: string;
    contacto_derechos: string;
    fecha_autorizacion: string;
    vigencia_derechos: string;
    notas_legales: string;
  };
  setData: (data: any) => void;
}

export default function DerechosSection({ data, setData }: DerechosSectionProps) {
  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  // Determinar estado de los derechos
  const getEstadoDerechos = () => {
    if (data.autorizacion_comercial && data.autorizacion_adaptacion && data.fecha_autorizacion) {
      return { status: 'Completo', color: 'text-green-700', bgColor: 'bg-green-100' };
    } else if (data.fecha_autorizacion) {
      return { status: 'Parcial', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    } else {
      return { status: 'Pendiente', color: 'text-red-700', bgColor: 'bg-red-100' };
    }
  };

  const estadoDerechos = getEstadoDerechos();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: derechos
          <Badge variant="secondary" className="text-xs">9 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Estado de Derechos */}
        <div className={`p-4 rounded-lg `}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Scale className="h-4 w-4" />
              ESTADO DE DERECHOS
            </h4>
            <Badge variant="outline" className={estadoDerechos.color}>
              {estadoDerechos.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {estadoDerechos.status === 'Completo' && 'Todos los derechos y autorizaciones están en orden.'}
            {estadoDerechos.status === 'Parcial' && 'Algunos derechos están pendientes o incompletos.'}
            {estadoDerechos.status === 'Pendiente' && 'Se requiere obtener autorizaciones y derechos.'}
          </p>
        </div>

        {/* Tipo de Derechos */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            ⚖️ TIPO DE DERECHOS Y PERMISOS
          </h4>
          
          {/* derechos_uso */}
          <div className="space-y-2">
            <Label htmlFor="derechos_uso">Derechos de Uso</Label>
            <Select 
              value={data.derechos_uso || ''}
              onValueChange={(value) => updateField('derechos_uso', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de derechos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uso_libre">Uso Libre</SelectItem>
                <SelectItem value="uso_personal">Uso Personal</SelectItem>
                <SelectItem value="uso_comercial">Uso Comercial</SelectItem>
                <SelectItem value="uso_educativo">Uso Educativo</SelectItem>
                <SelectItem value="todos_los_derechos">Todos los Derechos</SelectItem>
                <SelectItem value="derechos_limitados">Derechos Limitados</SelectItem>
                <SelectItem value="dominio_publico">Dominio Público</SelectItem>
                <SelectItem value="creative_commons">Creative Commons</SelectItem>
                <SelectItem value="derechos_reservados">Derechos Reservados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* autorizacion_comercial */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autorizacion_comercial"
                checked={data.autorizacion_comercial || false}
                onCheckedChange={(checked) => updateField('autorizacion_comercial', checked as boolean)}
              />
              <Label htmlFor="autorizacion_comercial">
                Autorización para Uso Comercial
              </Label>
            </div>

            {/* autorizacion_adaptacion */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autorizacion_adaptacion"
                checked={data.autorizacion_adaptacion || false}
                onCheckedChange={(checked) => updateField('autorizacion_adaptacion', checked as boolean)}
              />
              <Label htmlFor="autorizacion_adaptacion">
                Autorización para Adaptaciones
              </Label>
            </div>
          </div>
        </div>

        {/* Restricciones */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🚫 RESTRICCIONES Y LIMITACIONES
          </h4>
          
          {/* restricciones_uso */}
          <div className="space-y-2">
            <Label htmlFor="restricciones_uso">Restricciones de Uso</Label>
            <Textarea
              id="restricciones_uso"
              placeholder="Describe cualquier restricción específica para el uso de esta historia..."
              rows={3}
              value={data.restricciones_uso || ''}
              onChange={(e) => updateField('restricciones_uso', e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Ejemplo: No usar nombres reales, no mencionar ubicación exacta, etc.
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📞 INFORMACIÓN DE CONTACTO
          </h4>
          
          {/* contacto_derechos */}
          <div className="space-y-2">
            <Label htmlFor="contacto_derechos">Contacto para Derechos</Label>
            <Input
              id="contacto_derechos"
              placeholder="Email, teléfono o información de contacto del titular de derechos"
              value={data.contacto_derechos || ''}
              onChange={(e) => updateField('contacto_derechos', e.target.value)}
            />
          </div>
        </div>

        {/* Fechas y Vigencia */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📅 FECHAS Y VIGENCIA
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* fecha_autorizacion */}
            <div className="space-y-2">
              <Label htmlFor="fecha_autorizacion">Fecha de Autorización</Label>
              <Input
                id="fecha_autorizacion"
                type="date"
                value={data.fecha_autorizacion || ''}
                onChange={(e) => updateField('fecha_autorizacion', e.target.value)}
              />
            </div>

            {/* vigencia_derechos */}
            <div className="space-y-2">
              <Label htmlFor="vigencia_derechos">Vigencia de Derechos</Label>
              <Select 
                value={data.vigencia_derechos || ''}
                onValueChange={(value) => updateField('vigencia_derechos', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona vigencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indefinida">Indefinida</SelectItem>
                  <SelectItem value="1_año">1 Año</SelectItem>
                  <SelectItem value="2_años">2 Años</SelectItem>
                  <SelectItem value="5_años">5 Años</SelectItem>
                  <SelectItem value="10_años">10 Años</SelectItem>
                  <SelectItem value="hasta_revocacion">Hasta Revocación</SelectItem>
                  <SelectItem value="temporal">Temporal</SelectItem>
                  <SelectItem value="perpetua">Perpetua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notas Legales */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📝 NOTAS LEGALES ADICIONALES
          </h4>
          
          {/* notas_legales */}
          <div className="space-y-2">
            <Label htmlFor="notas_legales">Notas Legales</Label>
            <Textarea
              id="notas_legales"
              placeholder="Cualquier información legal adicional, acuerdos especiales, condiciones, etc."
              rows={4}
              value={data.notas_legales || ''}
              onChange={(e) => updateField('notas_legales', e.target.value)}
            />
          </div>
        </div>

        {/* Aviso Legal */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h6 className="font-medium text-sm text-gray-800 mb-2">
            ⚠️ Aviso Legal
          </h6>
          <p className="text-xs text-gray-600">
            Es importante obtener todos los permisos necesarios antes de publicar o usar comercialmente cualquier historia. 
            Esto incluye el consentimiento del testigo, derechos de autor de cualquier material multimedia, y cumplimiento 
            con las leyes de privacidad aplicables.
          </p>
        </div>

        {/* Checklist Rápido */}
        <div className="space-y-2">
          <h6 className="font-medium text-sm text-muted-foreground">
            ✅ Checklist de Derechos
          </h6>
          
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className={`flex items-center gap-2 ${data.fecha_autorizacion ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-3 h-3 rounded border ${data.fecha_autorizacion ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {data.fecha_autorizacion && <span className="text-white text-xs">✓</span>}
              </div>
              Autorización obtenida y fechada
            </div>
            
            <div className={`flex items-center gap-2 ${data.autorizacion_comercial ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-3 h-3 rounded border ${data.autorizacion_comercial ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {data.autorizacion_comercial && <span className="text-white text-xs">✓</span>}
              </div>
              Autorización comercial confirmada
            </div>
            
            <div className={`flex items-center gap-2 ${data.contacto_derechos ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-3 h-3 rounded border ${data.contacto_derechos ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {data.contacto_derechos && <span className="text-white text-xs">✓</span>}
              </div>
              Información de contacto disponible
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
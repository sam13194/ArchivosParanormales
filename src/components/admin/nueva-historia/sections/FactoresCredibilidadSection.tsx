'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Database } from "lucide-react";

interface FactoresCredibilidadSectionProps {
  data: {
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
  setData: (data: any) => void;
}

export default function FactoresCredibilidadSection({ data, setData }: FactoresCredibilidadSectionProps) {
  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  // Calcular puntaje total de credibilidad
  const factores = [
    { key: 'multiples_testigos', value: data.multiples_testigos || 0 },
    { key: 'evidencia_fisica', value: data.evidencia_fisica || 0 },
    { key: 'consistencia_relatos', value: data.consistencia_relatos || 0 },
    { key: 'ubicacion_verificable', value: data.ubicacion_verificable || 0 },
    { key: 'contexto_historico', value: data.contexto_historico || 0 },
    { key: 'sobriedad_testigo', value: data.sobriedad_testigo || 0 },
    { key: 'conocimiento_previo', value: data.conocimiento_previo || 0 },
    { key: 'estado_emocional', value: data.estado_emocional || 0 },
    { key: 'motivaciones_secundarias', value: data.motivaciones_secundarias || 0 },
    { key: 'corroboracion_externa', value: data.corroboracion_externa || 0 },
    { key: 'documentacion_disponible', value: data.documentacion_disponible || 0 }
  ];

  const puntajeTotal = factores.reduce((sum, factor) => sum + factor.value, 0);
  const puntajeMaximo = factores.length * 5;
  const porcentajeCredibilidad = Math.round((puntajeTotal / puntajeMaximo) * 100);

  const getCredibilityLevel = (percentage: number) => {
    if (percentage >= 80) return { level: 'Muy Alta', color: 'text-green-700', bgColor: 'border-green-300 bg-white' };
    if (percentage >= 60) return { level: 'Alta', color: 'text-blue-700', bgColor: 'border-blue-300 bg-white' };
    if (percentage >= 40) return { level: 'Media', color: 'text-yellow-700', bgColor: 'border-yellow-300 bg-white' };
    if (percentage >= 20) return { level: 'Baja', color: 'text-orange-700', bgColor: 'border-orange-300 bg-white' };
    return { level: 'Muy Baja', color: 'text-red-700', bgColor: 'border-red-300 bg-white' };
  };

  const credibilityInfo = getCredibilityLevel(porcentajeCredibilidad);

  const factorLabels = {
    multiples_testigos: 'Múltiples Testigos',
    evidencia_fisica: 'Evidencia Física Disponible',
    consistencia_relatos: 'Consistencia en Relatos',
    ubicacion_verificable: 'Ubicación Verificable',
    contexto_historico: 'Contexto Histórico Coherente',
    sobriedad_testigo: 'Sobriedad del Testigo',
    conocimiento_previo: 'Conocimiento Previo Limitado',
    estado_emocional: 'Estado Emocional Estable',
    motivaciones_secundarias: 'Ausencia Motivaciones Secundarias',
    corroboracion_externa: 'Corroboración Externa',
    documentacion_disponible: 'Documentación Disponible'
  };

  const factorDescriptions = {
    multiples_testigos: 'Número y calidad de testigos adicionales',
    evidencia_fisica: 'Presencia de evidencia física tangible',
    consistencia_relatos: 'Coherencia entre diferentes versiones del relato',
    ubicacion_verificable: 'Capacidad de verificar la ubicación del evento',
    contexto_historico: 'Coherencia con el contexto histórico del lugar',
    sobriedad_testigo: 'Estado de sobriedad y claridad mental del testigo',
    conocimiento_previo: 'Nivel de conocimiento previo sobre el lugar/fenómeno',
    estado_emocional: 'Estabilidad emocional durante el testimonio',
    motivaciones_secundarias: 'Ausencia de motivos ocultos para inventar',
    corroboracion_externa: 'Confirmación por fuentes independientes',
    documentacion_disponible: 'Existencia de documentos que apoyen el relato'
  };

  return (
    <Card className="p-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: factores_credibilidad
          <Badge variant="secondary" className="text-xs">13 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        
        {/* Resumen de Credibilidad */}
        <div className={`p-6 rounded-lg border-2 bg-white`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              EVALUACIÓN DE CREDIBILIDAD
            </h4>
            <Badge variant="outline" className={credibilityInfo.color}>
              {credibilityInfo.level}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Puntaje Total:</span>
              <span className="font-medium">{puntajeTotal}/{puntajeMaximo} ({porcentajeCredibilidad}%)</span>
            </div>
            <Progress value={porcentajeCredibilidad} className="h-2" />
          </div>
        </div>
        </CardContent>

        {/* Factores de Credibilidad */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📊 FACTORES DE CREDIBILIDAD (Escala 0-5)
          </h4>
          
          <div className="space-y-4">
            {Object.entries(factorLabels).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={key} className="text-sm font-medium">
                    {label}
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    {data[key as keyof typeof data] || 0}/5
                  </Badge>
                </div>
                
                <Input
                  id={key}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={data[key as keyof typeof data] || ''}
                  onChange={(e) => updateField(key, parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
                
                <p className="text-xs text-muted-foreground">
                  {factorDescriptions[key as keyof typeof factorDescriptions]}
                </p>
                
                {/* Barra de progreso individual */}
                <Progress 
                  value={(data[key as keyof typeof data] || 0) * 20} 
                  className="h-1" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Guía de Puntuación */}
        <div className="space-y-4">
          <h5 className="font-medium text-sm text-muted-foreground border-b pb-1">
            📋 GUÍA DE PUNTUACIÓN
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="font-medium">Puntuación por Nivel:</div>
              <div className="space-y-1">
                <div><span className="font-medium">5:</span> Excelente/Muy Fuerte</div>
                <div><span className="font-medium">4:</span> Bueno/Fuerte</div>
                <div><span className="font-medium">3:</span> Moderado/Aceptable</div>
                <div><span className="font-medium">2:</span> Débil/Cuestionable</div>
                <div><span className="font-medium">1:</span> Muy Débil/Problemático</div>
                <div><span className="font-medium">0:</span> Ausente/No Aplicable</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Niveles de Credibilidad:</div>
              <div className="space-y-1">
                <div><span className="font-medium text-green-700">80-100%:</span> Muy Alta</div>
                <div><span className="font-medium text-blue-700">60-79%:</span> Alta</div>
                <div><span className="font-medium text-yellow-700">40-59%:</span> Media</div>
                <div><span className="font-medium text-orange-700">20-39%:</span> Baja</div>
                <div><span className="font-medium text-red-700">0-19%:</span> Muy Baja</div>
              </div>
            </div>
          </div>
        </div>

        {/* Factores Más Importantes */}
        <div className="space-y-2">
          <h6 className="font-medium text-sm text-muted-foreground">
            🎯 Factores con Mayor Impacto
          </h6>
          
          <div className="flex flex-wrap gap-2">
            {factores
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map((factor) => (
                <Badge 
                  key={factor.key} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {factorLabels[factor.key as keyof typeof factorLabels]}: {factor.value}
                </Badge>
              ))}
          </div>
        </div>

      
    </Card>
  );
}
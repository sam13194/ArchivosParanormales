'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Database } from "lucide-react";

interface PerformanceEsperadoSectionProps {
  data: {
    audiencia_objetivo: string;
    engagement_esperado: number;
    potencial_viral: number;
    impacto_emocional_esperado: number;
    duracion_interes_estimada: number;
    metricas_objetivo: any;
  };
  setData: (data: any) => void;
}

export default function PerformanceEsperadoSection({ data, setData }: PerformanceEsperadoSectionProps) {
  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  // Calcular puntaje general de performance
  const metricas = [
    { key: 'engagement_esperado', value: data.engagement_esperado || 0, weight: 0.25 },
    { key: 'potencial_viral', value: data.potencial_viral || 0, weight: 0.2 },
    { key: 'impacto_emocional_esperado', value: data.impacto_emocional_esperado || 0, weight: 0.3 },
    { key: 'duracion_interes_estimada', value: data.duracion_interes_estimada || 0, weight: 0.25 }
  ];

  const puntajeGeneral = metricas.reduce((sum, metric) => sum + (metric.value * metric.weight), 0);
  const porcentajePerformance = Math.round((puntajeGeneral / 5) * 100);

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { level: 'Excelente', color: 'text-green-700', bgColor: 'border-green-300 bg-white' };
    if (percentage >= 60) return { level: 'Bueno', color: 'text-blue-700', bgColor: 'border-blue-300 bg-white' };
    if (percentage >= 40) return { level: 'Regular', color: 'text-yellow-700', bgColor: 'border-yellow-300 bg-white' };
    if (percentage >= 20) return { level: 'Bajo', color: 'text-orange-700', bgColor: 'border-orange-300 bg-white' };
    return { level: 'Muy Bajo', color: 'text-red-700', bgColor: 'border-red-300 bg-white' };
  };

  const performanceInfo = getPerformanceLevel(porcentajePerformance);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: performance_esperado
          <Badge variant="secondary" className="text-xs">7 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Proyección General */}
        <div className={`p-4 rounded-lg border-2 ${performanceInfo.bgColor}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              PROYECCIÓN DE PERFORMANCE
            </h4>
            <Badge variant="outline" className={performanceInfo.color}>
              {performanceInfo.level}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Puntaje Proyectado:</span>
              <span className="font-medium">{puntajeGeneral.toFixed(1)}/5.0 ({porcentajePerformance}%)</span>
            </div>
            <Progress value={porcentajePerformance} className="h-2" />
          </div>
        </div>

        {/* Audiencia Objetivo */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🎯 AUDIENCIA OBJETIVO
          </h4>
          
          {/* audiencia_objetivo */}
          <div className="space-y-2">
            <Label htmlFor="audiencia_objetivo">Audiencia Objetivo</Label>
            <Select 
              value={data.audiencia_objetivo || ''}
              onValueChange={(value) => updateField('audiencia_objetivo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la audiencia principal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Audiencia General</SelectItem>
                <SelectItem value="jovenes_adultos">Jóvenes Adultos (18-35)</SelectItem>
                <SelectItem value="adultos">Adultos (35-55)</SelectItem>
                <SelectItem value="adultos_mayores">Adultos Mayores (55+)</SelectItem>
                <SelectItem value="entusiastas_paranormal">Entusiastas de lo Paranormal</SelectItem>
                <SelectItem value="curiosos_escepticos">Curiosos Escépticos</SelectItem>
                <SelectItem value="investigadores">Investigadores</SelectItem>
                <SelectItem value="podcasters">Podcasters y Creadores</SelectItem>
                <SelectItem value="lectores_terror">Lectores de Terror</SelectItem>
                <SelectItem value="internacional">Audiencia Internacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Métricas de Engagement */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            📊 MÉTRICAS DE ENGAGEMENT ESPERADO
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* engagement_esperado */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="engagement_esperado">Engagement Esperado</Label>
                <Badge variant="outline" className="text-xs">
                  {data.engagement_esperado || 0}/5
                </Badge>
              </div>
              <Input
                id="engagement_esperado"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Nivel de interacción esperado"
                value={data.engagement_esperado || ''}
                onChange={(e) => updateField('engagement_esperado', parseFloat(e.target.value) || 0)}
              />
              <Progress value={(data.engagement_esperado || 0) * 20} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Comentarios, shares, interacciones esperadas
              </p>
            </div>

            {/* potencial_viral */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="potencial_viral">Potencial Viral</Label>
                <Badge variant="outline" className="text-xs">
                  {data.potencial_viral || 0}/5
                </Badge>
              </div>
              <Input
                id="potencial_viral"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Probabilidad de volverse viral"
                value={data.potencial_viral || ''}
                onChange={(e) => updateField('potencial_viral', parseFloat(e.target.value) || 0)}
              />
              <Progress value={(data.potencial_viral || 0) * 20} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Capacidad de propagación espontánea
              </p>
            </div>

            {/* impacto_emocional_esperado */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="impacto_emocional_esperado">Impacto Emocional</Label>
                <Badge variant="outline" className="text-xs">
                  {data.impacto_emocional_esperado || 0}/5
                </Badge>
              </div>
              <Input
                id="impacto_emocional_esperado"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Intensidad emocional esperada"
                value={data.impacto_emocional_esperado || ''}
                onChange={(e) => updateField('impacto_emocional_esperado', parseFloat(e.target.value) || 0)}
              />
              <Progress value={(data.impacto_emocional_esperado || 0) * 20} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Respuesta emocional de la audiencia
              </p>
            </div>

            {/* duracion_interes_estimada */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="duracion_interes_estimada">Duración de Interés</Label>
                <Badge variant="outline" className="text-xs">
                  {data.duracion_interes_estimada || 0}/5
                </Badge>
              </div>
              <Input
                id="duracion_interes_estimada"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Duración del interés"
                value={data.duracion_interes_estimada || ''}
                onChange={(e) => updateField('duracion_interes_estimada', parseFloat(e.target.value) || 0)}
              />
              <Progress value={(data.duracion_interes_estimada || 0) * 20} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Tiempo que mantendrá el interés
              </p>
            </div>
          </div>
        </div>

        {/* Métricas Objetivo */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
            🎯 MÉTRICAS OBJETIVO ESPECÍFICAS
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reproducciones Objetivo</Label>
              <Input
                type="number"
                placeholder="Número esperado de reproducciones"
                value={data.metricas_objetivo?.reproducciones || ''}
                onChange={(e) => updateField('metricas_objetivo', {
                  ...data.metricas_objetivo,
                  reproducciones: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Shares Objetivo</Label>
              <Input
                type="number"
                placeholder="Número esperado de compartidos"
                value={data.metricas_objetivo?.shares || ''}
                onChange={(e) => updateField('metricas_objetivo', {
                  ...data.metricas_objetivo,
                  shares: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Comentarios Objetivo</Label>
              <Input
                type="number"
                placeholder="Número esperado de comentarios"
                value={data.metricas_objetivo?.comentarios || ''}
                onChange={(e) => updateField('metricas_objetivo', {
                  ...data.metricas_objetivo,
                  comentarios: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating Objetivo</Label>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Rating esperado (1-5)"
                value={data.metricas_objetivo?.rating || ''}
                onChange={(e) => updateField('metricas_objetivo', {
                  ...data.metricas_objetivo,
                  rating: parseFloat(e.target.value) || 0
                })}
              />
            </div>
          </div>
        </div>

        {/* Guía de Evaluación */}
        <div className="space-y-4">
          <h5 className="font-medium text-sm text-muted-foreground border-b pb-1">
            📋 GUÍA DE EVALUACIÓN
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="font-medium">Escala de Puntuación:</div>
              <div className="space-y-1">
                <div><span className="font-medium">5:</span> Excepcional - Historia viral garantizada</div>
                <div><span className="font-medium">4:</span> Alto - Gran potencial de éxito</div>
                <div><span className="font-medium">3:</span> Medio - Performance estándar esperado</div>
                <div><span className="font-medium">2:</span> Bajo - Audiencia limitada</div>
                <div><span className="font-medium">1:</span> Mínimo - Interés muy específico</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">Factores Clave:</div>
              <div className="space-y-1">
                <div>• <span className="font-medium">Originalidad:</span> Qué tan única es la historia</div>
                <div>• <span className="font-medium">Credibilidad:</span> Nivel de veracidad percibida</div>
                <div>• <span className="font-medium">Impacto:</span> Intensidad de la experiencia</div>
                <div>• <span className="font-medium">Relatable:</span> Conexión con la audiencia</div>
                <div>• <span className="font-medium">Shareable:</span> Facilidad para compartir</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Expectativas */}
        {(data.engagement_esperado || data.potencial_viral || data.impacto_emocional_esperado) && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h6 className="font-medium text-sm text-blue-800 mb-2">
              📈 Resumen de Expectativas
            </h6>
            <div className="text-xs text-blue-700">
              <p><span className="font-medium">Audiencia:</span> {data.audiencia_objetivo || 'No especificada'}</p>
              <p><span className="font-medium">Performance General:</span> {performanceInfo.level} ({porcentajePerformance}%)</p>
              <p><span className="font-medium">Punto Fuerte:</span> {
                metricas.reduce((max, current) => current.value > max.value ? current : max, metricas[0]).key === 'engagement_esperado' ? 'Engagement' :
                metricas.reduce((max, current) => current.value > max.value ? current : max, metricas[0]).key === 'potencial_viral' ? 'Potencial Viral' :
                metricas.reduce((max, current) => current.value > max.value ? current : max, metricas[0]).key === 'impacto_emocional_esperado' ? 'Impacto Emocional' :
                'Duración de Interés'
              }</p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
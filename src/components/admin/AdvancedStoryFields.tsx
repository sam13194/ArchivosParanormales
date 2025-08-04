'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Clock, Users, MapPin, Star, Shield, FileText, HelpCircle, Navigation } from "lucide-react";

interface AdvancedStoryFieldsProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
}

// Datos de ciudades principales de Colombia con coordenadas
const CIUDADES_COLOMBIA = {
  'Bogotá': { latitud: 4.5981, longitud: -74.0758, precision: 50000, departamento: 'Cundinamarca', codigo_depto: '25', codigo_ciudad: '25001' },
  'Medellín': { latitud: 6.2442, longitud: -75.5812, precision: 30000, departamento: 'Antioquia', codigo_depto: '05', codigo_ciudad: '05001' },
  'Cali': { latitud: 3.4516, longitud: -76.5320, precision: 25000, departamento: 'Valle del Cauca', codigo_depto: '76', codigo_ciudad: '76001' },
  'Barranquilla': { latitud: 10.9639, longitud: -74.7964, precision: 20000, departamento: 'Atlántico', codigo_depto: '08', codigo_ciudad: '08001' },
  'Cartagena': { latitud: 10.3910, longitud: -75.4794, precision: 15000, departamento: 'Bolívar', codigo_depto: '13', codigo_ciudad: '13001' },
  'Bucaramanga': { latitud: 7.1193, longitud: -73.1227, precision: 15000, departamento: 'Santander', codigo_depto: '68', codigo_ciudad: '68001' },
  'Santa Marta': { latitud: 11.2408, longitud: -74.2099, precision: 12000, departamento: 'Magdalena', codigo_depto: '47', codigo_ciudad: '47001' },
  'Pereira': { latitud: 4.8133, longitud: -75.6961, precision: 10000, departamento: 'Risaralda', codigo_depto: '66', codigo_ciudad: '66001' },
  'Manizales': { latitud: 5.0700, longitud: -75.5138, precision: 8000, departamento: 'Caldas', codigo_depto: '17', codigo_ciudad: '17001' },
  'Armenia': { latitud: 4.5339, longitud: -75.6811, precision: 8000, departamento: 'Quindío', codigo_depto: '63', codigo_ciudad: '63001' }
};

export default function AdvancedStoryFields({ formData, setFormData }: AdvancedStoryFieldsProps) {
  // Agregar testigo secundario
  const addSecondaryWitness = () => {
    setFormData(prev => ({
      ...prev,
      testigos_secundarios: [
        ...(prev.testigos_secundarios || []),
        {
          pseudonimo: '',
          edad: '',
          ocupacion: '',
          relacion_evento: '',
          presencial: true,
          credibilidad: 5,
          antecedentes_paranormales: false,
          contacto_disponible: false,
          notas: ''
        }
      ]
    }));
  };

  // Remover testigo secundario
  const removeSecondaryWitness = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testigos_secundarios: prev.testigos_secundarios?.filter((_: any, i: number) => i !== index) || []
    }));
  };

  // Agregar entidad paranormal
  const addEntity = () => {
    setFormData(prev => ({
      ...prev,
      entidades_reportadas: [
        ...(prev.entidades_reportadas || []),
        {
          nombre: '',
          tipo: 'fantasma',
          descripcion_fisica: '',
          comportamiento: '',
          hostilidad: 1,
          genero: '',
          edad_min: null,
          edad_max: null,
          vestimenta: '',
          caracteristicas: '',
          patron_comportamiento: '',
          triggers: [],
          palabras_clave: []
        }
      ]
    }));
  };

  // Remover entidad
  const removeEntity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      entidades_reportadas: prev.entidades_reportadas?.filter((_: any, i: number) => i !== index) || []
    }));
  };

  // Autocompletar coordenadas basadas en la ciudad
  const autocompletarCoordenadas = () => {
    const ciudadActual = formData.ubicacion?.ciudad || '';
    const ciudadData = CIUDADES_COLOMBIA[ciudadActual as keyof typeof CIUDADES_COLOMBIA];
    
    if (ciudadData) {
      setFormData(prev => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          latitud: ciudadData.latitud,
          longitud: ciudadData.longitud,
          precision_metros: ciudadData.precision,
          nivel1_codigo: ciudadData.codigo_depto,
          nivel2_codigo: ciudadData.codigo_ciudad,
          departamento: ciudadData.departamento
        }
      }));
    }
  };

  // Detectar si la ciudad actual tiene datos de autocompletado disponibles
  const ciudadTieneCoordenadasDisponibles = () => {
    const ciudadActual = formData.ubicacion?.ciudad || '';
    return ciudadActual in CIUDADES_COLOMBIA;
  };

  // Función para estimar hora aproximada (mañana, tarde, noche)
  const establecerHoraAproximada = (periodo: string) => {
    const horas = {
      'madrugada': '03:00',
      'amanecer': '06:00', 
      'mañana': '09:00',
      'mediodia': '12:00',
      'tarde': '15:00',
      'atardecer': '18:00',
      'noche': '21:00',
      'medianoche': '00:00'
    };
    
    const hora = horas[periodo as keyof typeof horas];
    if (hora) {
      setFormData(prev => ({
        ...prev,
        hora_evento: hora
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Ubicación Avanzada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación Avanzada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botón de autocompletado si la ciudad es reconocida */}
          {ciudadTieneCoordenadasDisponibles() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Coordenadas disponibles para {formData.ubicacion?.ciudad}
                    </p>
                    <p className="text-xs text-blue-600">
                      Puedes autocompletar las coordenadas del centro de la ciudad
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={autocompletarCoordenadas}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📍 Autocompletar
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="latitud">Latitud</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Opcional - Solo si tienes coordenadas GPS exactas
                  </div>
                </div>
              </div>
              <Input
                id="latitud"
                type="number"
                step="any"
                placeholder="4.5981 (opcional)"
                value={formData.ubicacion?.latitud || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ubicacion: {
                    ...prev.ubicacion,
                    latitud: e.target.value ? parseFloat(e.target.value) : null
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="longitud">Longitud</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Opcional - Solo si tienes coordenadas GPS exactas
                  </div>
                </div>
              </div>
              <Input
                id="longitud"
                type="number"
                step="any"
                placeholder="-74.0758 (opcional)"
                value={formData.ubicacion?.longitud || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ubicacion: {
                    ...prev.ubicacion,
                    longitud: e.target.value ? parseFloat(e.target.value) : null
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="altitud">Altitud (metros)</Label>
              <Input
                id="altitud"
                type="number"
                placeholder="2640"
                value={formData.ubicacion?.altitud_metros || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ubicacion: {
                    ...prev.ubicacion,
                    altitud_metros: e.target.value ? parseInt(e.target.value) : null
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="codigo-departamento">Código Departamento</Label>
              <Input
                id="codigo-departamento"
                placeholder="25 (Cundinamarca)"
                value={formData.ubicacion?.nivel1_codigo || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ubicacion: {
                    ...prev.ubicacion,
                    nivel1_codigo: e.target.value
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="codigo-ciudad">Código Ciudad</Label>
              <Input
                id="codigo-ciudad"
                placeholder="25001 (Bogotá)"
                value={formData.ubicacion?.nivel2_codigo || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ubicacion: {
                    ...prev.ubicacion,
                    nivel2_codigo: e.target.value
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precision-metros">Precisión (metros)</Label>
              <Input
                id="precision-metros"
                type="number"
                placeholder="100"
                value={formData.ubicacion?.precision_metros || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ubicacion: {
                    ...prev.ubicacion,
                    precision_metros: e.target.value ? parseInt(e.target.value) : 100
                  }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fechas y Tiempo Detalladas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Fechas y Tiempo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="hora-evento">Hora del Evento</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Opcional - Si no sabes la hora exacta, usa los botones abajo
                  </div>
                </div>
              </div>
              <Input
                id="hora-evento"
                type="time"
                value={formData.hora_evento || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  hora_evento: e.target.value
                }))}
              />
              {!formData.hora_evento && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">¿Hora aproximada?</p>
                  <div className="grid grid-cols-2 gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => establecerHoraAproximada('mañana')}
                    >
                      🌅 Mañana
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => establecerHoraAproximada('tarde')}
                    >
                      ☀️ Tarde
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => establecerHoraAproximada('noche')}
                    >
                      🌙 Noche
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => establecerHoraAproximada('madrugada')}
                    >
                      🌌 Madrugada
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="duracion-minutos">Duración (minutos)</Label>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Opcional - ¿Cuánto duró el evento paranormal?
                  </div>
                </div>
              </div>
              <Input
                id="duracion-minutos"
                type="number"
                placeholder="30 (opcional)"
                value={formData.duracion_evento_minutos || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  duracion_evento_minutos: e.target.value ? parseInt(e.target.value) : null
                }))}
              />
              {!formData.duracion_evento_minutos && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Estimaciones comunes:</p>
                  <div className="flex gap-1 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setFormData(prev => ({ ...prev, duracion_evento_minutos: 5 }))}
                    >
                      5 min
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setFormData(prev => ({ ...prev, duracion_evento_minutos: 15 }))}
                    >
                      15 min
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setFormData(prev => ({ ...prev, duracion_evento_minutos: 30 }))}
                    >
                      30 min
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setFormData(prev => ({ ...prev, duracion_evento_minutos: 60 }))}
                    >
                      1 hora
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="epoca-historica">Época Histórica</Label>
              <Select 
                value={formData.epoca_historica || 'Contemporánea'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  epoca_historica: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contemporánea">Contemporánea</SelectItem>
                  <SelectItem value="Siglo XX">Siglo XX</SelectItem>
                  <SelectItem value="Siglo XIX">Siglo XIX</SelectItem>
                  <SelectItem value="Colonial">Colonial</SelectItem>
                  <SelectItem value="Prehispánica">Prehispánica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testigo Principal Expandido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Testigo Principal - Información Completa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testigo-relacion">Relación con el Evento</Label>
              <Input
                id="testigo-relacion"
                placeholder="Testigo directo durante turno nocturno"
                value={formData.testigo_principal?.relacion_evento || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  testigo_principal: {
                    ...prev.testigo_principal,
                    relacion_evento: e.target.value
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testigo-presencial">¿Testigo Presencial?</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="testigo-presencial"
                  checked={formData.testigo_principal?.presencial !== false}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    testigo_principal: {
                      ...prev.testigo_principal,
                      presencial: checked
                    }
                  }))}
                />
                <span className="text-sm">
                  {formData.testigo_principal?.presencial !== false ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="antecedentes-paranormales">¿Antecedentes Paranormales?</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="antecedentes-paranormales"
                  checked={formData.testigo_principal?.antecedentes_paranormales || false}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    testigo_principal: {
                      ...prev.testigo_principal,
                      antecedentes_paranormales: checked
                    }
                  }))}
                />
                <span className="text-sm">
                  {formData.testigo_principal?.antecedentes_paranormales ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contacto-disponible">¿Contacto Disponible?</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="contacto-disponible"
                  checked={formData.testigo_principal?.contacto_disponible || false}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    testigo_principal: {
                      ...prev.testigo_principal,
                      contacto_disponible: checked
                    }
                  }))}
                />
                <span className="text-sm">
                  {formData.testigo_principal?.contacto_disponible ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notas-testigo">Notas sobre el Testigo</Label>
            <Textarea
              id="notas-testigo"
              placeholder="Empleada con 5 años de experiencia, relato consistente..."
              rows={2}
              value={formData.testigo_principal?.notas || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                testigo_principal: {
                  ...prev.testigo_principal,
                  notas: e.target.value
                }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Testigos Secundarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Testigos Secundarios
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSecondaryWitness}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar Testigo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.testigos_secundarios || []).map((testigo: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Testigo Secundario #{index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSecondaryWitness(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Pseudónimo"
                  value={testigo.pseudonimo || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    testigos_secundarios: prev.testigos_secundarios?.map((t: any, i: number) => 
                      i === index ? { ...t, pseudonimo: e.target.value } : t
                    ) || []
                  }))}
                />
                
                <Input
                  placeholder="Edad (ej: 45-50 años)"
                  value={testigo.edad || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    testigos_secundarios: prev.testigos_secundarios?.map((t: any, i: number) => 
                      i === index ? { ...t, edad: e.target.value } : t
                    ) || []
                  }))}
                />
                
                <Input
                  placeholder="Ocupación"
                  value={testigo.ocupacion || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    testigos_secundarios: prev.testigos_secundarios?.map((t: any, i: number) => 
                      i === index ? { ...t, ocupacion: e.target.value } : t
                    ) || []
                  }))}
                />
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Credibilidad:</span>
                  <Input
                      type="number"
                      min="1"
                      max="10"
                      value={testigo.credibilidad || 5}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        testigos_secundarios: prev.testigos_secundarios?.map((t: any, i: number) => 
                          i === index ? { ...t, credibilidad: parseInt(e.target.value) || 5 } : t
                        ) || []
                      }))}
                      className="w-20"
                    />
                </div>
              </div>
              
              <Textarea
                placeholder="Relación con el evento y notas..."
                rows={2}
                value={testigo.relacion_evento || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  testigos_secundarios: prev.testigos_secundarios?.map((t: any, i: number) => 
                    i === index ? { ...t, relacion_evento: e.target.value } : t
                  ) || []
                }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contexto Ambiental Completo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Contexto Ambiental Completo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                placeholder="14"
                value={formData.contexto_ambiental?.temperatura || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contexto_ambiental: {
                    ...prev.contexto_ambiental,
                    temperatura: e.target.value ? parseInt(e.target.value) : null
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="humedad">Humedad (%)</Label>
              <Input
                id="humedad"
                type="number"
                placeholder="65"
                value={formData.contexto_ambiental?.humedad || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contexto_ambiental: {
                    ...prev.contexto_ambiental,
                    humedad: e.target.value ? parseInt(e.target.value) : null
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fase-lunar">Fase Lunar</Label>
              <Select 
                value={formData.contexto_ambiental?.fase_lunar || ''}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  contexto_ambiental: {
                    ...prev.contexto_ambiental,
                    fase_lunar: value
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Luna nueva">Luna nueva</SelectItem>
                  <SelectItem value="Cuarto creciente">Cuarto creciente</SelectItem>
                  <SelectItem value="Luna llena">Luna llena</SelectItem>
                  <SelectItem value="Cuarto menguante">Cuarto menguante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="festividad-religiosa">Festividad Religiosa</Label>
              <Input
                id="festividad-religiosa"
                placeholder="Ninguna, Semana Santa, etc."
                value={formData.contexto_ambiental?.festividad_religiosa || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contexto_ambiental: {
                    ...prev.contexto_ambiental,
                    festividad_religiosa: e.target.value
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="evento-historico">Evento Histórico</Label>
              <Input
                id="evento-historico"
                placeholder="Aniversario, fecha especial..."
                value={formData.contexto_ambiental?.evento_historico || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contexto_ambiental: {
                    ...prev.contexto_ambiental,
                    evento_historico: e.target.value
                  }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aniversario-especial">Aniversario Especial</Label>
              <Input
                id="aniversario-especial"
                placeholder="Muerte de propietaria, etc."
                value={formData.contexto_ambiental?.aniversario_especial || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contexto_ambiental: {
                    ...prev.contexto_ambiental,
                    aniversario_especial: e.target.value
                  }
                }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="actividad-previa">Actividad Previa</Label>
            <Textarea
              id="actividad-previa"
              placeholder="Check-in de huéspedes, limpieza de habitaciones..."
              rows={2}
              value={formData.contexto_ambiental?.actividad_previa || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contexto_ambiental: {
                  ...prev.contexto_ambiental,
                  actividad_previa: e.target.value
                }
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estado-emocional">Estado Emocional de Testigos</Label>
            <Input
              id="estado-emocional"
              placeholder="Calma inicial, tensión después del avistamiento..."
              value={formData.contexto_ambiental?.estado_emocional || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contexto_ambiental: {
                  ...prev.contexto_ambiental,
                  estado_emocional: e.target.value
                }
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patron-temporal">¿Se Detectó Patrón Temporal?</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="patron-temporal"
                checked={formData.contexto_ambiental?.patron_temporal || false}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  contexto_ambiental: {
                    ...prev.contexto_ambiental,
                    patron_temporal: checked
                  }
                }))}
              />
              <span className="text-sm">
                {formData.contexto_ambiental?.patron_temporal ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factores de Credibilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Factores de Credibilidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evidencia-fisica">Evidencia Física (1-5)</Label>
              <Input
                id="evidencia-fisica"
                type="number"
                min="1"
                max="5"
                value={formData.evidencia_fisica || 1}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  evidencia_fisica: parseInt(e.target.value) || 1
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="consistencia-relatos">Consistencia de Relatos (1-5)</Label>
              <Input
                id="consistencia-relatos"
                type="number"
                min="1"
                max="5"
                value={formData.consistencia_relatos || 3}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  consistencia_relatos: parseInt(e.target.value) || 3
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contexto-historico">Contexto Histórico (1-5)</Label>
              <Input
                id="contexto-historico"
                type="number"
                min="1"
                max="5"
                value={formData.contexto_historico || 3}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contexto_historico: parseInt(e.target.value) || 3
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sobriedad-testigo">Sobriedad del Testigo (1-5)</Label>
              <Input
                id="sobriedad-testigo"
                type="number"
                min="1"
                max="5"
                value={formData.sobriedad_testigo || 4}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sobriedad_testigo: parseInt(e.target.value) || 4
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conocimiento-previo">Conocimiento Previo (1-5)</Label>
              <Input
                id="conocimiento-previo"
                type="number"
                min="1"
                max="5"
                value={formData.conocimiento_previo || 3}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  conocimiento_previo: parseInt(e.target.value) || 3
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado-emocional-factor">Estado Emocional (1-5)</Label>
              <Input
                id="estado-emocional-factor"
                type="number"
                min="1"
                max="5"
                value={formData.estado_emocional_factor || 3}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  estado_emocional_factor: parseInt(e.target.value) || 3
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campos Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="protagonistas-descripcion">Descripción de Protagonistas</Label>
            <Textarea
              id="protagonistas-descripcion"
              placeholder="Personal nocturno del hotel..."
              rows={2}
              value={formData.protagonistas_descripcion || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                protagonistas_descripcion: e.target.value
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="palabras-clave">Palabras Clave (separadas por coma)</Label>
            <Input
              id="palabras-clave"
              placeholder="hotel, fantasma, dama_gris, pasillos"
              value={(formData.palabras_clave_patron || []).join(', ')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                palabras_clave_patron: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duracion-impacto">Duración del Impacto Emocional</Label>
            <Select 
              value={formData.duracion_impacto_emocional || 'media'}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                duracion_impacto_emocional: value
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="permanente">Permanente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notas-adicionales">Notas Adicionales</Label>
            <Textarea
              id="notas-adicionales"
              placeholder="Historia reportada múltiples veces por diferentes empleados..."
              rows={3}
              value={formData.notas_adicionales || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                notas_adicionales: e.target.value
              }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="audiencia-objetivo">Audiencia Objetivo</Label>
              <Select 
                value={formData.audiencia_objetivo || 'general'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  audiencia_objetivo: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="joven_adulto">Joven Adulto</SelectItem>
                  <SelectItem value="adulto">Adulto</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="engagement-esperado">Engagement Esperado</Label>
              <Select 
                value={formData.engagement_esperado || 'medio'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  engagement_esperado: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bajo">Bajo</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Derechos y Permisos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Derechos y Permisos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="derechos-uso">Derechos de Uso</Label>
              <Select 
                value={formData.derechos_uso || 'permiso_verbal'}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  derechos_uso: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permiso_verbal">Permiso Verbal</SelectItem>
                  <SelectItem value="contrato_firmado">Contrato Firmado</SelectItem>
                  <SelectItem value="dominio_publico">Dominio Público</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contacto-derechos">Contacto para Derechos</Label>
              <Input
                id="contacto-derechos"
                placeholder="admin@archivos-paranormales.com"
                value={formData.contacto_derechos || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contacto_derechos: e.target.value
                }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restricciones-uso">Restricciones de Uso</Label>
            <Textarea
              id="restricciones-uso"
              placeholder="Mantener anonimato de testigos..."
              rows={2}
              value={formData.restricciones_uso || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                restricciones_uso: e.target.value
              }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="autorizacion-comercial">¿Autorización Comercial?</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autorizacion-comercial"
                  checked={formData.autorizacion_comercial !== false}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    autorizacion_comercial: checked
                  }))}
                />
                <span className="text-sm">
                  {formData.autorizacion_comercial !== false ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autorizacion-adaptacion">¿Autorización para Adaptación?</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autorizacion-adaptacion"
                  checked={formData.autorizacion_adaptacion !== false}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    autorizacion_adaptacion: checked
                  }))}
                />
                <span className="text-sm">
                  {formData.autorizacion_adaptacion !== false ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
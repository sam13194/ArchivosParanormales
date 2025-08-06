'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, Plus, X, Database } from "lucide-react";

interface ElementosClaveSectionProps {
  data: string[];
  setData: (data: string[]) => void;
}

export default function ElementosClaveSection({ data, setData }: ElementosClaveSectionProps) {
  
  const addElemento = () => {
    setData([...data, '']);
  };

  const removeElemento = (index: number) => {
    const nuevosElementos = data.filter((_, i) => i !== index);
    setData(nuevosElementos);
  };

  const updateElemento = (index: number, value: string) => {
    const nuevosElementos = [...data];
    nuevosElementos[index] = value;
    setData(nuevosElementos);
  };

  // Elementos predefinidos comunes
  const elementosPredefinidos = [
    'Aparición fantasmal',
    'Movimiento de objetos',
    'Sonidos inexplicables',
    'Cambios de temperatura',
    'Presencia invisible',
    'Olores extraños',
    'Luces inexplicables',
    'Sensación de ser observado',
    'Voces desincorporadas',
    'Puertas que se abren solas',
    'Pasos sin origen',
    'Sombras sin explicación',
    'Electrónicos que fallan',
    'Animales alterados',
    'Sueños premonitorios'
  ];

  const agregarElementoPredefinido = (elemento: string) => {
    if (!data.includes(elemento)) {
      setData([...data, elemento]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          TABLA: elementos_clave
          <Badge variant="secondary" className="text-xs">7 columnas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1 flex-1">
            🔑 ELEMENTOS CLAVE DE LA HISTORIA ({data.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addElemento}
            className="ml-4"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar Elemento
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Identifica los elementos más importantes y característicos de esta historia paranormal. Estos elementos ayudan a categorizar y buscar historias similares.</p>
        </div>
        
        {/* Elementos Actuales */}
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay elementos clave definidos</p>
            <p className="text-xs">Agrega elementos para caracterizar mejor la historia</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((elemento, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Elemento clave #${index + 1}`}
                  value={elemento}
                  onChange={(e) => updateElemento(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeElemento(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Elementos Predefinidos */}
        <div className="space-y-4">
          <h5 className="font-medium text-sm text-muted-foreground border-b pb-1">
            💡 ELEMENTOS PREDEFINIDOS COMUNES
          </h5>
          
          <div className="text-xs text-muted-foreground mb-2">
            Haz clic en cualquier elemento para agregarlo a tu lista:
          </div>
          
          <div className="flex flex-wrap gap-2">
            {elementosPredefinidos.map((elemento, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => agregarElementoPredefinido(elemento)}
                disabled={data.includes(elemento)}
                className={`text-xs ${data.includes(elemento) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {elemento}
                {data.includes(elemento) && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Resumen */}
        {data.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h6 className="font-medium text-sm text-blue-800 mb-2">
              Elementos seleccionados:
            </h6>
            <div className="flex flex-wrap gap-1">
              {data.filter(elemento => elemento.trim() !== '').map((elemento, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {elemento}
                </Badge>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface FilterOptions {
  generos: string[];
  verificaciones: string[];
  departamentos: string[];
  ciudades: string[];
  ranges: {
    impacto: { min: number; max: number };
    credibilidad: { min: number; max: number };
  };
  ordenamiento: Array<{value: string; label: string}>;
}

interface StoriesFilterProps {
  options: FilterOptions;
  filters: any;
  onFilterChange: (filters: any) => void;
}

export function StoriesFilter({ options, filters, onFilterChange }: StoriesFilterProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSliderChange = (key: string, values: number[]) => {
    handleFilterUpdate(key, values[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Género */}
          <div className="space-y-2">
            <Label>Género Principal</Label>
            <Select
              value={localFilters.genero || ''}
              onValueChange={(value) => handleFilterUpdate('genero', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los géneros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los géneros</SelectItem>
                {options.generos.map((genero) => (
                  <SelectItem key={genero} value={genero}>
                    {genero.charAt(0).toUpperCase() + genero.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nivel de Verificación */}
          <div className="space-y-2">
            <Label>Nivel de Verificación</Label>
            <Select
              value={localFilters.verificacion || ''}
              onValueChange={(value) => handleFilterUpdate('verificacion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Cualquier nivel</SelectItem>
                {options.verificaciones.map((verificacion) => (
                  <SelectItem key={verificacion} value={verificacion}>
                    {verificacion.replace('_', ' ').charAt(0).toUpperCase() + verificacion.replace('_', ' ').slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Departamento */}
          <div className="space-y-2">
            <Label>Departamento</Label>
            <Select
              value={localFilters.departamento || ''}
              onValueChange={(value) => handleFilterUpdate('departamento', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Cualquier departamento</SelectItem>
                {options.departamentos.map((depto) => (
                  <SelectItem key={depto} value={depto}>
                    {depto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ciudad */}
          <div className="space-y-2">
            <Label>Ciudad</Label>
            <Select
              value={localFilters.ciudad || ''}
              onValueChange={(value) => handleFilterUpdate('ciudad', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Cualquier ciudad</SelectItem>
                {options.ciudades.map((ciudad) => (
                  <SelectItem key={ciudad} value={ciudad}>
                    {ciudad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nivel de Impacto */}
          <div className="space-y-3">
            <Label>Nivel de Impacto Mínimo: {localFilters.impacto_min || options.ranges.impacto.min}</Label>
            <Slider
              value={[localFilters.impacto_min || options.ranges.impacto.min]}
              onValueChange={(values) => handleSliderChange('impacto_min', values)}
              max={options.ranges.impacto.max}
              min={options.ranges.impacto.min}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{options.ranges.impacto.min}</span>
              <span>{options.ranges.impacto.max}</span>
            </div>
          </div>

          {/* Credibilidad */}
          <div className="space-y-3">
            <Label>Credibilidad Mínima: {localFilters.credibilidad_min ? parseFloat(localFilters.credibilidad_min).toFixed(1) : options.ranges.credibilidad.min}</Label>
            <Slider
              value={[localFilters.credibilidad_min || options.ranges.credibilidad.min]}
              onValueChange={(values) => handleSliderChange('credibilidad_min', values)}
              max={options.ranges.credibilidad.max}
              min={options.ranges.credibilidad.min}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{options.ranges.credibilidad.min}</span>
              <span>{options.ranges.credibilidad.max}</span>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-2">
            <Label>Fecha Desde</Label>
            <Input
              type="date"
              value={localFilters.fecha_desde || ''}
              onChange={(e) => handleFilterUpdate('fecha_desde', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha Hasta</Label>
            <Input
              type="date"
              value={localFilters.fecha_hasta || ''}
              onChange={(e) => handleFilterUpdate('fecha_hasta', e.target.value)}
            />
          </div>

          {/* Ordenamiento */}
          <div className="space-y-2">
            <Label>Ordenar Por</Label>
            <Select
              value={localFilters.orden || 'fecha_desc'}
              onValueChange={(value) => handleFilterUpdate('orden', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.ordenamiento.map((orden) => (
                  <SelectItem key={orden.value} value={orden.value}>
                    {orden.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* Información de Filtros Activos */}
        {Object.keys(localFilters).filter(key => localFilters[key] && localFilters[key] !== '').length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Filtros Activos:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(localFilters).map(([key, value]) => {
                if (!value || value === '') return null;
                return (
                  <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}
                    <button
                      onClick={() => handleFilterUpdate(key, '')}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
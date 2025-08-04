import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Helper functions for field status
export const isFieldPopulated = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'boolean') return true; // Boolean fields are always considered populated
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return false;
};

export const getFieldStatus = (value: any, isRequired: boolean = false): 'populated' | 'empty' | 'required' => {
  const populated = isFieldPopulated(value);
  if (populated) return 'populated';
  return isRequired ? 'required' : 'empty';
};

// Visual indicator components
export const FieldStatusIcon = ({ status }: { status: 'populated' | 'empty' | 'required' }) => {
  switch (status) {
    case 'populated':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'required':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'empty':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    default:
      return null;
  }
};

export const getFieldInputClass = (status: 'populated' | 'empty' | 'required'): string => {
  const baseClasses = 'transition-all duration-200';
  switch (status) {
    case 'populated':
      return `${baseClasses} !border-green-400 !bg-green-100 focus:!border-green-500 focus:!ring-green-500 focus:!ring-2`;
    case 'required':
      return `${baseClasses} !border-red-400 !bg-red-50 focus:!border-red-500 focus:!ring-red-500 focus:!ring-2`;
    case 'empty':
      return `${baseClasses} !border-amber-400 !bg-amber-50 focus:!border-amber-500 focus:!ring-amber-500 focus:!ring-2`;
    default:
      return baseClasses;
  }
};

export const getSelectTriggerClass = (status: 'populated' | 'empty' | 'required'): string => {
  const baseClasses = 'transition-all duration-200';
  switch (status) {
    case 'populated':
      return `${baseClasses} border-green-300 bg-green-100 hover:bg-green-200`;
    case 'required':
      return `${baseClasses} border-red-300 bg-red-50 hover:bg-red-100`;
    case 'empty':
      return `${baseClasses} border-amber-300 bg-amber-50 hover:bg-amber-100`;
    default:
      return baseClasses;
  }
};

export const getTextareaClass = (status: 'populated' | 'empty' | 'required'): string => {
  const baseClasses = 'transition-all duration-200';
  switch (status) {
    case 'populated':
      return `${baseClasses} !border-green-400 !bg-green-100 focus:!border-green-500 focus:!ring-green-500 focus:!ring-2`;
    case 'required':
      return `${baseClasses} !border-red-400 !bg-red-50 focus:!border-red-500 focus:!ring-red-500 focus:!ring-2`;
    case 'empty':
      return `${baseClasses} !border-amber-400 !bg-amber-50 focus:!border-amber-500 focus:!ring-amber-500 focus:!ring-2`;
    default:
      return baseClasses;
  }
};

export const FieldLabel = ({ 
  children, 
  status, 
  required = false 
}: { 
  children: React.ReactNode; 
  status: 'populated' | 'empty' | 'required';
  required?: boolean;
}) => (
  <Label className="flex items-center gap-2 font-medium">
    <FieldStatusIcon status={status} />
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </Label>
);

export const FieldHelpText = ({ 
  status, 
  requiredMessage,
  populatedMessage,
  emptyMessage 
}: {
  status: 'populated' | 'empty' | 'required';
  requiredMessage?: string;
  populatedMessage?: string;
  emptyMessage?: string;
}) => {
  // Solo mostrar mensajes para campos requeridos que están vacíos
  if (status === 'required' && requiredMessage) {
    return (
      <p className="text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {requiredMessage}
      </p>
    );
  }
  
  // No mostrar mensajes para campos poblados o vacíos opcionales
  // Los indicadores visuales de color ya proporcionan la información necesaria
  return null;
};

// Global legend component
export const FieldIndicatorsLegend = () => (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-4 space-y-3 shadow-sm">
    <h4 className="font-bold text-base text-blue-900 flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      🎯 Sistema de Indicadores Visuales de Campos
    </h4>
    <div className="grid grid-cols-3 gap-4 text-sm font-medium">
      <div className="flex items-center gap-2 p-2 bg-green-100 rounded border border-green-300">
        <Check className="h-4 w-4 text-green-600" />
        <span className="text-green-800">✅ Campo Completo</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-red-100 rounded border border-red-300">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-red-800">❌ Requerido Faltante</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-amber-100 rounded border border-amber-300">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span className="text-amber-800">⚠️ Opcional Vacío</span>
      </div>
    </div>
    <p className="text-xs text-blue-700 italic">
      Los campos cambiarán de color automáticamente según su estado. Los iconos en las etiquetas indican el estado actual.
    </p>
  </div>
);
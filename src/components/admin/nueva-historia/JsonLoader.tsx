'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";

interface JsonLoaderProps {
  jsonFile: File | null;
  setJsonFile: (file: File | null) => void;
  isLoadingJson: boolean;
  handleJsonLoad: (file: File) => Promise<void>;
  downloadJsonTemplate: () => void;
}

export default function JsonLoader({
  jsonFile,
  setJsonFile,
  isLoadingJson,
  handleJsonLoad,
  downloadJsonTemplate
}: JsonLoaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Carga Masiva JSON
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="json-upload">Cargar desde JSON</Label>
            <div className="flex gap-2">
              <Input
                id="json-upload"
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setJsonFile(file);
                    handleJsonLoad(file);
                  }
                }}
                className="flex-1"
              />
              {jsonFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setJsonFile(null);
                    const input = document.getElementById('json-upload') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                >
                  ×
                </Button>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={downloadJsonTemplate}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Descargar Plantilla
          </Button>
        </div>
        
        {isLoadingJson && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">Cargando datos del JSON...</p>
          </div>
        )}
        
        {jsonFile && !isLoadingJson && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✓ JSON cargado: {jsonFile.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Agregar validación específica para arrays
const validateArrayFields = (data: any) => {
  const arrayFields = ['advertencias', 'banderas_rojas', 'palabras_clave_patron'];
  
  arrayFields.forEach(field => {
    if (data[field] && !Array.isArray(data[field])) {
      // Convertir string separado por comas a array
      if (typeof data[field] === 'string') {
        data[field] = data[field].split(',').map(s => s.trim()).filter(Boolean);
      } else {
        data[field] = [];
      }
    }
  });
  
  return data;
};
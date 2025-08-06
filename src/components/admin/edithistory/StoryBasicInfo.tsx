'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText } from "lucide-react";

interface StoryBasicInfoProps {
  newStoryForm: any;
  setNewStoryForm: (form: any) => void;
}

export default function StoryBasicInfo({ newStoryForm, setNewStoryForm }: StoryBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Información Básica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="titulo">Título de la Historia *</Label>
          <Input
            id="titulo"
            placeholder="Ej: La Casa Embrujada de la Candelaria"
            value={newStoryForm.titulo}
            onChange={(e) => setNewStoryForm(prev => ({ ...prev, titulo: e.target.value }))}
          />
        </div>

        {/* Descripción Corta */}
        <div className="space-y-2">
          <Label htmlFor="descripcion-corta">Descripción Corta *</Label>
          <Textarea
            id="descripcion-corta"
            placeholder="Resumen breve de la historia (máximo 150 caracteres)"
            rows={2}
            maxLength={150}
            value={newStoryForm.descripcion_corta}
            onChange={(e) => setNewStoryForm(prev => ({ ...prev, descripcion_corta: e.target.value }))}
          />
          <div className="text-right text-xs text-muted-foreground">
            {newStoryForm.descripcion_corta.length}/150
          </div>
        </div>

        {/* Descripción Larga */}
        <div className="space-y-2">
          <Label htmlFor="descripcion-larga">Descripción Larga</Label>
          <Textarea
            id="descripcion-larga"
            placeholder="Descripción detallada de la historia"
            rows={3}
            value={newStoryForm.descripcion_larga}
            onChange={(e) => setNewStoryForm(prev => ({ ...prev, descripcion_larga: e.target.value }))}
          />
        </div>

        {/* Testimonio Completo */}
        <div className="space-y-2">
          <Label htmlFor="testimonio-completo">Testimonio Completo *</Label>
          <Textarea
            id="testimonio-completo"
            placeholder="Testimonio completo tal como fue relatado..."
            rows={6}
            value={newStoryForm.testimonio_completo}
            onChange={(e) => setNewStoryForm(prev => ({ ...prev, testimonio_completo: e.target.value }))}
          />
        </div>

        {/* Extracto Verbatim */}
        <div className="space-y-2">
          <Label htmlFor="extracto-verbatim">Extracto Verbatim</Label>
          <Textarea
            id="extracto-verbatim"
            placeholder="Frase o párrafo exacto más impactante del testimonio"
            rows={2}
            value={newStoryForm.extracto_verbatim}
            onChange={(e) => setNewStoryForm(prev => ({ ...prev, extracto_verbatim: e.target.value }))}
          />
        </div>

        {/* Historia Reescrita */}
        <div className="space-y-2">
          <Label htmlFor="historia-reescrita">Historia Reescrita</Label>
          <Textarea
            id="historia-reescrita"
            placeholder="Versión narrativa y literaria de la historia"
            rows={4}
            value={newStoryForm.historia_reescrita}
            onChange={(e) => setNewStoryForm(prev => ({ ...prev, historia_reescrita: e.target.value }))}
          />
        </div>

        {/* Palabras Clave */}
        <div className="space-y-2">
          <Label htmlFor="palabras-clave">Palabras Clave</Label>
          <Input
            id="palabras-clave"
            placeholder="Ej: fantasma, casa, aparición, nocturno (separadas por comas)"
            value={newStoryForm.palabras_clave}
            onChange={(e) => setNewStoryForm(prev => ({ ...prev, palabras_clave: e.target.value }))}
          />
        </div>

        {/* Fuente del Relato */}
        <div className="space-y-2">
          <Label htmlFor="fuente-relato">Fuente del Relato</Label>
          <Select 
            value={newStoryForm.fuente_relato}
            onValueChange={(value) => setNewStoryForm(prev => ({ ...prev, fuente_relato: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="llamada_oyente">Llamada de Oyente</SelectItem>
              <SelectItem value="historia_programa">Historia del Programa</SelectItem>
              <SelectItem value="investigacion_propia">Investigación Propia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contenido-sensible"
              checked={newStoryForm.contenido_sensible}
              onCheckedChange={(checked) => setNewStoryForm(prev => ({ 
                ...prev, 
                contenido_sensible: checked as boolean 
              }))}
            />
            <Label htmlFor="contenido-sensible">Contenido Sensible</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="publicar-inmediatamente"
              checked={newStoryForm.publicar_inmediatamente}
              onCheckedChange={(checked) => setNewStoryForm(prev => ({ 
                ...prev, 
                publicar_inmediatamente: checked as boolean 
              }))}
            />
            <Label htmlFor="publicar-inmediatamente">Publicar Inmediatamente</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
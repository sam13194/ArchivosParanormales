'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, Construction, ArrowRight
} from "lucide-react";

interface VistaPrincipalProps {
  // Props will be added later when implementing real functionality
}

export default function VistaPrincipal(props: VistaPrincipalProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6" />
            Vista Principal
          </h2>
          <p className="text-muted-foreground">
            Configuración de la página principal del sitio web
          </p>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Función en Desarrollo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Construction className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Vista Principal en Construcción</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Esta sección permitirá configurar la página principal del sitio, incluyendo historias destacadas, 
              carruseles de contenido y la organización de categorías.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 justify-center">
                <ArrowRight className="h-4 w-4" />
                <span>Gestión de historia principal</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <ArrowRight className="h-4 w-4" />
                <span>Configuración de carruseles</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <ArrowRight className="h-4 w-4" />
                <span>Organización de categorías destacadas</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <ArrowRight className="h-4 w-4" />
                <span>Vista previa de la página principal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historia Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Próximamente</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Carruseles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Próximamente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
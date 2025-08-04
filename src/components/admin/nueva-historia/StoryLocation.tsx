'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface StoryLocationProps {
  newStoryForm: any;
  setNewStoryForm: (form: any) => void;
}

export default function StoryLocation({ newStoryForm, setNewStoryForm }: StoryLocationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Componente de ubicación - Será implementado próximamente
        </p>
      </CardContent>
    </Card>
  );
}
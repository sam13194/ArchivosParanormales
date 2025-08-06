'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ghost } from "lucide-react";

interface StoryEntitiesProps {
  newStoryForm: any;
  setNewStoryForm: (form: any) => void;
}

export default function StoryEntities({ newStoryForm, setNewStoryForm }: StoryEntitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ghost className="h-5 w-5" />
          Entidades Paranormales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Componente de entidades paranormales - Será implementado próximamente
        </p>
      </CardContent>
    </Card>
  );
}
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface StoryClassificationProps {
  newStoryForm: any;
  setNewStoryForm: (form: any) => void;
}

export default function StoryClassification({ newStoryForm, setNewStoryForm }: StoryClassificationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Clasificación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Componente de clasificación - Será implementado próximamente
        </p>
      </CardContent>
    </Card>
  );
}
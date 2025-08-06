'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface StoryWitnessesProps {
  newStoryForm: any;
  setNewStoryForm: (form: any) => void;
  addTestigoSecundario: () => void;
  removeTestigoSecundario: (index: number) => void;
  updateTestigoSecundario: (index: number, field: string, value: any) => void;
}

export default function StoryWitnesses({ 
  newStoryForm, 
  setNewStoryForm,
  addTestigoSecundario,
  removeTestigoSecundario,
  updateTestigoSecundario
}: StoryWitnessesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Testigos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Componente de testigos - Será implementado próximamente
        </p>
      </CardContent>
    </Card>
  );
}
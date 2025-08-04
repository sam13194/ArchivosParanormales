'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface StoryDatesProps {
  newStoryForm: any;
  setNewStoryForm: (form: any) => void;
}

export default function StoryDates({ newStoryForm, setNewStoryForm }: StoryDatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Fechas y Temporalidad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Componente de fechas - Será implementado próximamente
        </p>
      </CardContent>
    </Card>
  );
}
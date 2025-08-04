'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface StoryFilesProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isUploadingFiles: boolean;
  handleFileUpload: (file: File, type: 'audio' | 'image') => Promise<void>;
  newStoryForm: any;
  setNewStoryForm: (form: any) => void;
}

export default function StoryFiles({ 
  audioFile,
  setAudioFile,
  imageFile,
  setImageFile,
  isUploadingFiles,
  handleFileUpload,
  newStoryForm,
  setNewStoryForm
}: StoryFilesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Archivos Multimedia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Componente de archivos multimedia - Será implementado próximamente
        </p>
      </CardContent>
    </Card>
  );
}
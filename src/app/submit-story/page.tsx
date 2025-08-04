'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Mic, FileText, Square, CircleDot, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SubmitStoryPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    const handleStartRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setRecordedAudio(audioBlob);
                    audioChunksRef.current = [];
                };
                audioChunksRef.current = [];
                mediaRecorderRef.current.start();
                setIsRecording(true);
                setRecordedAudio(null);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                toast({
                    variant: "destructive",
                    title: "Error de micrófono",
                    description: "No se pudo acceder al micrófono. Por favor, revisa los permisos en tu navegador.",
                });
            }
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAudioFile(event.target.files[0]);
        }
    };

    const uploadFileToCloudinary = async (file: File | Blob, type: 'audio' | 'image') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('storyId', Date.now().toString());
        formData.append('userId', user?.uid || 'anonymous');

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        return response.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) {
            toast({
                variant: "destructive",
                title: "Falta el título",
                description: "Por favor, dale un título a tu historia.",
            });
            return;
        }

        if (!text && !audioFile && !recordedAudio) {
            toast({
                variant: "destructive",
                title: "Contenido requerido",
                description: "Por favor, proporciona tu historia en texto o audio.",
            });
            return;
        }

        setIsUploading(true);

        try {
            let audioUrl = null;
            
            // Upload audio if provided
            if (audioFile || recordedAudio) {
                const fileToUpload = audioFile || recordedAudio!;
                const uploadResult = await uploadFileToCloudinary(fileToUpload, 'audio');
                audioUrl = uploadResult.data.secure_url;
            }

            // Here you would normally save to your database
            // For now, we'll just log the data
            const storyData = {
                title,
                text: text.length > 0 ? text : null,
                audioUrl,
                userId: user?.uid,
                createdAt: new Date().toISOString(),
                status: 'pending_review',
            };

            console.log('Story data to save:', storyData);

            toast({
                title: "¡Testimonio enviado!",
                description: "Tu historia ha sido subida exitosamente. La revisaremos pronto.",
            });
            
            // Reset form
            setTitle('');
            setText('');
            setAudioFile(null);
            setRecordedAudio(null);
            router.push('/profile');

        } catch (error) {
            console.error('Submit error:', error);
            toast({
                variant: "destructive",
                title: "Error al enviar",
                description: "Hubo un problema al subir tu historia. Inténtalo de nuevo.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (loading || !user) {
        return <div className="container mx-auto py-12"><p>Cargando...</p></div>;
    }

    return (
        <div className="container mx-auto max-w-3xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Comparte tu Testimonio</CardTitle>
                    <CardDescription>Elige cómo quieres contar tu historia paranormal. Tu voz puede ser la próxima que inspire escalofríos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 mb-6">
                            <Label htmlFor="title">Título de la Historia</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: La sombra en el pasillo"
                                required
                            />
                        </div>

                        <Tabs defaultValue="escribir" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="escribir"><FileText className="mr-2 h-4 w-4"/> Escribir</TabsTrigger>
                                <TabsTrigger value="subir"><Upload className="mr-2 h-4 w-4"/>Subir Audio</TabsTrigger>
                                <TabsTrigger value="grabar"><Mic className="mr-2 h-4 w-4"/>Grabar Audio</TabsTrigger>
                            </TabsList>
                            <TabsContent value="escribir" className="py-4">
                                <Label htmlFor="story-text">Tu historia</Label>
                                <Textarea
                                    id="story-text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Comienza a escribir tu relato aquí..."
                                    rows={10}
                                    className="mt-2"
                                />
                            </TabsContent>
                            <TabsContent value="subir" className="py-4">
                                <Label htmlFor="audio-upload">Archivo de Audio</Label>
                                <Input id="audio-upload" type="file" accept="audio/*" onChange={handleFileChange} className="mt-2 file:text-primary file:font-medium"/>
                                {audioFile && (
                                     <Alert variant="default" className="mt-4">
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle>Archivo seleccionado</AlertTitle>
                                        <AlertDescription>
                                            {audioFile.name}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </TabsContent>
                            <TabsContent value="grabar" className="py-4 text-center space-y-4">
                               <div className="flex justify-center">
                                {isRecording ? (
                                    <Button type="button" onClick={handleStopRecording} variant="destructive" size="lg" className="rounded-full w-24 h-24">
                                        <Square className="h-10 w-10 mr-2" /> Detener
                                    </Button>
                                ) : (
                                    <Button type="button" onClick={handleStartRecording} size="lg" className="rounded-full w-24 h-24">
                                        <Mic className="h-10 w-10 mr-2" /> Grabar
                                    </Button>
                                )}
                               </div>
                               <div>
                                {isRecording && <p className="text-primary flex items-center justify-center gap-2"><CircleDot className="animate-pulse h-4 w-4"/> Grabando...</p>}
                                {recordedAudio && (
                                     <Alert variant="default" className="mt-4 text-left">
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle>Grabación completada</AlertTitle>
                                        <AlertDescription>
                                            Tu audio está listo para ser enviado.
                                            <audio src={URL.createObjectURL(recordedAudio)} controls className="w-full mt-2" />
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {!isRecording && !recordedAudio && (
                                    <Alert variant="default" className="mt-4 text-left">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Listo para grabar</AlertTitle>
                                        <AlertDescription>
                                            Asegúrate de estar en un lugar silencioso. Presiona el botón para comenzar.
                                        </AlertDescription>
                                    </Alert>
                                )}
                               </div>
                            </TabsContent>
                        </Tabs>

                        <Button type="submit" size="lg" className="w-full mt-6" disabled={isUploading}>
                            {isUploading ? 'Subiendo...' : 'Enviar mi testimonio'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

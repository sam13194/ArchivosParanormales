'use client';

import { useAuth } from '@/context/auth-context';
import { useUserProfile } from '@/context/user-profile-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import Link from 'next/link';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Historias</h1>
          <p className="text-muted-foreground">
            Gestiona todas las historias que has enviado a la plataforma.
          </p>
        </div>
        <Button asChild>
          <Link href="/submit-story" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Enviar Historia
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historias Enviadas
            {profile?.storiesSubmitted && (
              <span className="text-sm font-normal text-muted-foreground">
                ({profile.storiesSubmitted} historias)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aún no has enviado ninguna historia.</p>
            <p className="text-sm mt-2 mb-4">
              ¡Comparte tu experiencia paranormal con nuestra comunidad!
            </p>
            <Button asChild variant="outline">
              <Link href="/submit-story">
                Enviar Mi Primera Historia
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
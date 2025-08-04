'use client';

import { useAuth } from '@/context/auth-context';
import { useUserProfile } from '@/context/user-profile-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Clock } from "lucide-react";

export default function HistoryPage() {
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Historial</h1>
        <p className="text-muted-foreground">
          Revisa todas las historias que has escuchado recientemente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Reproducción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tu historial está vacío.</p>
            <p className="text-sm mt-2">
              Cuando escuches historias, aparecerán aquí para que puedas volver a ellas fácilmente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
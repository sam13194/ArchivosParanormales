'use client';

import { useAuth } from '@/context/auth-context';
import { useUserProfile } from '@/context/user-profile-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
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
        <h1 className="text-3xl font-bold mb-2">Mis Favoritos</h1>
        <p className="text-muted-foreground">
          Aquí encontrarás todas las historias que has marcado como favoritas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Historias Favoritas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aún no tienes historias favoritas.</p>
            <p className="text-sm mt-2">
              Explora nuestras historias y marca las que más te gusten con el ❤️
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
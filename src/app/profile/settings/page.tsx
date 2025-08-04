'use client';

import { useAuth } from '@/context/auth-context';
import { useUserProfile } from '@/context/user-profile-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Mail, Calendar, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, loading, refreshProfile } = useUserProfile();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      moderator: 'secondary',
      premium: 'default',
      user: 'outline'
    } as const;
    
    return <Badge variant={variants[role as keyof typeof variants] || 'outline'}>{role}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      suspended: 'destructive',
      pending: 'secondary',
      banned: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias de cuenta.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="displayName">Nombre de Usuario</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre de usuario"
                />
              </div>
            </div>
            <Button disabled>
              Guardar Cambios
            </Button>
            <p className="text-xs text-muted-foreground">
              * La funcionalidad de edición estará disponible próximamente
            </p>
          </CardContent>
        </Card>

        {/* Estado de Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Estado de Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Rol</Label>
                <div className="mt-1">
                  {getRoleBadge(profile.role)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Estado</Label>
                <div className="mt-1">
                  {getStatusBadge(profile.status)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Fecha de Registro</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.joinDate}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Historias Enviadas</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.storiesSubmitted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Contraseña</Label>
              <div className="flex gap-2 mt-1">
                <Input type="password" value="••••••••" disabled className="bg-muted" />
                <Button variant="outline" disabled>
                  Cambiar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * La funcionalidad de cambio de contraseña estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
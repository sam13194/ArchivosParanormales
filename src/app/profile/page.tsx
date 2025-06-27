'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { FilePlus, History, UserCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto py-12">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl">Portal del Testigo</h1>
        <p className="text-muted-foreground mt-2">Bienvenido, {user.email}. Aquí puedes gestionar tus testimonios y tu cuenta.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 bg-card/50 border-primary/20">
          <CardHeader className="flex flex-row items-center gap-4">
             <div className="bg-primary/10 p-3 rounded-full">
                <FilePlus className="h-8 w-8 text-primary" />
             </div>
             <div>
                <CardTitle>Envía tu Testimonio</CardTitle>
                <CardDescription>¿Tienes una historia que contar? Compártela con nuestra comunidad.</CardDescription>
             </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Puedes escribir tu historia, subir un archivo de audio o grabar tu testimonio directamente en nuestra plataforma. Nosotros nos encargaremos de producirla y compartirla.</p>
            <Button asChild size="lg">
              <Link href="/submit-story">Crear Nuevo Testimonio</Link>
            </Button>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><History className="h-5 w-5"/> Mis Testimonios</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Aquí verás el estado de los testimonios que has enviado.</p>
                     <p className="mt-4 text-sm text-accent">En construcción.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><UserCog className="h-5 w-5"/> Mi Cuenta</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Actualiza tu información personal y preferencias.</p>
                    <p className="mt-4 text-sm text-accent">En construcción.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { FileEdit, History, UserCog, Heart, Trophy, BadgeCheck, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryCarousel } from "@/components/story-carousel";
import { mockStories } from "@/lib/data";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const myFavoriteStories = [...mockStories].slice(0, 4);
  const mySubmissions = [
      { title: "La sombra en el pasillo", status: "Publicado", date: "2024-05-15" },
      { title: "Ruidos en la cocina", status: "En revisión", date: "2024-06-01" },
      { title: "El espectro del hospital", status: "En revisión", date: "2024-06-10" },
  ];
  const myAchievements = [
      { icon: FileEdit, title: "Primer Testimonio", description: "Compartiste tu primera historia.", locked: false },
      { icon: Trophy, title: "Narrador Prolífico", description: "Has compartido 5 historias.", locked: true },
      { icon: Heart, title: "Coleccionista Paranormal", description: "Guardaste 10 historias en tu lista.", locked: true },
  ];

  if (loading || !user) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-4xl">Mi Portal</h1>
          <p className="text-muted-foreground mt-2">Bienvenido, {user.email}. Gestiona tus historias, favoritos y logros.</p>
        </div>
        <Button asChild>
          <Link href="/submit-story"><FileEdit className="mr-2 h-4 w-4" /> Crear Nuevo Testimonio</Link>
        </Button>
      </div>
      
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="favorites"><Heart className="mr-2 h-4 w-4"/> Mi Lista</TabsTrigger>
          <TabsTrigger value="submissions"><History className="mr-2 h-4 w-4"/>Mis Testimonios</TabsTrigger>
          <TabsTrigger value="achievements"><Trophy className="mr-2 h-4 w-4"/>Mis Logros</TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="mt-6">
           <StoryCarousel title="Tus Historias Guardadas" stories={myFavoriteStories} />
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado de tus Testimonios</CardTitle>
              <CardDescription>Aquí puedes ver el progreso de las historias que has compartido.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {mySubmissions.map((sub, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-4 p-3 bg-card-foreground/5 rounded-lg">
                    <span className="font-medium">{sub.title}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {sub.status === 'Publicado' ? <BadgeCheck className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-accent" />}
                      <span className={sub.status === 'Publicado' ? 'text-primary' : 'text-accent'}>{sub.status}</span>
                      <span>- {sub.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Tus Logros Desbloqueados</CardTitle>
                    <CardDescription>¡Sigue participando para ganar más insignias!</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {myAchievements.map((ach, i) => (
                        <div key={i} className={`flex flex-col items-center text-center p-4 rounded-lg border ${ach.locked ? 'bg-card-foreground/5 text-muted-foreground' : 'bg-primary/10'}`}>
                            <ach.icon className={`h-10 w-10 mb-2 ${ach.locked ? '' : 'text-primary'}`} />
                            <h3 className="font-bold">{ach.title}</h3>
                            <p className="text-xs mt-1">{ach.description}</p>
                            {ach.locked && <span className="text-xs font-bold mt-2 opacity-70">(Bloqueado)</span>}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

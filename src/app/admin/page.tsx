import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Panel Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bienvenido al panel de administración. Aquí podrás gestionar historias, usuarios y ver analíticas.</p>
          <p className="mt-4 text-muted-foreground">Esta sección está en construcción.</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Portal de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bienvenido a tu portal. Aquí podrás ver tu lista, historial y enviar tus testimonios.</p>
          <p className="mt-4 text-muted-foreground">Esta sección está en construcción.</p>
        </CardContent>
      </Card>
    </div>
  );
}

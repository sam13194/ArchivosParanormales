import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 6.097-4.464 10.994-9.982 10.994S.62 14.283.62 8.181s4.464-10.994 9.982-10.994c2.058 0 3.94.636 5.443 1.693l-2.27 2.27z" /><path d="M15.545 6.558 21.38 2.5l-3.546 6.364" /></svg>
  )
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="mx-auto max-w-sm w-full bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="testigo@paranormal.co" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Iniciar Sesión
          </Button>
          <Button variant="outline" className="w-full">
            <GoogleIcon className="mr-2 h-4 w-4" />
            Iniciar Sesión con Google
          </Button>
          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register" className="underline text-primary">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

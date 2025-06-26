import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { Logo } from "./icons/logo";

export function SiteFooter() {
  return (
    <footer className="bg-card text-muted-foreground">
      <div className="container mx-auto max-w-screen-2xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
             <Link href="/" className="flex items-center space-x-2">
                <Logo />
            </Link>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 hover:text-foreground transition-colors" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 hover:text-foreground transition-colors" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 hover:text-foreground transition-colors" /></Link>
              <Link href="#" aria-label="YouTube"><Youtube className="h-6 w-6 hover:text-foreground transition-colors" /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">Explorar</h3>
              <Link href="#" className="block hover:text-foreground transition-colors">Inicio</Link>
              <Link href="#" className="block hover:text-foreground transition-colors">Categorías</Link>
              <Link href="#" className="block hover:text-foreground transition-colors">Mapa de Historias</Link>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">Comunidad</h3>
              <Link href="#" className="block hover:text-foreground transition-colors">Enviar Testimonio</Link>
              <Link href="#" className="block hover:text-foreground transition-colors">Foros</Link>
              <Link href="/profile" className="block hover:text-foreground transition-colors">Mi Perfil</Link>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">Legal</h3>
              <Link href="#" className="block hover:text-foreground transition-colors">Términos de Servicio</Link>
              <Link href="#" className="block hover:text-foreground transition-colors">Política de Privacidad</Link>
            </div>
             <div className="space-y-3">
              <h3 className="font-bold text-foreground">Administración</h3>
              <Link href="/admin" className="block hover:text-foreground transition-colors">Panel Admin</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Archivos Paranormales. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

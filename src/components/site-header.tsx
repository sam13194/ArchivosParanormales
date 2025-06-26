import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCircle, Bell } from "lucide-react";
import { Logo } from "./icons/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const isLoggedIn = false; // Mock authentication state

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Inicio</Link>
            <Link href="#" className="transition-colors hover:text-foreground">Series</Link>
            <Link href="#" className="transition-colors hover:text-foreground">Mi Lista</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9 bg-secondary focus:bg-background" />
          </div>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>

          {isLoggedIn ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile">Perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/admin">Panel Admin</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
                <Link href="/auth/register">Registro</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

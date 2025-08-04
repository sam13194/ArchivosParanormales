'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCircle, Bell, ShieldCheck, User, Settings, Heart, History, LogOut, CreditCard, Store, FileText, MapPin } from "lucide-react";
import { CartSidebar } from "@/components/cart-sidebar";
import { Logo } from "./icons/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { useUserProfile } from "@/context/user-profile-context";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { profile, isAdmin, isModerator, isPremium } = useUserProfile();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Inicio</Link>
            <Link href="/store" className="transition-colors hover:text-foreground">Tienda</Link>
            <Link href="/mapa" className="transition-colors hover:text-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Mapa Paranormal
            </Link>
            <Link href="/profile" className="transition-colors hover:text-foreground">Mi Portal</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9 bg-secondary focus:bg-background" />
          </div>
          <CartSidebar />
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>

          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'Usuario'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Opciones para todos los usuarios */}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/profile/favorites" className="flex items-center w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Mis Favoritos</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/profile/history" className="flex items-center w-full">
                    <History className="mr-2 h-4 w-4" />
                    <span>Historial</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/profile/submissions" className="flex items-center w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Mis Historias</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Opciones premium */}
                {isPremium ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/subscription" className="flex items-center w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Mi Suscripción</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/downloads" className="flex items-center w-full">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Mis Descargas</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/store" className="flex items-center w-full">
                      <Store className="mr-2 h-4 w-4" />
                      <span>Hazte Premium</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                {/* Opciones de admin */}
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center w-full">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Panel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                {/* Configuración y logout */}
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
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

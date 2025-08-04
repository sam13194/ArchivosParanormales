'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, FileText, DollarSign, TrendingUp, Eye, Clock,
  ShoppingCart, Star, AlertCircle, CheckCircle, XCircle,
  BarChart3, PieChart, Activity, Calendar
} from "lucide-react";

interface DashboardProps {
  formatCurrency: (amount: number) => string;
  getActivityIcon: (tipo: string) => string;
  getStatusBadge: (estado: string) => { text: string; className: string };
}

// Mock data - replace with real data
const mockStats = {
  totalUsers: 1247,
  newUsersThisMonth: 89,
  totalStories: 156,
  pendingStories: 12,
  totalRevenue: 2450000,
  monthlyRevenue: 890000,
  storeViews: 8934,
  averageRating: 4.7
};

const mockRecentActivity = [
  { id: 1, tipo: 'nueva_historia', descripcion: 'Nueva historia: "El Fantasma del Teatro"', tiempo: '5 min', estado: 'pendiente' },
  { id: 2, tipo: 'nuevo_usuario', descripcion: 'Usuario registrado: maria.rodriguez@email.com', tiempo: '12 min', estado: 'activo' },
  { id: 3, tipo: 'compra', descripcion: 'Compra realizada: $45,000 COP', tiempo: '1 hora', estado: 'completado' },
  { id: 4, tipo: 'historia_publicada', descripcion: 'Historia publicada: "Misterios de Boyacá"', tiempo: '2 horas', estado: 'activo' },
  { id: 5, tipo: 'reseña', descripcion: 'Nueva reseña 5 estrellas recibida', tiempo: '3 horas', estado: 'positivo' }
];

export default function Dashboard({ formatCurrency, getActivityIcon, getStatusBadge }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.newUsersThisMonth} este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Historias</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalStories}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.pendingStories} pendientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(mockStats.monthlyRevenue)} este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tienda</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.storeViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <Star className="h-3 w-3 inline mr-1" />
              {mockStats.averageRating} promedio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                  {getActivityIcon(activity.tipo)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.descripcion}</p>
                    <p className="text-xs text-muted-foreground">hace {activity.tiempo}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(activity.estado).className}`}>
                    {getStatusBadge(activity.estado).text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen de rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumen de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuarios Activos</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-bold text-green-600">+12%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Historias Publicadas</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-bold text-green-600">+8%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ventas Tienda</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-bold text-blue-600">+15%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tiempo Promedio</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-bold">4m 32s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
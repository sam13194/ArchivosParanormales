'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useUserProfile } from '@/context/user-profile-context';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Users, FileText, DollarSign, TrendingUp, Eye, Clock,
  ShoppingCart, Star, AlertCircle, CheckCircle, XCircle,
  BarChart3, PieChart, Activity, Calendar, Home, Grid,
  Search, Filter, ArrowUp, ArrowDown, Save, RotateCcw,
  Plus, Upload, MapPin, Tag, Ghost, UserX, UserCheck, Mail, Shield, Ban, Trash2, Edit, UserCircle
} from "lucide-react";

// Import modular components
import Dashboard from '@/components/admin/dashboard/Dashboard';
import VistaPrincipal from '@/components/admin/vista-principal/VistaPrincipal';
import NuevaHistoria from '@/components/admin/nueva-historia/NuevaHistoria';
import Contenido from '@/components/admin/contenido/Contenido';
import Tienda from '@/components/admin/tienda/Tienda';
import Usuarios from '@/components/admin/usuarios/Usuarios';

// Mock data - En producción esto vendría de la API
const mockStats = {
  usuarios: {
    total: 2547,
    nuevos_mes: 234,
    premium: 187,
    activos_hoy: 456
  },
  historias: {
    total: 87,
    publicadas: 62,
    en_revision: 15,
    rechazadas: 10
  },
  ventas: {
    ingresos_mes: 2847300,
    ordenes_mes: 89,
    conversion: 3.2,
    suscripciones_activas: 187
  },
  contenido: {
    reproducciones_mes: 15420,
    tiempo_escucha_horas: 2847,
    historias_favoritas: 892,
    rating_promedio: 4.7
  }
};

const mockRecentActivity = [
  { tipo: 'nueva_historia', descripcion: 'Nueva historia enviada: "El Fantasma del Metro"', tiempo: '2 min ago', usuario: 'usuario123' },
  { tipo: 'compra', descripcion: 'Nueva suscripción premium', tiempo: '15 min ago', monto: 19900 },
  { tipo: 'review', descripcion: 'Nueva reseña 5 estrellas en "Fantasmas de Colombia"', tiempo: '1 hora ago' },
  { tipo: 'historia_publicada', descripcion: 'Historia aprobada y publicada', tiempo: '2 horas ago' },
  { tipo: 'usuario_nuevo', descripcion: 'Nuevo usuario registrado', tiempo: '3 horas ago' }
];

const mockPendingReviews = [
  { id: 1, titulo: 'La Casa Embrujada de Zipaquirá', autor: 'María García', fecha: '2024-01-20', estado: 'pendiente' },
  { id: 2, titulo: 'Encuentro con OVNI en Boyacá', autor: 'Carlos Ruiz', fecha: '2024-01-19', estado: 'en_revision' },
  { id: 3, titulo: 'El Poltergeist de la Oficina', autor: 'Ana López', fecha: '2024-01-18', estado: 'pendiente' }
];

// Mock data para historias disponibles
const mockAllStories = [
  { id: 1, titulo: 'El Fantasma del Hotel Tequendama', autor: 'María García', categoria: 'Fantasmas', rating: 4.8, reproducciones: 2547, fecha: '2024-01-15', thumbnail: 'https://i.postimg.cc/G2t90gvb/image-8.png' },
  { id: 2, titulo: 'La Llorona de la Macarena', autor: 'Carlos Ruiz', categoria: 'Leyendas', rating: 4.6, reproducciones: 1823, fecha: '2024-01-12', thumbnail: 'https://i.postimg.cc/KvR77QVS/image-6.png' },
  { id: 3, titulo: 'Poltergeist en Zipaquirá', autor: 'Ana López', categoria: 'Poltergeist', rating: 4.9, reproducciones: 3421, fecha: '2024-01-10', thumbnail: 'https://i.postimg.cc/BQLZB1Bw/image-4.png' },
  { id: 4, titulo: 'OVNI en los Llanos Orientales', autor: 'Pedro Martín', categoria: 'OVNIs', rating: 4.3, reproducciones: 876, fecha: '2024-01-08', thumbnail: 'https://i.postimg.cc/G2t90gvb/image-8.png' },
  { id: 5, titulo: 'La Casa Maldita de Bogotá', autor: 'Laura Sánchez', categoria: 'Casas Embrujadas', rating: 4.7, reproducciones: 2156, fecha: '2024-01-05', thumbnail: 'https://i.postimg.cc/KvR77QVS/image-6.png' },
  { id: 6, titulo: 'Encuentro Demoníaco en Medellín', autor: 'Jorge Ramírez', categoria: 'Demonios', rating: 4.5, reproducciones: 1547, fecha: '2024-01-03', thumbnail: 'https://i.postimg.cc/BQLZB1Bw/image-4.png' }
];

// Configuración actual de la vista principal
const mockHomepageConfig = {
  hero_story: 1,
  carousels: [
    { id: 'populares', titulo: '🔥 Más Populares', stories: [1, 3, 5, 2], orden: 1 },
    { id: 'fantasmas', titulo: '👻 Fantasmas y Apariciones', stories: [1, 5], orden: 2 },
    { id: 'posesiones', titulo: '😈 Posesiones y Demonios', stories: [6, 3], orden: 3 },
    { id: 'regional', titulo: '🗺️ Historias de tu Región', stories: [2, 1, 5], orden: 4 }
  ]
};

// Mock data para usuarios
const mockUsers = [
  {
    id: 1,
    email: 'wilmer13194@gmail.com',
    displayName: 'Wilmer Admin',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-27 14:30',
    storiesSubmitted: 5,
    storiesPublished: 3,
    premiumStatus: 'premium',
    avatar: null
  },
  {
    id: 2,
    email: 'maria.garcia@email.com',
    displayName: 'María García',
    role: 'contributor',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-26 09:15',
    storiesSubmitted: 12,
    storiesPublished: 8,
    premiumStatus: 'premium',
    avatar: null
  },
  {
    id: 3,
    email: 'carlos.ruiz@email.com',
    displayName: 'Carlos Ruiz',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-20',
    lastLogin: '2024-01-25 16:45',
    storiesSubmitted: 3,
    storiesPublished: 2,
    premiumStatus: 'trial',
    avatar: null
  }
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { profile, isAdmin, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  
  // Estado para gestión de vista principal
  const [homepageConfig, setHomepageConfig] = useState(mockHomepageConfig);
  const [selectedStories, setSelectedStories] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Estado para formulario de nueva historia
  const [newStoryForm, setNewStoryForm] = useState({
    // Tabla: historias (55 columns)
    historias: {
      titulo_provisional: '',
      descripcion_corta: '',
      descripcion_larga: '',
      testimonio_completo: '',
      extracto_verbatim: '',
      historia_reescrita: '',
      suceso_principal_resumen: '',
      protagonistas_descripcion: '',
      fuente_relato: 'llamada_oyente',
      genero_principal: 'fantasmas_apariciones',
      epoca_historica: 'Contemporánea',
      nivel_credibilidad: 0,
      nivel_impacto: 1,
      ponderacion_impacto: 1,
      potencial_adaptacion: 1,
      nivel_verificacion: 'sin_verificar',
      longitud_extracto_palabras: 0,
      fecha_sucesos: 'Desconocido',
      fecha_evento_inicio: 'Desconocido',
      fecha_evento_fin: 'Desconocido',
      hora_evento: '',
      evento_recurrente: false,
      dificultad_produccion: 1,
      tiempo_produccion_estimado: 0,
      presupuesto_estimado: 0,
      contenido_sensible: false,
      advertencias: [],
      edad_minima_recomendada: 0,
      duracion_impacto_emocional: 'leve',
      banderas_rojas: [],
      notas_adicionales: '',
      duracion_evento_minutos: 0,
      patron_recurrencia: '',
      palabras_clave_patron: [],
      hash_similarity: '',
      codigo_unico: '',
      fecha_transcripcion: '',
      estado_procesamiento: 'extraida',
      publicar_inmediatamente: false
    },
    
    // Tabla: ubicaciones (24 columns)
    ubicacion: {
      pais: 'Colombia',
      codigo_pais: 'CO',
      nivel1_nombre: '',
      nivel1_codigo: '',
      nivel2_nombre: '',
      nivel2_codigo: '',
      nivel3_nombre: '',
      nivel4_nombre: '',
      latitud: null,
      longitud: null,
      precision_metros: 100,
      descripcion_lugar: '',
      lugar_especifico: '',
      tipo_lugar: '',
      zona_horaria: 'America/Bogota',
      altitud_metros: null,
      actividad_paranormal_reportada: false,
      numero_historias_reportadas: 0,
      primera_actividad_reportada: '',
      ultima_actividad_reportada: '',
      verificada: false,
      fuente_verificacion: '',
      departamento: '',
      municipio: ''
    },
    
    // Tabla: testigos (15 columns)
    testigo_principal: {
      tipo_testigo: 'principal',
      nombre_completo: '',
      pseudonimo: '',
      edad_aprox: 0,
      ocupacion: '',
      relacion_evento: '',
      presencial: true,
      credibilidad_estimada: 0,
      factores_credibilidad: {},
      antecedentes_paranormales: false,
      contacto_disponible: false,
      notas_testigo: ''
    },
    testigos_secundarios: [],
    
    // Tabla: entidades_paranormales (23 columns)
    entidades_paranormales: [],
    
    // Tabla: contexto_ambiental (17 columns)
    contexto_ambiental: {
      clima: '',
      temperatura: '',
      humedad: '',
      condiciones_luz: '',
      ruidos_ambiente: '',
      factores_externos: '',
      numero_personas: 1,
      situacion_social: '',
      fase_lunar: '',
      festividad_religiosa: '',
      evento_historico: '',
      aniversario_especial: '',
      actividad_previa: '',
      estado_emocional: '',
      patron_temporal: false,
      hora_del_dia: '',
      estacion_año: ''
    },
    
    // Tabla: archivos_multimedia (23 columns)
    archivos_multimedia: [],
    
    // Tabla: elementos_clave (7 columns)
    elementos_clave: [],
    
    // Tabla: factores_credibilidad (13 columns)
    factores_credibilidad: {
      multiples_testigos: 0,
      evidencia_fisica: 0,
      consistencia_relatos: 0,
      ubicacion_verificable: 0,
      contexto_historico: 0,
      sobriedad_testigo: 0,
      conocimiento_previo: 0,
      estado_emocional: 0,
      motivaciones_secundarias: 0,
      corroboracion_externa: 0,
      documentacion_disponible: 0
    },
    
    // Tabla: derechos (9 columns)
    derechos: {
      derechos_uso: '',
      autorizacion_comercial: false,
      autorizacion_adaptacion: false,
      restricciones_uso: '',
      contacto_derechos: '',
      fecha_autorizacion: '',
      vigencia_derechos: '',
      notas_legales: ''
    },
    
    // Tabla: performance_esperado (7 columns)
    performance_esperado: {
      audiencia_objetivo: '',
      engagement_esperado: 0,
      potencial_viral: 0,
      impacto_emocional_esperado: 0,
      duracion_interes_estimada: 0,
      metricas_objetivo: {}
    }
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Estados para archivos
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isLoadingJson, setIsLoadingJson] = useState(false);

  // Estados para gestión de usuarios
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [userFilterStatus, setUserFilterStatus] = useState('all');

  // Estados para diálogos de usuario
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    displayName: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    if (!loading && !profileLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (!isAdmin) {
        router.push('/');
        return;
      }
      
      loadHomepageConfig();
      loadUsers();
    }
  }, [user, loading, isAdmin, profileLoading, router]);

  useEffect(() => {
    setUsers(mockUsers);
    setIsLoadingUsers(false);
  }, []);

  const loadHomepageConfig = async () => {
    try {
      const response = await fetch('/api/homepage-config');
      const result = await response.json();
      
      if (result.success) {
        setHomepageConfig(result.data);
      }
    } catch (error) {
      console.error('Error loading homepage config:', error);
      // Usar mock data como fallback
      setHomepageConfig(mockHomepageConfig);
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch('/api/admin/users');
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error('Error loading users:', result.error);
        // Usar mock data como fallback
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Usar mock data como fallback
      setUsers(mockUsers);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'nueva_historia': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'compra': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'review': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'historia_publicada': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'usuario_nuevo': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendiente</Badge>;
      case 'en_revision': return <Badge variant="outline" className="text-blue-600 border-blue-600">En Revisión</Badge>;
      case 'aprobado': return <Badge variant="outline" className="text-green-600 border-green-600">Aprobado</Badge>;
      case 'rechazado': return <Badge variant="outline" className="text-red-600 border-red-600">Rechazado</Badge>;
      default: return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const filteredStories = mockAllStories.filter(story => {
    const matchesSearch = story.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || story.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', ...Array.from(new Set(mockAllStories.map(s => s.categoria)))];

  const setHeroStory = (storyId: number) => {
    setHomepageConfig(prev => ({ ...prev, hero_story: storyId }));
  };

  const addStoryToCarousel = (carouselId: string, storyId: number) => {
    setHomepageConfig(prev => ({
      ...prev,
      carousels: prev.carousels.map(carousel =>
        carousel.id === carouselId
          ? { ...carousel, stories: [...carousel.stories, storyId] }
          : carousel
      )
    }));
  };

  const removeStoryFromCarousel = (carouselId: string, storyId: number) => {
    setHomepageConfig(prev => ({
      ...prev,
      carousels: prev.carousels.map(carousel =>
        carousel.id === carouselId
          ? { ...carousel, stories: carousel.stories.filter(id => id !== storyId) }
          : carousel
      )
    }));
  };

  const moveCarousel = (carouselId: string, direction: 'up' | 'down') => {
    setHomepageConfig(prev => {
      const carousels = [...prev.carousels];
      const index = carousels.findIndex(c => c.id === carouselId);
      
      if ((direction === 'up' && index > 0) || (direction === 'down' && index < carousels.length - 1)) {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [carousels[index], carousels[targetIndex]] = [carousels[targetIndex], carousels[index]];
      }
      
      return { ...prev, carousels };
    });
  };

  const saveHomepageConfig = async () => {
    try {
      const response = await fetch('/api/homepage-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homepageConfig),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Configuración guardada exitosamente');
      } else {
        alert('Error al guardar la configuración');
      }
    } catch (error) {
      console.error('Error saving homepage config:', error);
      alert('Error al guardar la configuración');
    }
  };

  const uploadFileToCloudinary = async (file: File, resourceType: 'image' | 'video' | 'raw') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'archivos_paranormales');
    formData.append('resource_type', resourceType);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error uploading ${resourceType}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleFileUpload = async (file: File, type: 'audio' | 'image') => {
    setIsUploadingFiles(true);
    try {
      let url: string;
      
      if (type === 'audio') {
        if (!file.type.startsWith('audio/')) {
          throw new Error('El archivo debe ser de audio');
        }
        url = await uploadFileToCloudinary(file, 'video'); // Cloudinary uses 'video' for audio
        setNewStoryForm(prev => ({ ...prev, audio_url: url }));
        setAudioFile(file);
      } else {
        if (!file.type.startsWith('image/')) {
          throw new Error('El archivo debe ser una imagen');
        }
        url = await uploadFileToCloudinary(file, 'image');
        setNewStoryForm(prev => ({ ...prev, imagen_url: url }));
        setImageFile(file);
      }
      
      alert(`${type === 'audio' ? 'Audio' : 'Imagen'} subido exitosamente`);
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Error al subir ${type === 'audio' ? 'el audio' : 'la imagen'}: ${error.message}`);
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleJsonLoad = async (file: File) => {
    setIsLoadingJson(true);
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Mapear los datos del JSON al formulario
      const mappedData = {
        // Información básica
        titulo: jsonData.titulo || '',
        descripcion_corta: jsonData.descripcion_corta || '',
        descripcion_larga: jsonData.descripcion_larga || '',
        testimonio_completo: jsonData.testimonio_completo || '',
        extracto_verbatim: jsonData.extracto_verbatim || '',
        historia_reescrita: jsonData.historia_reescrita || '',
        suceso_principal_resumen: jsonData.suceso_principal_resumen || '',
        
        // Archivos multimedia
        audio_url: jsonData.audio_url || '',
        imagen_url: jsonData.imagen_url || jsonData.thumbnail_url || '',
        
        // Ubicación
        ubicacion: {
          pais: jsonData.ubicacion?.pais || 'Colombia',
          codigo_pais: jsonData.ubicacion?.codigo_pais || 'CO',
          departamento: jsonData.ubicacion?.departamento || 'Desconocido',
          nivel1_codigo: jsonData.ubicacion?.nivel1_codigo || '',
          ciudad: jsonData.ubicacion?.ciudad || 'Desconocido',
          nivel2_codigo: jsonData.ubicacion?.nivel2_codigo || '',
          zona: jsonData.ubicacion?.zona || 'Desconocido',
          nivel4_nombre: jsonData.ubicacion?.nivel4_nombre || '',
          descripcion_lugar: jsonData.ubicacion?.descripcion_lugar || jsonData.ubicacion?.descripcion || 'Desconocido',
          tipo_lugar: jsonData.ubicacion?.tipo_lugar || jsonData.ubicacion?.tipo || 'Desconocido',
          latitud: jsonData.ubicacion?.latitud || null,
          longitud: jsonData.ubicacion?.longitud || null,
          precision_metros: jsonData.ubicacion?.precision_metros || 100,
          zona_horaria: jsonData.ubicacion?.zona_horaria || 'America/Bogota',
          altitud_metros: jsonData.ubicacion?.altitud_metros || null
        },
        
        // Clasificación y análisis
        fuente_relato: jsonData.fuente_relato || 'llamada_oyente',
        genero_principal: jsonData.genero_principal || 'fantasmas_apariciones',
        nivel_credibilidad: jsonData.nivel_credibilidad || 7,
        nivel_impacto: jsonData.nivel_impacto || 6,
        ponderacion_impacto: jsonData.ponderacion_impacto || 5,
        potencial_adaptacion: jsonData.potencial_adaptacion || 3,
        nivel_verificacion: jsonData.nivel_verificacion || 'testimonio_unico',
        
        // Fechas y temporalidad
        fecha_sucesos: jsonData.fecha_sucesos || 'Desconocido',
        fecha_evento_inicio: jsonData.fecha_evento_inicio || '',
        fecha_evento_fin: jsonData.fecha_evento_fin || '',
        hora_evento: jsonData.hora_evento || '',
        duracion_evento_minutos: jsonData.duracion_evento_minutos || null,
        epoca_historica: jsonData.epoca_historica || 'Contemporánea',
        hora_del_dia: jsonData.hora_del_dia || 'Desconocido',
        
        // Testigo principal
        testigo_principal: {
          pseudonimo: jsonData.testigo_principal?.pseudonimo || '',
          edad: jsonData.testigo_principal?.edad || jsonData.testigo_principal?.edad_aprox || '',
          ocupacion: jsonData.testigo_principal?.ocupacion || '',
          relacion_evento: jsonData.testigo_principal?.relacion_evento || '',
          presencial: jsonData.testigo_principal?.presencial ?? true,
          credibilidad: jsonData.testigo_principal?.credibilidad || jsonData.testigo_principal?.credibilidad_estimada || 5,
          factores_credibilidad: jsonData.testigo_principal?.factores_credibilidad || {},
          antecedentes_paranormales: jsonData.testigo_principal?.antecedentes_paranormales || false,
          contacto_disponible: jsonData.testigo_principal?.contacto_disponible || false,
          notas: jsonData.testigo_principal?.notas || ''
        },
        
        // Testigos secundarios
        testigos_secundarios: jsonData.testigos_secundarios || [],
        
        // Entidades
        entidades_reportadas: jsonData.entidades_reportadas || [],
        entidades: jsonData.entidades || [{
          nombre_entidad: '',
          tipo_entidad: 'fantasma',
          descripcion_fisica: '',
          nivel_hostilidad: 'neutral',
          horarios_actividad: []
        }],
        
        // Contexto ambiental
        contexto_ambiental: {
          clima: jsonData.contexto_ambiental?.clima || jsonData.contexto_ambiental?.clima_evento || 'Desconocido',
          temperatura: jsonData.contexto_ambiental?.temperatura || null,
          humedad: jsonData.contexto_ambiental?.humedad || null,
          numero_personas: jsonData.contexto_ambiental?.numero_personas || jsonData.contexto_ambiental?.numero_personas_presente || 1,
          situacion_social: jsonData.contexto_ambiental?.situacion_social || 'Desconocido',
          iluminacion: jsonData.contexto_ambiental?.iluminacion || 'Desconocido',
          sonidos_ambientales: jsonData.contexto_ambiental?.sonidos_ambientales || [],
          olores_particulares: jsonData.contexto_ambiental?.olores_particulares || [],
          otros_factores: jsonData.contexto_ambiental?.otros_factores || ''
        },
        
        // Campos adicionales
        lugar_especifico: jsonData.ubicacion?.lugar_especifico || '',
        municipio: jsonData.ubicacion?.municipio || '',
        vereda: jsonData.ubicacion?.vereda || '',
        barrio: jsonData.ubicacion?.barrio || '',
        
        tipo_historia: jsonData.tipo_historia || 'testimonio_directo',
        temas_relacionados: jsonData.temas_relacionados || [],
        elementos_verificables: jsonData.elementos_verificables || [],
        inconsistencias_detectadas: jsonData.inconsistencias_detectadas || [],
        nivel_detalle: jsonData.nivel_detalle || 5,
        coherencia_interna: jsonData.coherencia_interna || 7,
        plausibilidad_fisica: jsonData.plausibilidad_fisica || 5,
        correlacion_otros_casos: jsonData.correlacion_otros_casos || 3,
        
        // Metadata
        fecha_recepcion: jsonData.fecha_recepcion || new Date().toISOString().split('T')[0],
        medio_recepcion: jsonData.medio_recepcion || 'formulario_web',
        estado_inicial: jsonData.estado_inicial || 'borrador',
        prioridad_revision: jsonData.prioridad_revision || 'media',
        tags_automaticos: jsonData.tags_automaticos || [],
        notas_admin: jsonData.notas_admin || '',
        requiere_seguimiento: jsonData.requiere_seguimiento || false
      };
      
      setNewStoryForm(mappedData);
      setJsonFile(file);
      alert('Archivo JSON cargado exitosamente');
    } catch (error: any) {
      console.error('Error loading JSON:', error);
      alert('Error al cargar el archivo JSON: ' + error.message);
    } finally {
      setIsLoadingJson(false);
    }
  };

  const createNewStory = async () => {
    if (!validateStoryForm()) {
      return;
    }

    setIsSubmittingStory(true);
    
    try {
      // Crear el objeto de historia completo
      const storyData = {
        ...newStoryForm,
        // Asegurar que el ID esté presente
        id: Date.now(),
        // Convertir campos de fecha si es necesario
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Estado inicial
        estado: 'borrador',
        // Autor (usuario actual)
        autor_id: user?.uid || '',
        autor_email: user?.email || '',
        
        // Asegurar que algunos campos tengan valores por defecto
        visitas: 0,
        likes: 0,
        dislikes: 0,
        comentarios_count: 0,
        reportes_count: 0,
        
        // Metadata adicional
        metadata: {
          ip_origen: 'admin_panel',
          user_agent: navigator.userAgent,
          timestamp_creacion: Date.now()
        }
      };

      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Historia creada exitosamente');
        
        // Limpiar el formulario
        setNewStoryForm({
          titulo: '',
          descripcion_corta: '',
          descripcion_larga: '',
          testimonio_completo: '',
          extracto_verbatim: '',
          historia_reescrita: '',
          suceso_principal_resumen: '',
          
          audio_url: '',
          imagen_url: '',
          
          ubicacion: {
            pais: 'Colombia',
            codigo_pais: 'CO',
            departamento: 'Desconocido',
            nivel1_codigo: '',
            ciudad: 'Desconocido',
            nivel2_codigo: '',
            zona: 'Desconocido',
            nivel4_nombre: '',
            descripcion_lugar: 'Desconocido',
            tipo_lugar: 'Desconocido',
            latitud: null,
            longitud: null,
            precision_metros: 100,
            zona_horaria: 'America/Bogota',
            altitud_metros: null
          },
          
          fuente_relato: 'llamada_oyente',
          genero_principal: 'fantasmas_apariciones',
          nivel_credibilidad: 7,
          nivel_impacto: 6,
          ponderacion_impacto: 5,
          potencial_adaptacion: 3,
          nivel_verificacion: 'testimonio_unico',
          
          fecha_sucesos: 'Desconocido',
          hora_evento: '',
          duracion_evento_minutos: null,
          
          testigo_principal: {
            pseudonimo: '',
            edad: '',
            ocupacion: '',
            relacion_evento: '',
            presencial: true,
            credibilidad: 5,
            factores_credibilidad: {},
            antecedentes_paranormales: false,
            contacto_disponible: false,
            notas: ''
          },
          
          testigos_secundarios: [],
          entidades_reportadas: [],
          
          entidades: [{
            nombre_entidad: '',
            tipo_entidad: 'fantasma',
            descripcion_fisica: '',
            nivel_hostilidad: 'neutral',
            horarios_actividad: []
          }],
          
          contexto_ambiental: {
            clima: 'Desconocido',
            temperatura: null,
            humedad: null,
            numero_personas: 1,
            situacion_social: 'Desconocido',
            iluminacion: 'Desconocido',
            sonidos_ambientales: [],
            olores_particulares: [],
            otros_factores: ''
          },
          
          fecha_evento_inicio: '',
          fecha_evento_fin: '',
          epoca_historica: 'Contemporánea',
          hora_del_dia: 'Desconocido',
          patron_temporal: 'Evento único',
          duracion_estimada: '',
          condiciones_climaticas_detalle: '',
          fase_lunar: 'Desconocido',
          
          lugar_especifico: '',
          municipio: '',
          vereda: '',
          barrio: '',
          
          tipo_historia: 'testimonio_directo',
          temas_relacionados: [],
          elementos_verificables: [],
          inconsistencias_detectadas: [],
          nivel_detalle: 5,
          coherencia_interna: 7,
          plausibilidad_fisica: 5,
          correlacion_otros_casos: 3,
          
          fecha_recepcion: new Date().toISOString().split('T')[0],
          medio_recepcion: 'formulario_web',
          estado_inicial: 'borrador',
          prioridad_revision: 'media',
          tags_automaticos: [],
          notas_admin: '',
          requiere_seguimiento: false
        });
        
        setAudioFile(null);
        setImageFile(null);
        setJsonFile(null);
        setValidationErrors([]);
        
      } else {
        alert('Error al crear la historia: ' + result.error);
      }
    } catch (error: any) {
      console.error('Error creating story:', error);
      alert('Error al crear la historia: ' + error.message);
    } finally {
      setIsSubmittingStory(false);
    }
  };

  const validateStoryForm = () => {
    const errors: string[] = [];
    
    if (!newStoryForm.titulo.trim()) {
      errors.push('El título es obligatorio');
    }
    
    if (!newStoryForm.descripcion_corta.trim()) {
      errors.push('La descripción corta es obligatoria');
    }
    
    if (!newStoryForm.testimonio_completo.trim()) {
      errors.push('El testimonio completo es obligatorio');
    }
    
    if (!newStoryForm.testigo_principal.pseudonimo.trim()) {
      errors.push('El pseudónimo del testigo es obligatorio');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // User management functions
  const updateUserStatus = async (userId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
        alert('Estado del usuario actualizado exitosamente');
      } else {
        alert('Error al actualizar el estado del usuario');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error al actualizar el estado del usuario');
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        alert('Rol del usuario actualizado exitosamente');
      } else {
        alert('Error al actualizar el rol del usuario');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error al actualizar el rol del usuario');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'moderator': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'contributor': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-300';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const createNewUser = async () => {
    try {
      // Validar campos
      if (!newUserForm.email || !newUserForm.displayName) {
        alert('Email y nombre son obligatorios');
        return;
      }

      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        newUserForm.email, 
        'password123' // Contraseña temporal
      );

      // Actualizar perfil
      await updateProfile(userCredential.user, {
        displayName: newUserForm.displayName
      });

      // Crear registro en base de datos
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email: newUserForm.email,
          displayName: newUserForm.displayName,
          role: newUserForm.role,
          status: newUserForm.status
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Actualizar lista local
        setUsers(prev => [...prev, {
          id: Date.now(), // Temporal ID
          email: newUserForm.email,
          displayName: newUserForm.displayName,
          role: newUserForm.role,
          status: newUserForm.status,
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: 'Nunca',
          storiesSubmitted: 0,
          storiesPublished: 0,
          premiumStatus: 'free',
          avatar: null
        }]);

        // Limpiar formulario
        setNewUserForm({
          email: '',
          displayName: '',
          role: 'user',
          status: 'active'
        });

        setIsCreateUserDialogOpen(false);
        alert('Usuario creado exitosamente');

        // Cerrar sesión del usuario recién creado para volver al admin
        await signOut(auth);
      } else {
        alert('Error al crear el usuario en la base de datos');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert('Error al crear el usuario: ' + error.message);
    }
  };

  const editUser = (user: any) => {
    setEditingUser(user);
    setNewUserForm({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status
    });
    setIsEditUserDialogOpen(true);
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserForm),
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(prev => 
          prev.map(user => 
            user.id === editingUser.id 
              ? { ...user, ...newUserForm }
              : user
          )
        );
        setIsEditUserDialogOpen(false);
        setEditingUser(null);
        alert('Usuario actualizado exitosamente');
      } else {
        alert('Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar el usuario');
    }
  };

  const deleteUser = async (user: any) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.displayName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        alert('Usuario eliminado exitosamente');
      } else {
        alert('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const resetUserPassword = async (userEmail: string) => {
    try {
      const response = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Email de restablecimiento enviado exitosamente');
      } else {
        alert('Error al enviar el email de restablecimiento');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error al enviar el email de restablecimiento');
    }
  };

  const setCustomPassword = async (userEmail: string) => {
    const newPassword = prompt('Ingresa la nueva contraseña:');
    if (!newPassword) return;

    try {
      const response = await fetch('/api/admin/users/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: selectedUser?.email, password: newPassword }),
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Contraseña actualizada exitosamente');
      } else {
        alert('Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error setting password:', error);
      alert('Error al actualizar la contraseña');
    }
  };

  // Helper functions for witnesses
  const addTestigoSecundario = () => {
    const nuevoTestigo = {
      tipo_testigo: 'secundario',
      nombre_completo: '',
      pseudonimo: '',
      edad_aprox: 0,
      ocupacion: '',
      relacion_evento: '',
      presencial: false,
      credibilidad_estimada: 0,
      factores_credibilidad: {},
      antecedentes_paranormales: false,
      contacto_disponible: false,
      notas_testigo: ''
    };
    
    setNewStoryForm(prev => ({
      ...prev,
      testigos_secundarios: [...prev.testigos_secundarios, nuevoTestigo]
    }));
  };

  const removeTestigoSecundario = (index: number) => {
    setNewStoryForm(prev => ({
      ...prev,
      testigos_secundarios: prev.testigos_secundarios.filter((_, i) => i !== index)
    }));
  };

  const updateTestigoSecundario = (index: number, field: string, value: any) => {
    setNewStoryForm(prev => {
      const updatedTestigos = [...prev.testigos_secundarios];
      updatedTestigos[index] = { ...updatedTestigos[index], [field]: value };
      return { ...prev, testigos_secundarios: updatedTestigos };
    });
  };

  // Clear form function
  const clearForm = () => {
    setNewStoryForm({
      historias: {
        titulo_provisional: '',
        descripcion_corta: '',
        descripcion_larga: '',
        testimonio_completo: '',
        extracto_verbatim: '',
        historia_reescrita: '',
        suceso_principal_resumen: '',
        protagonistas_descripcion: '',
        fuente_relato: 'llamada_oyente',
        genero_principal: 'fantasmas_apariciones',
        epoca_historica: 'Contemporánea',
        nivel_credibilidad: 0,
        nivel_impacto: 1,
        ponderacion_impacto: 1,
        potencial_adaptacion: 1,
        nivel_verificacion: 'sin_verificar',
        longitud_extracto_palabras: 0,
        fecha_sucesos: 'Desconocido',
        fecha_evento_inicio: 'Desconocido',
        fecha_evento_fin: 'Desconocido',
        hora_evento: '',
        evento_recurrente: false,
        dificultad_produccion: 1,
        tiempo_produccion_estimado: 0,
        presupuesto_estimado: 0,
        contenido_sensible: false,
        advertencias: [],
        edad_minima_recomendada: 0,
        duracion_impacto_emocional: 'leve',
        banderas_rojas: [],
        notas_adicionales: '',
        duracion_evento_minutos: 0,
        patron_recurrencia: '',
        palabras_clave_patron: [],
        hash_similarity: '',
        codigo_unico: '',
        fecha_transcripcion: '',
        estado_procesamiento: 'extraida',
        publicar_inmediatamente: false
      },
      ubicacion: {
        pais: 'Colombia',
        codigo_pais: 'CO',
        nivel1_nombre: '',
        nivel1_codigo: '',
        nivel2_nombre: '',
        nivel2_codigo: '',
        nivel3_nombre: '',
        nivel4_nombre: '',
        latitud: null,
        longitud: null,
        precision_metros: 100,
        descripcion_lugar: '',
        lugar_especifico: '',
        tipo_lugar: '',
        zona_horaria: 'America/Bogota',
        altitud_metros: null,
        actividad_paranormal_reportada: false,
        numero_historias_reportadas: 0,
        primera_actividad_reportada: '',
        ultima_actividad_reportada: '',
        verificada: false,
        fuente_verificacion: '',
        departamento: '',
        municipio: ''
      },
      testigo_principal: {
        tipo_testigo: 'principal',
        nombre_completo: '',
        pseudonimo: '',
        edad_aprox: 0,
        ocupacion: '',
        relacion_evento: '',
        presencial: true,
        credibilidad_estimada: 0,
        factores_credibilidad: {},
        antecedentes_paranormales: false,
        contacto_disponible: false,
        notas_testigo: ''
      },
      testigos_secundarios: [],
      entidades_paranormales: [],
      contexto_ambiental: {
        clima: '',
        temperatura: '',
        humedad: '',
        condiciones_luz: '',
        ruidos_ambiente: '',
        factores_externos: '',
        numero_personas: 1,
        situacion_social: '',
        fase_lunar: '',
        festividad_religiosa: '',
        evento_historico: '',
        aniversario_especial: '',
        actividad_previa: '',
        estado_emocional: '',
        patron_temporal: false,
        hora_del_dia: '',
        estacion_año: ''
      },
      archivos_multimedia: [],
      elementos_clave: [],
      factores_credibilidad: {
        multiples_testigos: 0,
        evidencia_fisica: 0,
        consistencia_relatos: 0,
        ubicacion_verificable: 0,
        contexto_historico: 0,
        sobriedad_testigo: 0,
        conocimiento_previo: 0,
        estado_emocional: 0,
        motivaciones_secundarias: 0,
        corroboracion_externa: 0,
        documentacion_disponible: 0
      },
      derechos: {
        derechos_uso: '',
        autorizacion_comercial: false,
        autorizacion_adaptacion: false,
        restricciones_uso: '',
        contacto_derechos: '',
        fecha_autorizacion: '',
        vigencia_derechos: '',
        notas_legales: ''
      },
      performance_esperado: {
        audiencia_objetivo: '',
        engagement_esperado: 0,
        potencial_viral: 0,
        impacto_emocional_esperado: 0,
        duracion_interes_estimada: 0,
        metricas_objetivo: {}
      }
    });
    setValidationErrors([]);
    setAudioFile(null);
    setImageFile(null);
    setJsonFile(null);
  };

  // Download JSON template function
  const downloadJsonTemplate = () => {
    const template = newStoryForm;
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historia-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userFilterRole === 'all' || user.role === userFilterRole;
    const matchesStatus = userFilterStatus === 'all' || user.status === userFilterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona contenido, usuarios y configuraciones de Archivos Paranormales</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-2" />Dashboard</TabsTrigger>
            <TabsTrigger value="homepage"><Eye className="h-4 w-4 mr-2" />Vista Principal</TabsTrigger>
            <TabsTrigger value="create-story"><FileText className="h-4 w-4 mr-2" />Nueva Historia</TabsTrigger>
            <TabsTrigger value="content"><FileText className="h-4 w-4 mr-2" />Contenido</TabsTrigger>
            <TabsTrigger value="store"><ShoppingCart className="h-4 w-4 mr-2" />Tienda</TabsTrigger>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Dashboard 
              formatCurrency={formatCurrency}
              getActivityIcon={getActivityIcon}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <VistaPrincipal
              homepageConfig={homepageConfig}
              setHomepageConfig={setHomepageConfig}
              filteredStories={filteredStories}
              categories={categories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setHeroStory={setHeroStory}
              addStoryToCarousel={addStoryToCarousel}
              removeStoryFromCarousel={removeStoryFromCarousel}
              moveCarousel={moveCarousel}
              saveHomepageConfig={saveHomepageConfig}
              mockAllStories={mockAllStories}
            />
          </TabsContent>

          <TabsContent value="create-story" className="space-y-6">
            <NuevaHistoria
              newStoryForm={newStoryForm}
              setNewStoryForm={setNewStoryForm}
              validationErrors={validationErrors}
              audioFile={audioFile}
              setAudioFile={setAudioFile}
              imageFile={imageFile}
              setImageFile={setImageFile}
              jsonFile={jsonFile}
              setJsonFile={setJsonFile}
              isUploadingFiles={isUploadingFiles}
              isSubmittingStory={isSubmittingStory}
              isLoadingJson={isLoadingJson}
              handleFileUpload={handleFileUpload}
              handleJsonLoad={handleJsonLoad}
              downloadJsonTemplate={downloadJsonTemplate}
              clearForm={clearForm}
              createNewStory={createNewStory}
              addTestigoSecundario={addTestigoSecundario}
              removeTestigoSecundario={removeTestigoSecundario}
              updateTestigoSecundario={updateTestigoSecundario}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Contenido />
          </TabsContent>

          <TabsContent value="store" className="space-y-6">
            <Tienda />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Usuarios
              users={users}
              isLoadingUsers={isLoadingUsers}
              userSearchTerm={userSearchTerm}
              setUserSearchTerm={setUserSearchTerm}
              userFilterRole={userFilterRole}
              setUserFilterRole={setUserFilterRole}
              userFilterStatus={userFilterStatus}
              setUserFilterStatus={setUserFilterStatus}
              filteredUsers={filteredUsers}
              updateUserStatus={updateUserStatus}
              updateUserRole={updateUserRole}
              getRoleBadgeColor={getRoleBadgeColor}
              getStatusBadgeColor={getStatusBadgeColor}
              createNewUser={createNewUser}
              editUser={editUser}
              deleteUser={deleteUser}
              resetUserPassword={resetUserPassword}
              setCustomPassword={setCustomPassword}
              isCreateUserDialogOpen={isCreateUserDialogOpen}
              setIsCreateUserDialogOpen={setIsCreateUserDialogOpen}
              isEditUserDialogOpen={isEditUserDialogOpen}
              setIsEditUserDialogOpen={setIsEditUserDialogOpen}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
              newUserForm={newUserForm}
              setNewUserForm={setNewUserForm}
              updateUser={updateUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
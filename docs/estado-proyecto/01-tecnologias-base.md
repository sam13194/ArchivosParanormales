# 🛠️ Tecnologías Base - Archivos Paranormales

## Stack Tecnológico Implementado

### 🎨 **Frontend**
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Styling utility-first
- **Shadcn/ui** - Componentes UI estilo Netflix
- **Lucide React** - Iconografía consistente

### 🔐 **Autenticación**
- **Firebase Auth** - Login/logout, gestión de sesiones
- **Firebase Admin SDK** - Operaciones administrativas
- **Context API** - Estado global de autenticación

### 💾 **Base de Datos**
- **Supabase PostgreSQL** - Base de datos principal
- **Row Level Security (RLS)** - Seguridad a nivel de fila
- **Service Role Key** - APIs administrativas

### 📁 **Storage y Media**
- **Cloudinary** - Almacenamiento privado de archivos
- **Signed URLs** - Acceso controlado a medios
- **Auto-upload** - Subida directa desde frontend

### 💳 **Pagos**
- **Stripe** - Procesamiento de pagos
- **Stripe Colombia** - Métodos de pago locales (PSE, Nequi)
- **Webhooks** - Confirmación automática de pagos

### 🤖 **IA y Recomendaciones**
- **Google Genkit** - Framework de IA
- **Vertex AI** - Servicios de machine learning
- **Flujos automáticos** - Generación de thumbnails y recomendaciones

## 🔧 Configuración de Desarrollo

### Variables de Entorno Requeridas
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Scripts de Desarrollo
```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Análisis de bundle
npm run analyze
```

## 📦 Dependencias Principales

### Producción
- `next` - Framework React
- `react` & `react-dom` - Librería base
- `typescript` - Tipado estático
- `tailwindcss` - CSS utility-first
- `@supabase/supabase-js` - Cliente Supabase
- `firebase` - SDK Firebase
- `stripe` - SDK Stripe
- `cloudinary` - SDK Cloudinary
- `@google-cloud/genkit` - Framework IA

### Desarrollo
- `@types/*` - Tipados TypeScript
- `eslint` - Linter de código
- `prettier` - Formatter de código

## 🚀 Rendimiento

### Optimizaciones Implementadas
- **Code Splitting** - Carga lazy de componentes
- **Image Optimization** - Next.js Image con Cloudinary
- **Bundle Analysis** - Monitoreo de tamaño de assets
- **Tree Shaking** - Eliminación de código no usado

### Métricas Objetivo
- **FCP** < 1.5s (First Contentful Paint)
- **LCP** < 2.5s (Largest Contentful Paint) 
- **CLS** < 0.1 (Cumulative Layout Shift)
- **FID** < 100ms (First Input Delay)

## 🔒 Seguridad

### Implementaciones de Seguridad
- **Environment Variables** - Secretos en variables de entorno
- **API Routes Protection** - Validación de autenticación
- **CORS Configuration** - Configuración de dominios permitidos
- **Input Validation** - Sanitización de datos de entrada
- **Private Media** - Acceso controlado a archivos

### Checklist de Seguridad
- ✅ Variables sensibles en `.env.local`
- ✅ API keys no expuestas en frontend
- ✅ Validación de roles en rutas protegidas
- ✅ Sanitización de uploads de archivos
- ✅ HTTPS enforced en producción

## 📱 Compatibilidad

### Navegadores Soportados
- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Dispositivos
- **Desktop** - 1200px+
- **Tablet** - 768px - 1199px
- **Mobile** - 320px - 767px

### Features Requeridas
- **JavaScript** - Habilitado
- **LocalStorage** - Para persistencia de estado
- **Audio API** - Para reproducción de historias
- **File API** - Para subida de archivos

---

**Estado:** ✅ **Completamente implementado y funcional**  
**Próximo paso:** Configuración de variables de producción para Vercel
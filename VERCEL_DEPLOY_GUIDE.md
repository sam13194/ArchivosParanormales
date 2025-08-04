# 🚀 Guía de Deploy en Vercel - Archivos Paranormales

## 📋 Pre-requisitos Completados
- ✅ Aplicación creada en Vercel
- ✅ Código listo para deploy
- ✅ Panel admin completo con CRUD de usuarios
- ✅ Error UserCircle corregido

## 🔐 Variables de Entorno para Vercel

Configurar las siguientes variables en **Vercel Dashboard > Settings > Environment Variables**:

### **Cloudinary (Media Storage)**
```bash
CLOUDINARY_CLOUD_NAME=dwiz8bahl
CLOUDINARY_API_KEY=361321993316989
CLOUDINARY_API_SECRET=qZiw3mAc2ltpP25doO-JW_aH06o
CLOUDINARY_URL=cloudinary://361321993316989:qZiw3mAc2ltpP25doO-JW_aH06o@dwiz8bahl
```

### **Supabase (Base de Datos)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://rcznxhzstgclbgghnfeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjem54aHpzdGdjbGJnZ2huZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDU1ODEsImV4cCI6MjA2OTIyMTU4MX0.jXw_c7FxWcVoDZc6UR9fFSkpHYFfRw5-i6iWaQwdBPE
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=postgresql://postgres:MGmG9BCIIYLsLtlA@db.rcznxhzstgclbgghnfeh.supabase.co:5432/postgres
```

### **Stripe (Pagos - Test Keys por ahora)**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_replace_with_your_publishable_key
STRIPE_SECRET_KEY=sk_test_replace_with_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_replace_with_your_webhook_secret
```

### **Bancolombia (Información para transferencias)**
```bash
BANCOLOMBIA_ACCOUNT_NUMBER=your_account_number
BANCOLOMBIA_ACCOUNT_TYPE=ahorros
BANCOLOMBIA_ACCOUNT_HOLDER=ARCHIVOS PARANORMALES SAS
```

### **Firebase Auth (Si está configurado)**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 🔧 Configuraciones Post-Deploy

### 1. **Firebase Auth - Dominios Autorizados**
En Firebase Console > Authentication > Settings > Authorized Domains:
- Agregar: `tu-app.vercel.app`
- Agregar: `tu-dominio-personalizado.com` (si tienes uno)

### 2. **Stripe Webhooks**
En Stripe Dashboard > Developers > Webhooks:
- Endpoint URL: `https://tu-app.vercel.app/api/webhooks/stripe`
- Eventos a escuchar:
  - `checkout.session.completed`
  - `payment_intent.succeeded` 
  - `invoice.payment_succeeded`
  - `customer.subscription.created`
  - `customer.subscription.deleted`

### 3. **Supabase RLS Policies**
Verificar que las políticas RLS incluyan tu email de admin:
```sql
-- Actualizar políticas si es necesario
UPDATE policies SET definition = 
'current_setting(''request.jwt.claims'', true)::json->>''email'' IN (''wilmer13194@gmail.com'', ''admin@paranormal.co'')'
WHERE policy_name LIKE '%admin%';
```

## 🧪 Testing Post-Deploy

### **1. Testing Básico**
- [ ] Página principal carga correctamente
- [ ] Login/registro funciona
- [ ] Navegación entre páginas

### **2. Testing Admin (wilmer13194@gmail.com)**
- [ ] Acceso al panel admin
- [ ] Dashboard muestra estadísticas
- [ ] Crear nueva historia funciona
- [ ] Editor de vista principal funciona
- [ ] CRUD de usuarios completo:
  - [ ] Crear usuario
  - [ ] Editar usuario 
  - [ ] Cambiar roles
  - [ ] Suspender/activar
  - [ ] Eliminar usuario (no-admins)

### **3. Testing Tienda**
- [ ] Catálogo de productos carga
- [ ] Carrito funciona
- [ ] Checkout inicia (con test keys)
- [ ] Encuesta de servicios funciona

### **4. Testing Media**
- [ ] Subida de audio a Cloudinary
- [ ] Reproducción de audio
- [ ] Thumbnails se muestran

## 🚨 Problemas Comunes y Soluciones

### **Error: "Supabase connection failed"**
- Verificar NEXT_PUBLIC_SUPABASE_URL y ANON_KEY
- Verificar que el proyecto Supabase esté activo

### **Error: "Firebase Auth domain not authorized"**
- Agregar dominio de Vercel a Firebase authorized domains
- Verificar configuración de auth domain

### **Error: "Stripe webhook verification failed"**
- Verificar STRIPE_WEBHOOK_SECRET
- Actualizar endpoint URL en Stripe Dashboard

### **Error: "Admin access denied"**
- Verificar que tu email esté en las políticas RLS
- Verificar configuración de roles en la aplicación

## 📊 Métricas de Success

### **Deploy Exitoso Si:**
- ✅ Aplicación carga sin errores
- ✅ Login funciona con tu email
- ✅ Panel admin accesible
- ✅ Creación de historias funciona
- ✅ CRUD de usuarios completo
- ✅ Carrito y tienda funcionan
- ✅ Upload de media funciona

### **Ready for Production Si:**
- ✅ Todo lo anterior +
- ✅ Stripe keys reales configuradas
- ✅ Webhook de producción funcionando
- ✅ Firebase Auth en dominio real
- ✅ Testing completo de pagos reales

## 🎯 Próximos Pasos Post-Deploy

1. **Testing Completo** - Verificar todos los módulos
2. **Stripe Real** - Configurar cuenta colombiana real
3. **Contenido Real** - Subir historias usando panel admin
4. **SEO Básico** - Meta tags y sitemap
5. **Monitoring** - Configurar alertas y logs

## 🔗 URLs Importantes
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Supabase Dashboard**: https://app.supabase.com
- **Cloudinary Console**: https://cloudinary.com/console

¡Listo para deploy! 🚀
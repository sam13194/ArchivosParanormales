# 🚨 Bloqueadores Críticos del Proyecto

## 🔥 **CRÍTICO #1: Base de Datos Desactualizada**

### 📊 **Estado Actual**
- ❌ **Frontend:** Sistema avanzado con +150 campos implementado
- ❌ **Backend:** Base de datos con esquema básico (~30 campos)
- ❌ **Resultado:** Sistema no puede guardar datos del formulario avanzado

### 💥 **Impacto**
- **BLOQUEADOR TOTAL:** Formulario avanzado no funciona
- **BLOQUEADOR TOTAL:** Carga JSON masiva falla 
- **BLOQUEADOR TOTAL:** No se pueden crear historias completas
- **BLOQUEADOR DEPLOY:** Sistema no funcional en producción

### 📋 **Tablas y Campos Faltantes**

#### **Tabla `historias` - Campos Críticos Faltantes:**
```sql
-- Información expandida
codigo_unico VARCHAR(50) UNIQUE,
fecha_transcripcion DATE,
estado_procesamiento VARCHAR(30),
extracto_verbatim TEXT,
historia_reescrita TEXT,
suceso_principal_resumen TEXT,

-- Tiempo detallado  
hora_evento TIME,
duracion_evento_minutos INTEGER,
epoca_historica VARCHAR(50),

-- Análisis avanzado
protagonistas_descripcion TEXT,
palabras_clave_patron TEXT[],
duracion_impacto_emocional VARCHAR(20),
presupuesto_estimado DECIMAL(10,2),
notas_adicionales TEXT,

-- Factores de credibilidad (nuevos campos)
evidencia_fisica INTEGER CHECK (evidencia_fisica >= 1 AND evidencia_fisica <= 5),
consistencia_relatos INTEGER CHECK (consistencia_relatos >= 1 AND consistencia_relatos <= 5),
contexto_historico INTEGER CHECK (contexto_historico >= 1 AND contexto_historico <= 5),
sobriedad_testigo INTEGER CHECK (sobriedad_testigo >= 1 AND sobriedad_testigo <= 5),
conocimiento_previo INTEGER CHECK (conocimiento_previo >= 1 AND conocimiento_previo <= 5),
estado_emocional_factor INTEGER CHECK (estado_emocional_factor >= 1 AND estado_emocional_factor <= 5),
banderas_rojas TEXT[],

-- Performance y audiencia
audiencia_objetivo VARCHAR(50),
engagement_esperado VARCHAR(20),

-- Derechos
derechos_uso VARCHAR(30),
autorizacion_comercial BOOLEAN,
autorizacion_adaptacion BOOLEAN,
restricciones_uso TEXT,
contacto_derechos VARCHAR(100)
```

#### **Tabla `ubicaciones` - Campos GPS y Códigos:**
```sql
-- Códigos oficiales
codigo_pais VARCHAR(2),
nivel1_codigo VARCHAR(10),  -- Código departamento
nivel2_codigo VARCHAR(10),  -- Código ciudad
nivel3_nombre VARCHAR(100), -- Barrio/Comuna
nivel4_nombre VARCHAR(100), -- Localidad específica

-- Coordenadas GPS
precision_metros INTEGER,
zona_horaria VARCHAR(50),
altitud_metros INTEGER,

-- Metadatos paranormales
actividad_paranormal_reportada BOOLEAN,
numero_historias_reportadas INTEGER,
primera_actividad_reportada DATE,
ultima_actividad_reportada DATE,
fuente_verificacion VARCHAR(100)
```

#### **Tabla `testigos` - Información Expandida:**
```sql
-- Campos faltantes críticos
tipo_testigo VARCHAR(30),
relacion_evento TEXT,
presencial BOOLEAN,
antecedentes_paranormales BOOLEAN,
contacto_disponible BOOLEAN,
notas_testigo TEXT,

-- JSON para factores complejos
factores_credibilidad JSONB
```

#### **Tabla `contexto_ambiental` - Datos Científicos:**
```sql
-- Condiciones específicas
temperatura_aprox INTEGER,
humedad_aprox INTEGER,
fase_lunar VARCHAR(30),
festividad_religiosa VARCHAR(100),
evento_historico VARCHAR(200),
aniversario_especial VARCHAR(200),
actividad_previa TEXT,
estado_emocional_testigos TEXT,
patron_temporal_detectado BOOLEAN
```

#### **NUEVAS TABLAS REQUERIDAS:**

**Tabla `factores_credibilidad`:**
```sql
CREATE TABLE factores_credibilidad (
    id SERIAL PRIMARY KEY,
    historia_id INTEGER REFERENCES historias(id) UNIQUE,
    multiples_testigos INTEGER CHECK (multiples_testigos >= 1 AND multiples_testigos <= 5),
    evidencia_fisica INTEGER CHECK (evidencia_fisica >= 1 AND evidencia_fisica <= 5),
    consistencia_relatos INTEGER CHECK (consistencia_relatos >= 1 AND consistencia_relatos <= 5),
    ubicacion_verificable INTEGER CHECK (ubicacion_verificable >= 1 AND ubicacion_verificable <= 5),
    contexto_historico INTEGER CHECK (contexto_historico >= 1 AND contexto_historico <= 5),
    sobriedad_testigo INTEGER CHECK (sobriedad_testigo >= 1 AND sobriedad_testigo <= 5),
    conocimiento_previo INTEGER CHECK (conocimiento_previo >= 1 AND conocimiento_previo <= 5),
    estado_emocional INTEGER CHECK (estado_emocional >= 1 AND estado_emocional <= 5),
    banderas_rojas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Tabla `subgeneros`:**
```sql
CREATE TABLE subgeneros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color_hex VARCHAR(7) DEFAULT '#808080',
    icono VARCHAR(30) DEFAULT 'ghost',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Tabla `elementos_clave`:**
```sql
CREATE TABLE elementos_clave (
    id SERIAL PRIMARY KEY,
    elemento VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**5 TABLAS ADICIONALES:** metricas_iniciales, performance_esperado, derechos, colaboradores, historia_elementos

### 🎯 **Acción Requerida INMEDIATA**

**PASO 1:** Crear scripts SQL de actualización
```bash
# Ubicación de scripts
/home/wilmer/ArchivosParanormales/database/
├── actualizar_esquema_completo_v2.sql  # ← CREAR ESTE
├── insertar_datos_iniciales.sql       # ← CREAR ESTE  
└── verificar_actualizacion.sql        # ← CREAR ESTE
```

**PASO 2:** Ejecutar en Supabase Dashboard
1. Ir a: https://app.supabase.com/project/rcznxhzstgclbgghnfeh/sql/new
2. Ejecutar script de actualización
3. Verificar que todas las tablas/campos se crearon
4. Ejecutar datos iniciales (subgéneros, elementos clave)

**PASO 3:** Actualizar APIs
- Modificar `/api/admin/historias/route.ts` para nuevos campos
- Actualizar validación de esquema
- Testing de formulario completo

---

## ⚠️ **CRÍTICO #2: Variables de Producción Faltantes**

### 📊 **Estado Deploy Vercel**
- ✅ **App creada:** https://archivos-paranormales.vercel.app/
- ❌ **Variables configuradas:** 0 de 15 requeridas
- ❌ **Funcionalidad:** Sistema no operativo

### 🔑 **Variables de Entorno Requeridas**

```bash
# Supabase (CRÍTICO)
NEXT_PUBLIC_SUPABASE_URL=https://rcznxhzstgclbgghnfeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Firebase Auth (CRÍTICO)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=archivos-paranormales.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=archivos-paranormales
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=archivos-paranormales.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Cloudinary (CRÍTICO)  
CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123...
CLOUDINARY_API_SECRET=abc...

# Stripe (IMPORTANTE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 🎯 **Acción Requerida**
1. **Ir a Vercel Dashboard:** https://vercel.com/wilmer13194s-projects/archivos-paranormales
2. **Settings → Environment Variables**
3. **Agregar todas las variables** de desarrollo
4. **Redeploy** la aplicación

---

## ⚠️ **CRÍTICO #3: Configuración Firebase Auth para Dominio Vercel**

### 📊 **Estado Actual**
- ✅ **Firebase configurado** para localhost
- ❌ **Dominio Vercel** no autorizado
- ❌ **Redirect URLs** no configuradas

### 🔧 **Configuración Requerida**

**En Firebase Console:**
1. **Ir a:** https://console.firebase.google.com/project/archivos-paranormales
2. **Authentication → Settings → Authorized domains**
3. **Agregar:** `archivos-paranormales.vercel.app`
4. **OAuth redirect URIs:** Actualizar para Vercel

### 🎯 **URLs de Redirect Requeridas**
```
# Producción
https://archivos-paranormales.vercel.app/__/auth/handler
https://archivos-paranormales.vercel.app/auth/login
https://archivos-paranormales.vercel.app/auth/register

# Testing
https://archivos-paranormales-git-main-wilmer13194s-projects.vercel.app/...
```

---

## ⚠️ **CRÍTICO #4: Webhook Stripe para Dominio de Producción**

### 📊 **Estado Actual**
- ✅ **Webhook configurado** para localhost
- ❌ **Endpoint Vercel** no configurado
- ❌ **Pagos en producción** no funcionarán

### 🎯 **Acción Requerida**
1. **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
2. **Crear nuevo endpoint:** `https://archivos-paranormales.vercel.app/api/webhooks/stripe`
3. **Eventos requeridos:**
   - `checkout.session.completed`
   - `payment_intent.succeeded` 
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`

---

## 📊 **Resumen de Bloqueadores**

| Bloqueador | Impacto | Tiempo Estimado | Dependencias |
|------------|---------|-----------------|--------------|
| **🔥 Base de Datos** | TOTAL | 2-3 horas | Scripts SQL |
| **⚠️ Variables Vercel** | DEPLOY | 30 min | Acceso a keys |
| **⚠️ Firebase Domains** | AUTH | 15 min | Firebase Console |
| **⚠️ Stripe Webhooks** | PAGOS | 15 min | Stripe Dashboard |

## 🎯 **Plan de Resolución**

### ⏰ **Fase 1: Desbloqueo Inmediato (3 horas)**
1. **Crear y ejecutar scripts SQL** → Base de datos actualizada
2. **Configurar variables en Vercel** → Sistema funcional
3. **Actualizar Firebase domains** → Auth funcional  
4. **Configurar Stripe webhooks** → Pagos funcionales

### ⏰ **Fase 2: Validación (1 hora)**
1. **Testing completo** en ambiente de producción
2. **Crear historia completa** usando formulario avanzado
3. **Probar carga JSON** con plantilla completa
4. **Validar flujo de pagos** (modo test)

### ⏰ **Fase 3: Go Live (30 min)**
1. **Configurar Stripe producción** (cuando tengas cuenta real)
2. **Dominio personalizado** (opcional)
3. **Monitoreo y logs** activados

---

**🚨 SIN RESOLVER ESTOS BLOQUEADORES EL SISTEMA NO PUEDE DESPLEGARSE**

**Prioridad absoluta:** Base de datos actualizada es el bloqueador más crítico.
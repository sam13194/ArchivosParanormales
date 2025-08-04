-- ============================================
-- PANEL ADMINISTRATIVO Y TIENDA ONLINE SCHEMA
-- ============================================

-- ============================================
-- 1. SISTEMA DE ROLES Y PERMISOS
-- ============================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    permisos JSONB DEFAULT '[]', -- ["view_stories", "edit_stories", "delete_stories", "manage_users"]
    nivel_acceso SMALLINT DEFAULT 1, -- 1=usuario, 2=moderador, 3=editor, 4=admin, 5=super_admin
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE usuarios_roles (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rol_id INT REFERENCES roles(id),
    asignado_por VARCHAR(128), -- Firebase UID de quien asignó el rol
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE,
    notas TEXT,
    
    UNIQUE(firebase_uid, rol_id)
);

-- ============================================
-- 2. PRODUCTOS Y TIENDA ONLINE
-- ============================================

CREATE TABLE categorias_productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    imagen_url VARCHAR(500),
    orden_display SMALLINT DEFAULT 1,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Categorización
    categoria_id INT REFERENCES categorias_productos(id),
    tags JSONB DEFAULT '[]',
    
    -- Tipos de producto
    tipo_producto VARCHAR(50) CHECK (tipo_producto IN (
        'suscripcion_mensual', 'suscripcion_anual', 'contenido_premium',
        'merchandise', 'libro_digital', 'audiolibro', 'bundle',
        'acceso_exclusivo', 'consultoria_paranormal', 'investigacion_personalizada'
    )) NOT NULL,
    
    -- Precios
    precio_base DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2) NULL,
    moneda VARCHAR(3) DEFAULT 'COP',
    precio_usd DECIMAL(10,2) NULL, -- Para pagos internacionales
    
    -- Suscripciones
    es_suscripcion BOOLEAN DEFAULT FALSE,
    periodo_suscripcion VARCHAR(20), -- 'monthly', 'yearly', 'lifetime'
    dias_trial SMALLINT DEFAULT 0,
    
    -- Stock y disponibilidad
    tiene_stock BOOLEAN DEFAULT FALSE, -- Solo para productos físicos
    stock_cantidad INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    es_digital BOOLEAN DEFAULT TRUE,
    
    -- Contenido digital
    archivos_incluidos JSONB DEFAULT '[]', -- URLs de archivos digitales
    acceso_historias_ids JSONB DEFAULT '[]', -- IDs de historias premium
    duracion_acceso_dias INT NULL, -- NULL = permanente
    
    -- Visibilidad y estado
    estado VARCHAR(20) CHECK (estado IN ('borrador', 'activo', 'pausado', 'agotado')) DEFAULT 'borrador',
    visible_tienda BOOLEAN DEFAULT TRUE,
    requiere_autenticacion BOOLEAN DEFAULT TRUE,
    edad_minima SMALLINT DEFAULT 18,
    
    -- SEO y marketing
    meta_titulo VARCHAR(255),
    meta_descripcion TEXT,
    imagen_principal VARCHAR(500),
    galeria_imagenes JSONB DEFAULT '[]',
    video_preview VARCHAR(500),
    
    -- Métricas
    veces_comprado INT DEFAULT 0,
    rating_promedio DECIMAL(3,2) DEFAULT 0,
    numero_reviews INT DEFAULT 0,
    
    -- Fechas especiales
    fecha_lanzamiento TIMESTAMP WITH TIME ZONE,
    fecha_descontinuacion TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. SISTEMA DE COMPRAS Y PAGOS
-- ============================================

CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(50) UNIQUE NOT NULL,
    
    -- Cliente
    cliente_firebase_uid VARCHAR(128) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_nombre VARCHAR(255),
    cliente_telefono VARCHAR(20),
    
    -- Totales
    subtotal DECIMAL(10,2) NOT NULL,
    descuentos DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'COP',
    
    -- Estado de la orden
    estado VARCHAR(30) CHECK (estado IN (
        'pendiente', 'pagando', 'pagada', 'procesando', 
        'completada', 'cancelada', 'reembolsada', 'fallida'
    )) DEFAULT 'pendiente',
    
    -- Información de pago
    metodo_pago VARCHAR(50), -- 'stripe', 'payu', 'paypal', 'bancolombia'
    id_transaccion_pago VARCHAR(255),
    fecha_pago TIMESTAMP WITH TIME ZONE,
    comprobante_pago VARCHAR(500), -- URL del comprobante
    
    -- Dirección de envío (para productos físicos)
    direccion_envio JSONB NULL,
    
    -- Notas
    notas_cliente TEXT,
    notas_admin TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orden_items (
    id SERIAL PRIMARY KEY,
    orden_id INT REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id),
    
    -- Detalles del producto en el momento de compra
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion_producto TEXT,
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad SMALLINT DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL,
    
    -- Para suscripciones
    fecha_inicio_suscripcion TIMESTAMP WITH TIME ZONE,
    fecha_fin_suscripcion TIMESTAMP WITH TIME ZONE,
    
    -- Acceso a contenido
    contenido_otorgado JSONB DEFAULT '[]', -- IDs de historias desbloqueadas
    fecha_acceso_hasta TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. SUSCRIPCIONES Y MEMBRESÍAS
-- ============================================

CREATE TABLE suscripciones (
    id SERIAL PRIMARY KEY,
    cliente_firebase_uid VARCHAR(128) NOT NULL,
    producto_id INT REFERENCES productos(id),
    orden_origen_id INT REFERENCES ordenes(id),
    
    -- Estado de suscripción
    estado VARCHAR(20) CHECK (estado IN (
        'activa', 'pausada', 'cancelada', 'vencida', 'trial'
    )) DEFAULT 'trial',
    
    -- Fechas
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    fecha_siguiente_pago TIMESTAMP WITH TIME ZONE,
    fecha_cancelacion TIMESTAMP WITH TIME ZONE,
    
    -- Configuración
    periodo VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    precio_periodo DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'COP',
    
    -- Renovación automática
    auto_renovar BOOLEAN DEFAULT TRUE,
    intentos_pago_fallidos SMALLINT DEFAULT 0,
    
    -- Beneficios actuales
    acceso_historias_premium BOOLEAN DEFAULT FALSE,
    descarga_sin_limite BOOLEAN DEFAULT FALSE,
    acceso_contenido_exclusivo BOOLEAN DEFAULT FALSE,
    sin_publicidad BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. SISTEMA DE CUPONES Y DESCUENTOS
-- ============================================

CREATE TABLE cupones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Tipo de descuento
    tipo_descuento VARCHAR(20) CHECK (tipo_descuento IN ('porcentaje', 'monto_fijo', 'envio_gratis')) NOT NULL,
    valor_descuento DECIMAL(10,2) NOT NULL, -- Porcentaje (ej: 20) o monto (ej: 5000)
    descuento_maximo DECIMAL(10,2), -- Máximo descuento para porcentajes
    
    -- Restricciones
    compra_minima DECIMAL(10,2) DEFAULT 0,
    productos_aplicables JSONB DEFAULT '[]', -- IDs de productos, vacío = todos
    categorias_aplicables JSONB DEFAULT '[]',
    solo_primera_compra BOOLEAN DEFAULT FALSE,
    
    -- Límites de uso
    usos_maximos INT NULL, -- NULL = ilimitado
    usos_por_cliente SMALLINT DEFAULT 1,
    usos_actuales INT DEFAULT 0,
    
    -- Vigencia
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE uso_cupones (
    id SERIAL PRIMARY KEY,
    cupon_id INT REFERENCES cupones(id),
    orden_id INT REFERENCES ordenes(id),
    cliente_firebase_uid VARCHAR(128) NOT NULL,
    descuento_aplicado DECIMAL(10,2) NOT NULL,
    fecha_uso TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. PANEL ADMINISTRATIVO - MÉTRICAS
-- ============================================

CREATE TABLE metricas_ventas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    
    -- Ventas del día
    ordenes_totales INT DEFAULT 0,
    ordenes_completadas INT DEFAULT 0,
    ordenes_canceladas INT DEFAULT 0,
    
    -- Montos
    ingresos_brutos DECIMAL(12,2) DEFAULT 0,
    ingresos_netos DECIMAL(12,2) DEFAULT 0,
    descuentos_aplicados DECIMAL(10,2) DEFAULT 0,
    reembolsos DECIMAL(10,2) DEFAULT 0,
    
    -- Productos
    productos_mas_vendidos JSONB DEFAULT '[]',
    categorias_mas_vendidas JSONB DEFAULT '[]',
    
    -- Clientes
    nuevos_clientes INT DEFAULT 0,
    clientes_recurrentes INT DEFAULT 0,
    
    -- Suscripciones
    nuevas_suscripciones INT DEFAULT 0,
    suscripciones_canceladas INT DEFAULT 0,
    ingresos_suscripciones DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(fecha)
);

CREATE TABLE metricas_contenido (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    
    -- Historias
    historias_publicadas INT DEFAULT 0,
    historias_en_revision INT DEFAULT 0,
    historias_rechazadas INT DEFAULT 0,
    
    -- Engagement
    reproducciones_totales BIGINT DEFAULT 0,
    tiempo_escucha_minutos BIGINT DEFAULT 0,
    historias_favoritas INT DEFAULT 0,
    comentarios_nuevos INT DEFAULT 0,
    
    -- Usuarios
    usuarios_activos INT DEFAULT 0,
    usuarios_premium INT DEFAULT 0,
    nuevos_registros INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(fecha)
);

-- ============================================
-- 7. SISTEMA DE NOTIFICACIONES
-- ============================================

CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    destinatario_uid VARCHAR(128), -- NULL = todos los usuarios
    rol_destinatario VARCHAR(50), -- NULL = usuario específico
    
    -- Contenido
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) CHECK (tipo IN (
        'info', 'success', 'warning', 'error', 'promocion',
        'nuevo_contenido', 'suscripcion', 'pago', 'sistema'
    )) DEFAULT 'info',
    
    -- Acción relacionada
    accion_url VARCHAR(500),
    accion_texto VARCHAR(100),
    
    -- Estado
    leida BOOLEAN DEFAULT FALSE,
    fecha_leida TIMESTAMP WITH TIME ZONE,
    
    -- Programación
    enviar_inmediato BOOLEAN DEFAULT TRUE,
    fecha_programada TIMESTAMP WITH TIME ZONE,
    enviada BOOLEAN DEFAULT FALSE,
    fecha_enviada TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. REVIEWS Y CALIFICACIONES
-- ============================================

CREATE TABLE reviews_productos (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    cliente_firebase_uid VARCHAR(128) NOT NULL,
    orden_id INT REFERENCES ordenes(id), -- Verificar compra real
    
    -- Calificación
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    titulo VARCHAR(255),
    comentario TEXT,
    
    -- Estado
    moderado BOOLEAN DEFAULT FALSE,
    aprobado BOOLEAN DEFAULT FALSE,
    moderado_por VARCHAR(128), -- Firebase UID del moderador
    fecha_moderacion TIMESTAMP WITH TIME ZONE,
    notas_moderacion TEXT,
    
    -- Útil
    votos_util INT DEFAULT 0,
    votos_no_util INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(producto_id, cliente_firebase_uid) -- Un review por cliente por producto
);

-- ============================================
-- DATOS INICIALES PARA ADMIN Y TIENDA
-- ============================================

-- Roles iniciales
INSERT INTO roles (nombre, descripcion, permisos, nivel_acceso) VALUES 
('Super Admin', 'Acceso total al sistema', '["*"]', 5),
('Admin', 'Administrador general', '["manage_content", "manage_users", "manage_store", "view_analytics"]', 4),
('Editor', 'Editor de contenido', '["edit_stories", "publish_stories", "moderate_content"]', 3),
('Moderador', 'Moderador de contenido', '["moderate_content", "manage_comments"]', 2),
('Usuario Premium', 'Usuario con suscripción', '["access_premium"]', 1),
('Usuario', 'Usuario estándar', '["view_content"]', 1);

-- Categorías de productos iniciales
INSERT INTO categorias_productos (nombre, descripcion, slug, orden_display) VALUES 
('Suscripciones', 'Planes de membresía premium', 'suscripciones', 1),
('Contenido Exclusivo', 'Historias y contenido solo para miembros', 'contenido-exclusivo', 2),
('Libros Digitales', 'Compilaciones en formato digital', 'libros-digitales', 3),
('Merchandise', 'Productos físicos y merchandising', 'merchandise', 4),
('Servicios', 'Investigaciones y consultorías personalizadas', 'servicios', 5);

-- Productos iniciales
INSERT INTO productos (
    nombre, descripcion, descripcion_corta, slug, categoria_id, tipo_producto,
    precio_base, precio_usd, es_suscripcion, periodo_suscripcion, dias_trial,
    estado, visible_tienda, meta_titulo, meta_descripcion
) VALUES 
(
    'Archivos Premium Mensual',
    'Acceso completo a todo el contenido premium de Archivos Paranormales. Incluye historias exclusivas, contenido sin anuncios, descargas ilimitadas y acceso anticipado a nuevos episodios.',
    'Acceso premium mensual con contenido exclusivo',
    'premium-mensual',
    1,
    'suscripcion_mensual',
    19900,
    4.99,
    true,
    'monthly',
    7,
    'activo',
    true,
    'Suscripción Premium Mensual | Archivos Paranormales',
    'Accede a todo nuestro contenido premium con esta suscripción mensual. 7 días de prueba gratis.'
),
(
    'Archivos Premium Anual',
    'Suscripción anual con 2 meses gratis. Acceso completo a todo el contenido premium de Archivos Paranormales con un 40% de descuento.',
    'Suscripción anual con descuento especial',
    'premium-anual',
    1,
    'suscripcion_anual',
    199900,
    49.99,
    true,
    'yearly',
    7,
    'activo',
    true,
    'Suscripción Premium Anual | Archivos Paranormales',
    'Ahorra un 40% con nuestra suscripción anual. Incluye 2 meses gratis.'
),
(
    'Colección "Fantasmas de Colombia"',
    'Libro digital exclusivo con las 20 historias más impactantes de apariciones en Colombia, investigadas y verificadas por nuestro equipo.',
    'Libro digital con 20 historias verificadas',
    'fantasmas-colombia-ebook',
    3,
    'libro_digital',
    29900,
    7.99,
    false,
    null,
    0,
    'activo',
    true,
    'Fantasmas de Colombia - Libro Digital | Archivos Paranormales',
    'Las historias más escalofriantes de apariciones en Colombia, verificadas por expertos.'
);

-- Métricas iniciales
INSERT INTO metricas_ventas (fecha) VALUES (CURRENT_DATE);
INSERT INTO metricas_contenido (fecha) VALUES (CURRENT_DATE);

-- ============================================
-- TRIGGERS PARA AUTOMATIZACIÓN
-- ============================================

-- Actualizar métricas cuando se completa una orden
CREATE OR REPLACE FUNCTION actualizar_metricas_ventas()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'completada' AND OLD.estado != 'completada' THEN
        INSERT INTO metricas_ventas (fecha, ordenes_completadas, ingresos_brutos, ingresos_netos)
        VALUES (CURRENT_DATE, 1, NEW.total, NEW.total - NEW.descuentos)
        ON CONFLICT (fecha) 
        DO UPDATE SET 
            ordenes_completadas = metricas_ventas.ordenes_completadas + 1,
            ingresos_brutos = metricas_ventas.ingresos_brutos + NEW.total,
            ingresos_netos = metricas_ventas.ingresos_netos + (NEW.total - NEW.descuentos);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_metricas_ventas
AFTER UPDATE ON ordenes
FOR EACH ROW EXECUTE FUNCTION actualizar_metricas_ventas();

-- Actualizar rating promedio de productos
CREATE OR REPLACE FUNCTION actualizar_rating_producto()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos 
    SET 
        rating_promedio = (
            SELECT AVG(rating) 
            FROM reviews_productos 
            WHERE producto_id = NEW.producto_id AND aprobado = true
        ),
        numero_reviews = (
            SELECT COUNT(*) 
            FROM reviews_productos 
            WHERE producto_id = NEW.producto_id AND aprobado = true
        )
    WHERE id = NEW.producto_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_rating_producto
AFTER INSERT OR UPDATE ON reviews_productos
FOR EACH ROW EXECUTE FUNCTION actualizar_rating_producto();

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_usuarios_roles_firebase_uid ON usuarios_roles(firebase_uid);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_tipo ON productos(tipo_producto);
CREATE INDEX idx_productos_estado ON productos(estado);
CREATE INDEX idx_ordenes_cliente ON ordenes(cliente_firebase_uid);
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_fecha ON ordenes(created_at);
CREATE INDEX idx_suscripciones_cliente ON suscripciones(cliente_firebase_uid);
CREATE INDEX idx_suscripciones_estado ON suscripciones(estado);
CREATE INDEX idx_notificaciones_destinatario ON notificaciones(destinatario_uid);
CREATE INDEX idx_reviews_producto ON reviews_productos(producto_id);

-- ============================================
-- RLS POLICIES PARA SEGURIDAD
-- ============================================

-- Habilitar RLS
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para productos (todos pueden ver productos activos)
CREATE POLICY "Productos públicos" ON productos
    FOR SELECT USING (estado = 'activo' AND visible_tienda = true);

-- Políticas para ordenes (solo el propietario puede ver sus ordenes)
CREATE POLICY "Ordenes propias" ON ordenes
    FOR ALL USING (cliente_firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Políticas para suscripciones (solo el propietario)
CREATE POLICY "Suscripciones propias" ON suscripciones
    FOR ALL USING (cliente_firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- Políticas para notificaciones (solo el destinatario)
CREATE POLICY "Notificaciones propias" ON notificaciones
    FOR SELECT USING (
        destinatario_uid = current_setting('request.jwt.claims', true)::json->>'sub' 
        OR destinatario_uid IS NULL
    );
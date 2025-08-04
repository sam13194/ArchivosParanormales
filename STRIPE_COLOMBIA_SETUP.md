# 🇨🇴 Configuración de Stripe para Colombia - Archivos Paranormales

## 📋 Guía de Configuración Paso a Paso

### 1. 🏦 Crear Cuenta Stripe para Colombia

1. **Ir a [stripe.com](https://stripe.com)** y crear cuenta
2. **Seleccionar Colombia** como país
3. **Completar verificación de identidad:**
   - Cédula de ciudadanía o NIT
   - RUT (si aplica)
   - Información bancaria

### 2. 💳 Configurar Métodos de Pago Colombianos

En el dashboard de Stripe, habilitar:

#### ✅ PSE (Pagos Seguros en Línea)
- Transferencias bancarias directas
- Todos los bancos colombianos
- Confirmación inmediata

#### ✅ Tarjetas Locales
- Visa, Mastercard, American Express
- Tarjetas débito y crédito
- 3D Secure automático

#### ✅ Nequi (Wallet Digital)
- A través de customer_balance
- Configuración especial para Colombia

### 3. 🏛️ Configurar Cuenta Bancaria para Recibir Pagos

```bash
# En tu dashboard de Stripe:
1. Ir a "Settings" > "Bank accounts and scheduling"
2. Agregar cuenta bancaria de Bancolombia:
   - Número de cuenta: [TU_NUMERO_CUENTA]
   - Tipo: Ahorros/Corriente
   - Banco: Bancolombia
   - Titular: ARCHIVOS PARANORMALES SAS
```

### 4. 🔐 Obtener API Keys

```bash
# Dashboard > Developers > API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Para webhooks
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. ⚙️ Configurar Variables de Entorno

Actualizar `.env.local`:

```env
# Stripe Configuration REAL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_key_real
STRIPE_SECRET_KEY=sk_live_tu_key_real
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Información bancaria
BANCOLOMBIA_ACCOUNT_NUMBER=12345678901
BANCOLOMBIA_ACCOUNT_TYPE=ahorros
BANCOLOMBIA_ACCOUNT_HOLDER=ARCHIVOS PARANORMALES SAS
```

### 6. 🎯 Configurar Webhooks

1. **En Stripe Dashboard:**
   - Ir a "Developers" > "Webhooks"
   - Agregar endpoint: `https://tudominio.com/api/webhooks/stripe`

2. **Eventos a escuchar:**
   ```
   checkout.session.completed
   payment_intent.succeeded
   invoice.payment_succeeded
   customer.subscription.created
   customer.subscription.deleted
   ```

### 7. 💰 Tarifas de Stripe Colombia

- **Tarjetas:** 3.4% + $700 COP por transacción
- **PSE:** 1.4% + $700 COP por transacción
- **Transferencias internacionales:** Tarifas adicionales

### 8. 🧪 Testing en Modo Sandbox

```bash
# Test Cards para Colombia
# Visa exitosa: 4242424242424242
# Mastercard exitosa: 5555555555554444
# Visa fallida: 4000000000000002

# Test PSE
# Usar números de prueba según documentación Stripe Colombia
```

## 🚀 Flujo de Pago Implementado

### 1. **Cliente agrega productos al carrito**
```javascript
// useCart hook maneja estado persistente
addToCart(producto)
```

### 2. **Cliente completa información de facturación**
```javascript
// Formulario con datos requeridos en Colombia
{
  nombre: "Juan Pérez",
  documento: "12345678",
  email: "juan@email.com",
  telefono: "300 123 4567",
  direccion: "Calle 123 #45-67",
  ciudad: "Bogotá",
  departamento: "Cundinamarca"
}
```

### 3. **Selección método de pago**
- 🏦 **PSE:** Redirección a banco en línea
- 📱 **Nequi:** Wallet digital
- 💳 **Tarjeta:** Formulario Stripe

### 4. **Procesamiento seguro**
```javascript
// POST /api/checkout/colombia
// - Crea orden en Supabase
// - Genera sesión Stripe
// - Redirecciona a checkout
```

### 5. **Confirmación y entrega**
```javascript
// Webhook procesa pago exitoso
// - Actualiza orden a "completada"
// - Otorga acceso a contenido digital
// - Activa suscripciones
// - Envía email confirmación
```

## 🛡️ Seguridad Implementada

- ✅ **Webhooks firmados** - Verificación criptográfica
- ✅ **3D Secure** - Autenticación adicional tarjetas
- ✅ **Encriptación SSL** - Comunicación segura
- ✅ **Validación servidor** - No confianza en frontend
- ✅ **Row Level Security** - Acceso controlado BD

## 📊 Transferencias a tu Bancolombia

### Automáticas:
- **Diario:** Depósitos automáticos cada día hábil
- **Semanal:** Los viernes (configurable)
- **Manual:** Cuando tu quieras desde dashboard

### Información que recibirás:
```
Transferencia Stripe
Fecha: 27/01/2024
Concepto: Ventas online Archivos Paranormales
Monto: $847,300 COP
Ref: stripe_tr_1234567890
```

## 🎯 Próximos Pasos

1. **Crear cuenta Stripe real** con documentos colombianos
2. **Configurar keys de producción** en variables de entorno
3. **Configurar webhook endpoint** en servidor de producción
4. **Hacer transacción de prueba** con tarjeta real
5. **Verificar depósito** en cuenta Bancolombia

## 📞 Soporte

- **Stripe Colombia:** soporte disponible en español
- **Documentación:** [stripe.com/docs/colombia](https://stripe.com/docs/colombia)
- **Integración completa** ya implementada en el código

¡Tu tienda ya está lista para recibir pagos colombianos de forma segura! 🎉
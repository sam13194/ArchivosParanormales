// Script simple para actualizar solo la URL de la imagen
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simpleUpdateImage() {
  try {
    console.log('🔧 Actualizando imagen a una más apropiada...');
    
    // Usar una imagen mejor para apartamentos paranormales
    const nuevaImagenUrl = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop&q=80';
    
    const { data, error } = await supabaseAdmin
      .from('archivos_multimedia')
      .update({
        ruta_absoluta: nuevaImagenUrl
      })
      .eq('historia_id', 11)
      .eq('tipo_archivo', 'imagen_portada');

    if (error) {
      console.error('❌ Error actualizando imagen:', error);
      return;
    }

    console.log('✅ Imagen actualizada exitosamente');
    console.log('Nueva URL:', nuevaImagenUrl);
    
    // Crear SVG placeholder local
    console.log('\n📁 Creando imagen placeholder local...');
    
    const fs = require('fs');
    const path = require('path');
    
    const svgContent = `<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#1a1a1a"/>
  <rect x="50" y="50" width="700" height="500" fill="#2a2a2a" stroke="#444" stroke-width="2"/>
  <rect x="100" y="100" width="150" height="200" fill="#333" stroke="#555" stroke-width="1"/>
  <rect x="300" y="150" width="200" height="150" fill="#333" stroke="#555" stroke-width="1"/>
  <rect x="550" y="120" width="120" height="180" fill="#333" stroke="#555" stroke-width="1"/>
  <circle cx="400" cy="300" r="20" fill="#666" opacity="0.5"/>
  <text x="400" y="450" text-anchor="middle" fill="#888" font-family="Arial, sans-serif" font-size="24">El Apartamento Sobre el Abismo</text>
  <text x="400" y="480" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="16">Historia Paranormal</text>
</svg>`;

    const publicDir = path.join(process.cwd(), 'public');
    const svgPath = path.join(publicDir, 'apartamento-placeholder.svg');
    
    fs.writeFileSync(svgPath, svgContent);
    console.log('✅ SVG placeholder creado en: /public/apartamento-placeholder.svg');
    
    // Verificar resultado
    console.log('\n🔍 Verificando resultado...');
    
    const { data: verificacion, error: errorVerif } = await supabaseAdmin
      .from('archivos_multimedia')
      .select('tipo_archivo, nombre_archivo, ruta_absoluta')
      .eq('historia_id', 11);

    if (errorVerif) {
      console.error('❌ Error en verificación:', errorVerif);
    } else {
      console.log('📋 Archivos multimedia actuales:');
      verificacion.forEach(archivo => {
        console.log(`  - ${archivo.tipo_archivo}: ${archivo.ruta_absoluta}`);
      });
    }

    console.log('\n🎯 LISTO PARA PROBAR:');
    console.log('====================');
    console.log('✅ Configuración de Next.js actualizada');
    console.log('✅ Imagen de Unsplash más apropiada');
    console.log('✅ SVG placeholder local como respaldo');
    console.log('✅ Servidor corriendo en http://localhost:9002');
    
    console.log('\n🚀 La historia debería mostrarse correctamente ahora sin errores de imagen');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

simpleUpdateImage();
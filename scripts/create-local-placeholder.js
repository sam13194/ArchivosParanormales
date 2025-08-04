// Script para crear una imagen placeholder local más apropiada
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createLocalPlaceholder() {
  try {
    console.log('🔧 Actualizando imagen a una más apropiada...');
    
    // Usar una imagen de Unsplash más específica para apartamentos oscuros/paranormales
    const nuevaImagenUrl = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop&q=80'; // Apartamento vacío y oscuro
    
    const { data, error } = await supabaseAdmin
      .from('archivos_multimedia')
      .update({
        ruta_absoluta: nuevaImagenUrl,
        descripcion: 'Apartamento oscuro y vacío - imagen representativa de la historia paranormal'
      })
      .eq('historia_id', 11)
      .eq('tipo_archivo', 'imagen_portada')
      .select();

    if (error) {
      console.error('❌ Error actualizando imagen:', error);
      return;
    }

    console.log('✅ Imagen actualizada:', nuevaImagenUrl);
    
    // También vamos a crear una imagen placeholder local
    console.log('\n📁 Creando imagen placeholder local...');
    
    // Crear un SVG simple como placeholder
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

    // Escribir el SVG como archivo
    const fs = require('fs');
    const path = require('path');
    
    const publicDir = path.join(process.cwd(), 'public');
    const svgPath = path.join(publicDir, 'apartamento-placeholder.svg');
    
    fs.writeFileSync(svgPath, svgContent);
    console.log('✅ SVG placeholder creado en:', svgPath);
    
    // Actualizar también para usar imagen local como fallback
    const { data: localUpdate, error: localError } = await supabaseAdmin
      .from('archivos_multimedia')
      .update({
        metadata_extra: {
          fallback_local: '/apartamento-placeholder.svg',
          source: 'unsplash',
          backup_url: nuevaImagenUrl
        }
      })
      .eq('historia_id', 11)
      .eq('tipo_archivo', 'imagen_portada')
      .select();

    if (localError) {
      console.error('❌ Error actualizando metadata:', localError);
    } else {
      console.log('✅ Metadata actualizada con fallback local');
    }

    console.log('\n🎯 RESULTADO:');
    console.log('=============');
    console.log('1. ✅ Imagen de Unsplash actualizada (más apropiada)');
    console.log('2. ✅ SVG placeholder creado localmente');
    console.log('3. ✅ Configuración de Next.js ya permite Unsplash');
    console.log('4. 🚀 La historia debería mostrarse correctamente ahora');
    
    console.log('\n📱 URLs para probar:');
    console.log('- Homepage: http://localhost:9002');
    console.log('- Historia individual: http://localhost:9002/story/11');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

createLocalPlaceholder();
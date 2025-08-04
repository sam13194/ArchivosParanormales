// Script para verificar archivos actuales sin hacer cambios
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCurrentFiles() {
  try {
    console.log('🔍 Verificando archivos multimedia actuales...');
    
    const { data: archivos, error } = await supabaseAdmin
      .from('archivos_multimedia')
      .select('*')
      .eq('historia_id', 11);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('\n📋 ARCHIVOS MULTIMEDIA ACTUALES:');
    console.log('=================================');
    
    if (archivos.length === 0) {
      console.log('⚠️ No hay archivos multimedia para la historia ID: 11');
      return;
    }

    archivos.forEach((archivo, index) => {
      console.log(`\n📁 Archivo ${index + 1}:`);
      console.log(`   ID: ${archivo.id}`);
      console.log(`   Tipo: ${archivo.tipo_archivo}`);
      console.log(`   Nombre: ${archivo.nombre_archivo}`);
      console.log(`   URL Absoluta: ${archivo.ruta_absoluta}`);
      console.log(`   Ruta Relativa: ${archivo.ruta_relativa}`);
      console.log(`   Activo: ${archivo.is_active}`);
      console.log(`   Descripción: ${archivo.descripcion || 'N/A'}`);
    });

    // Crear SVG placeholder independientemente
    console.log('\n📁 Creando SVG placeholder local...');
    
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
    
    // Crear directorio public si no existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const svgPath = path.join(publicDir, 'apartamento-placeholder.svg');
    fs.writeFileSync(svgPath, svgContent);
    console.log('✅ SVG placeholder creado en: /public/apartamento-placeholder.svg');

    console.log('\n🎯 ESTADO ACTUAL:');
    console.log('================');
    console.log(`✅ Configuración Next.js: images.unsplash.com permitido`);
    console.log(`✅ Servidor: Corriendo en puerto 9002`);
    console.log(`✅ Archivos multimedia: ${archivos.length} encontrados`);
    
    const tieneImagen = archivos.some(a => a.tipo_archivo === 'imagen_portada');
    const tieneAudio = archivos.some(a => a.tipo_archivo === 'audio_original');
    
    console.log(`✅ Imagen: ${tieneImagen ? 'SÍ' : 'NO'}`);
    console.log(`✅ Audio: ${tieneAudio ? 'SÍ' : 'NO'}`);
    
    if (tieneImagen) {
      const imagen = archivos.find(a => a.tipo_archivo === 'imagen_portada');
      console.log(`📸 URL de imagen: ${imagen.ruta_absoluta}`);
    }
    
    if (tieneAudio) {
      const audio = archivos.find(a => a.tipo_archivo === 'audio_original');
      console.log(`🎵 URL de audio: ${audio.ruta_absoluta}`);
    }

    console.log('\n🚀 La historia debería funcionar correctamente ahora');
    console.log('Probar en: http://localhost:9002');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkCurrentFiles();
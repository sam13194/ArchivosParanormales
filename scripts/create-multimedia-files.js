// Script para crear archivos multimedia para la historia existente
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createMultimediaFiles() {
  try {
    const historiaId = 11;
    
    console.log('🎬 Creando archivos multimedia para historia ID:', historiaId);
    
    // 1. Crear archivo de imagen con URL placeholder
    console.log('\n📸 Creando imagen_portada...');
    const { data: imagen, error: imagenError } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: historiaId,
        tipo_archivo: 'imagen_portada',
        nombre_archivo: 'apartamento-abismo-portada.jpg',
        ruta_absoluta: 'https://images.unsplash.com/photo-1520637836862-4d197d17c735?w=800&h=600&fit=crop', // Imagen placeholder de un apartamento oscuro
        ruta_relativa: 'historias/11/apartamento-abismo-portada.jpg',
        'tamaño_bytes': 150000,
        formato: 'jpg',
        ancho_px: 800,
        alto_px: 600,
        version: 1,
        is_active: true,
        descripcion: 'Imagen representativa del apartamento donde ocurrieron los eventos paranormales'
      }])
      .select();

    if (imagenError) {
      console.error('❌ Error creando imagen:', imagenError);
    } else {
      console.log('✅ Imagen creada:', imagen[0].nombre_archivo);
    }

    // 2. Crear archivo de audio con URL placeholder
    console.log('\n🎵 Creando audio_original...');
    const { data: audio, error: audioError } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: historiaId,
        tipo_archivo: 'audio_original',
        nombre_archivo: 'apartamento-abismo-audio.mp3',
        ruta_absoluta: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Audio placeholder
        ruta_relativa: 'historias/11/apartamento-abismo-audio.mp3',
        'tamaño_bytes': 8500000,
        duracion_segundos: 1200, // 20 minutos
        formato: 'mp3',
        bitrate: '128kbps',
        sample_rate: 44100,
        canales: 2,
        version: 1,
        is_active: true,
        descripcion: 'Audio narrado de la historia del apartamento paranormal'
      }])
      .select();

    if (audioError) {
      console.error('❌ Error creando audio:', audioError);
    } else {
      console.log('✅ Audio creado:', audio[0].nombre_archivo);
    }

    // 3. Verificar resultado final
    console.log('\n🔍 Verificando archivos creados...');
    
    const { data: historiaCompleta, error: verificacionError } = await supabaseAdmin
      .from('historias')
      .select(`
        id,
        titulo_provisional,
        estado_procesamiento,
        ubicaciones(*),
        archivos_multimedia(*),
        testigos(*)
      `)
      .eq('id', historiaId)
      .single();

    if (verificacionError) {
      console.error('❌ Error en verificación:', verificacionError);
      return;
    }

    console.log('\n✅ HISTORIA COMPLETA CON ARCHIVOS:');
    console.log('==================================');
    console.log(`📋 Título: ${historiaCompleta.titulo_provisional}`);
    console.log(`📊 Estado: ${historiaCompleta.estado_procesamiento}`);
    
    if (historiaCompleta.ubicaciones) {
      console.log(`📍 Ubicación: ${historiaCompleta.ubicaciones.nivel2_nombre}, ${historiaCompleta.ubicaciones.nivel1_nombre}`);
    }
    
    console.log(`🎬 Archivos multimedia: ${historiaCompleta.archivos_multimedia?.length || 0}`);
    if (historiaCompleta.archivos_multimedia) {
      historiaCompleta.archivos_multimedia.forEach(archivo => {
        console.log(`   - ${archivo.tipo_archivo}: ${archivo.nombre_archivo}`);
        console.log(`     URL: ${archivo.ruta_absoluta}`);
      });
    }
    
    console.log(`👥 Testigos: ${historiaCompleta.testigos?.length || 0}`);

    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. La historia ya debería mostrarse con imagen en la homepage');
    console.log('2. El audio debería ser reproducible (aunque es un placeholder)');
    console.log('3. La página individual (/story/11) debería funcionar');
    console.log('4. Para tener archivos reales, sube audio e imagen en el panel admin');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

createMultimediaFiles();
// Script para crear archivos multimedia con campos requeridos
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createSimpleFiles() {
  try {
    const historiaId = 11;
    
    console.log('🎬 Creando archivos multimedia con campos requeridos...');
    
    // Imagen con placeholder
    const { data: imagen, error: imagenError } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: historiaId,
        tipo_archivo: 'imagen',
        nombre_archivo: 'apartamento-abismo.jpg',
        ruta_relativa: '/images/apartamento-abismo.jpg',
        ruta_absoluta: '/home/wilmer/ArchivosParanormales/public/images/apartamento-abismo.jpg' // Campo requerido
      }])
      .select('id');

    if (imagenError) {
      console.error('❌ Error creando imagen:', imagenError);
    } else {
      console.log('✅ Imagen creada');
    }

    // Audio con placeholder
    const { data: audio, error: audioError } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: historiaId,
        tipo_archivo: 'audio',
        nombre_archivo: 'apartamento-abismo.mp3',
        ruta_relativa: '/audio/apartamento-abismo.mp3',
        ruta_absoluta: '/home/wilmer/ArchivosParanormales/public/audio/apartamento-abismo.mp3', // Campo requerido
        duracion_segundos: 1200
      }])
      .select('id');

    if (audioError) {
      console.error('❌ Error creando audio:', audioError);
    } else {
      console.log('✅ Audio creado');
    }

    console.log('\n🔍 Verificación final de la historia...');
    
    // Test completo de la API
    const response = await fetch('http://localhost:3000/api/stories/11', {
      method: 'GET'
    }).catch(err => {
      console.log('ℹ️ Servidor no disponible, mostrando solo datos de BD');
      return null;
    });

    // Verificación directa en BD
    const { data: historiaCompleta, error: verificacionError } = await supabaseAdmin
      .from('historias')
      .select(`
        id,
        titulo_provisional,
        estado_procesamiento,
        ponderacion_impacto,
        credibilidad_score,
        genero_principal,
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

    console.log('\n✅ HISTORIA COMPLETA:');
    console.log('===================');
    console.log(`📋 Título: ${historiaCompleta.titulo_provisional}`);
    console.log(`📊 Estado: ${historiaCompleta.estado_procesamiento}`);
    console.log(`⭐ Impacto: ${historiaCompleta.ponderacion_impacto}/5`);
    console.log(`🛡️ Credibilidad: ${historiaCompleta.credibilidad_score}/5`);
    console.log(`🏷️ Género: ${historiaCompleta.genero_principal}`);
    
    if (historiaCompleta.ubicaciones) {
      console.log(`📍 Ubicación: ${historiaCompleta.ubicaciones.nivel2_nombre}, ${historiaCompleta.ubicaciones.nivel1_nombre}`);
    }
    
    console.log(`🎬 Archivos multimedia: ${historiaCompleta.archivos_multimedia?.length || 0}`);
    if (historiaCompleta.archivos_multimedia) {
      historiaCompleta.archivos_multimedia.forEach(archivo => {
        console.log(`   - ${archivo.tipo_archivo}: ${archivo.nombre_archivo}`);
      });
    }
    
    console.log(`👥 Testigos: ${historiaCompleta.testigos?.length || 0}`);
    if (historiaCompleta.testigos) {
      historiaCompleta.testigos.forEach(testigo => {
        console.log(`   - ${testigo.tipo_testigo}: ${testigo.pseudonimo}`);
      });
    }

    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Reiniciar el servidor de desarrollo (npm run dev)');
    console.log('2. Verificar que la historia aparece en la homepage');
    console.log('3. Hacer clic en la historia para ver la página individual');
    console.log('4. Crear archivos de imagen y audio reales si es necesario');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

createSimpleFiles();
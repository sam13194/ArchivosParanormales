// Script para probar todos los tipos de archivo válidos
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testValidTipos() {
  try {
    console.log('🔍 Probando tipos de archivo válidos para archivos_multimedia...');
    
    const tiposPrueba = [
      'audio_original', 'imagen_portada', 'video_original',
      'audio', 'imagen', 'video',
      'audio_editado', 'imagen_secundaria', 'documento',
      'thumbnail', 'cover', 'banner'
    ];

    const tiposValidos = [];
    
    for (const tipo of tiposPrueba) {
      try {
        const { data, error } = await supabaseAdmin
          .from('archivos_multimedia')
          .insert([{
            historia_id: 11,
            tipo_archivo: tipo,
            nombre_archivo: `test-${tipo}.mp3`,
            ruta_absoluta: `https://test.com/test-${tipo}.mp3`,
            ruta_relativa: `/test/test-${tipo}.mp3`
          }])
          .select('id, tipo_archivo');
          
        if (!error) {
          console.log(`✅ Tipo válido: "${tipo}"`);
          tiposValidos.push(tipo);
          
          // Limpiar inmediatamente
          await supabaseAdmin
            .from('archivos_multimedia')
            .delete()
            .eq('id', data[0].id);
        } else if (error.message.includes('archivos_multimedia_tipo_archivo_check')) {
          console.log(`❌ Tipo inválido: "${tipo}"`);
        } else {
          console.log(`⚠️ Error diferente con "${tipo}":`, error.message.substring(0, 100));
          break; // Si hay otro error, parar
        }
      } catch (err) {
        console.log(`💥 Error inesperado con "${tipo}":`, err.message);
        break;
      }
    }
    
    console.log('\n📋 RESUMEN DE TIPOS VÁLIDOS:');
    console.log('=============================');
    tiposValidos.forEach(tipo => {
      console.log(`✅ ${tipo}`);
    });
    
    console.log('\n🎯 RECOMENDACIONES PARA EL CÓDIGO:');
    console.log('- Para audio: usar "audio_original"');
    console.log('- Para imagen: usar "imagen_portada"');
    if (tiposValidos.includes('video_original')) {
      console.log('- Para video: usar "video_original"');
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

testValidTipos();
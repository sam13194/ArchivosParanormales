// Script para verificar la estructura exacta de archivos_multimedia
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkArchivosStructure() {
  try {
    console.log('🔍 Verificando estructura de archivos_multimedia...');
    
    // Método 1: Intentar insertar un registro mínimo para ver qué campos requiere
    const { data: testInsert, error: testError } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: 11,
        tipo_archivo: 'test',
        nombre_archivo: 'test.mp3'
      }])
      .select();

    if (testError) {
      console.log('❌ Error en test insert (esto nos ayuda a ver la estructura):');
      console.log('Código:', testError.code);
      console.log('Mensaje:', testError.message);
      console.log('Detalles:', testError.details);
      
      // Parsear el mensaje de error para obtener nombres de columnas
      if (testError.details && testError.details.includes('Failing row contains')) {
        console.log('\n📋 Estructura inferida del error:');
        console.log('La tabla existe pero tiene campos requeridos que no estamos proporcionando');
      }
    } else {
      console.log('✅ Test insert exitoso:', testInsert);
      
      // Limpiar el registro de prueba
      if (testInsert && testInsert[0]) {
        await supabaseAdmin
          .from('archivos_multimedia')
          .delete()
          .eq('id', testInsert[0].id);
        console.log('🧹 Registro de prueba eliminado');
      }
    }

    // Método 2: Intentar con los campos que sabemos del error anterior
    console.log('\n🔧 Intentando insertar con ruta_absoluta (campo requerido detectado)...');
    
    const { data: testInsert2, error: testError2 } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: 11,
        tipo_archivo: 'audio',
        nombre_archivo: 'test-audio.mp3',
        ruta_absoluta: '/test/path/test-audio.mp3',
        ruta_relativa: '/test/test-audio.mp3'
      }])
      .select();

    if (testError2) {
      console.log('❌ Error en test insert 2:');
      console.log('Código:', testError2.code);
      console.log('Mensaje:', testError2.message);
      
      // Si es un constraint de tipo_archivo, nos dará los valores válidos
      if (testError2.message.includes('archivos_multimedia_tipo_archivo_check')) {
        console.log('\n🏷️ El campo tipo_archivo tiene un constraint de valores válidos');
        console.log('Probemos con valores comunes...');
        
        const tiposComunes = ['imagen', 'audio_original', 'imagen_portada', 'video'];
        
        for (const tipo of tiposComunes) {
          const { data: testTipo, error: errorTipo } = await supabaseAdmin
            .from('archivos_multimedia')
            .insert([{
              historia_id: 11,
              tipo_archivo: tipo,
              nombre_archivo: `test-${tipo}.mp3`,
              ruta_absoluta: `/test/path/test-${tipo}.mp3`,
              ruta_relativa: `/test/test-${tipo}.mp3`
            }])
            .select();
            
          if (!errorTipo) {
            console.log(`✅ Tipo válido encontrado: "${tipo}"`);
            
            // Ver la estructura completa del registro creado
            console.log('📋 Estructura completa:', Object.keys(testTipo[0]));
            console.log('🔍 Datos del registro:', testTipo[0]);
            
            // Limpiar
            await supabaseAdmin
              .from('archivos_multimedia')
              .delete()
              .eq('id', testTipo[0].id);
              
            break;
          } else if (!errorTipo.message.includes('archivos_multimedia_tipo_archivo_check')) {
            console.log(`❌ Error diferente con tipo "${tipo}":`, errorTipo.message);
            break;
          }
        }
      }
    } else {
      console.log('✅ Test insert 2 exitoso:', testInsert2);
      console.log('📋 Campos disponibles:', Object.keys(testInsert2[0]));
      console.log('🔍 Estructura completa:', testInsert2[0]);
      
      // Limpiar
      if (testInsert2 && testInsert2[0]) {
        await supabaseAdmin
          .from('archivos_multimedia')
          .delete()
          .eq('id', testInsert2[0].id);
      }
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkArchivosStructure();
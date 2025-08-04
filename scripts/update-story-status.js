// Script temporal para actualizar el estado de la historia a 'publicada'
// Para ejecutar: node scripts/update-story-status.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateStoryStatus() {
  try {
    console.log('🔍 Buscando historias en la base de datos...');
    
    // Primero ver qué historias tenemos
    const { data: historias, error: listError } = await supabaseAdmin
      .from('historias')
      .select('id, titulo_provisional, estado_procesamiento, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (listError) {
      console.error('❌ Error al obtener historias:', listError);
      return;
    }

    console.log('📋 Historias encontradas:');
    console.table(historias);

    if (historias.length === 0) {
      console.log('ℹ️ No se encontraron historias en la base de datos.');
      return;
    }

    // Actualizar todas las historias a estado 'publicada'
    console.log('\n🔄 Actualizando estado de historias a "publicada"...');
    
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('historias')
      .update({ estado_procesamiento: 'publicada' })
      .neq('estado_procesamiento', 'publicada')
      .select('id, titulo_provisional, estado_procesamiento');

    if (updateError) {
      console.error('❌ Error al actualizar historias:', updateError);
      return;
    }

    if (updated && updated.length > 0) {
      console.log('✅ Historias actualizadas:');
      console.table(updated);
    } else {
      console.log('ℹ️ No había historias para actualizar (todas ya están publicadas).');
    }

    // Verificar archivos multimedia
    console.log('\n🎬 Verificando archivos multimedia...');
    
    const { data: archivos, error: archivosError } = await supabaseAdmin
      .from('archivos_multimedia')
      .select('historia_id, tipo_archivo, url_cloudinary, nombre_archivo')
      .order('historia_id');

    if (archivosError) {
      console.error('❌ Error al obtener archivos:', archivosError);
      return;
    }

    if (archivos.length > 0) {
      console.log('📁 Archivos multimedia encontrados:');
      console.table(archivos);
    } else {
      console.log('⚠️ No se encontraron archivos multimedia.');
    }

    // Verificar ubicaciones
    console.log('\n📍 Verificando ubicaciones...');
    
    const { data: ubicaciones, error: ubicacionesError } = await supabaseAdmin
      .from('ubicaciones')
      .select('id, nivel1_nombre, nivel2_nombre')
      .limit(5);

    if (ubicacionesError) {
      console.error('❌ Error al obtener ubicaciones:', ubicacionesError);
    } else if (ubicaciones.length > 0) {
      console.log('🌍 Ubicaciones encontradas:');
      console.table(ubicaciones);
    } else {
      console.log('⚠️ No se encontraron ubicaciones.');
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

updateStoryStatus();
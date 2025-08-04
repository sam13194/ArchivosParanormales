// Script para debuggear la historia actual (ID: 11)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugCurrentStory() {
  try {
    console.log('🔍 Debuggeando historia actual (ID: 11)...');
    
    // 1. Obtener datos como lo hace la API /api/stories/11
    const { data: historia, error: historiaError } = await supabaseAdmin
      .from('historias')
      .select(`
        *,
        ubicaciones(*),
        archivos_multimedia(*),
        testigos(*)
      `)
      .eq('id', 11)
      .single();

    if (historiaError) {
      console.error('❌ Error obteniendo historia:', historiaError);
      return;
    }

    console.log('\n📋 DATOS DE LA HISTORIA:');
    console.log('========================');
    console.log(`ID: ${historia.id}`);
    console.log(`Título: ${historia.titulo_provisional}`);
    console.log(`Estado: ${historia.estado_procesamiento}`);
    console.log(`Archivos multimedia: ${historia.archivos_multimedia?.length || 0}`);

    if (historia.archivos_multimedia && historia.archivos_multimedia.length > 0) {
      console.log('\n🎬 ARCHIVOS MULTIMEDIA ENCONTRADOS:');
      historia.archivos_multimedia.forEach((archivo, index) => {
        console.log(`\n📁 Archivo ${index + 1}:`);
        console.log(`   ID: ${archivo.id}`);
        console.log(`   Tipo: ${archivo.tipo_archivo}`);
        console.log(`   Nombre: ${archivo.nombre_archivo}`);
        console.log(`   Ruta absoluta: ${archivo.ruta_absoluta}`);
        console.log(`   Ruta relativa: ${archivo.ruta_relativa}`);
        console.log(`   Activo: ${archivo.is_active}`);
        console.log(`   Descripción: ${archivo.descripcion}`);
      });

      // Probar adaptación exacta del frontend
      console.log('\n🔄 PROBANDO ADAPTACIÓN DEL FRONTEND:');
      console.log('=====================================');
      
      const audioFile = historia.archivos_multimedia.find(a => a.tipo_archivo === 'audio_original');
      const imageFile = historia.archivos_multimedia.find(a => a.tipo_archivo === 'imagen_portada');
      
      console.log('🔍 Búsqueda de archivos:');
      console.log(`   - Buscando tipo "audio_original": ${audioFile ? 'ENCONTRADO' : 'NO ENCONTRADO'}`);
      console.log(`   - Buscando tipo "imagen_portada": ${imageFile ? 'ENCONTRADO' : 'NO ENCONTRADO'}`);
      
      if (audioFile) {
        console.log(`🎵 Audio encontrado:`);
        console.log(`   - URL: ${audioFile.ruta_absoluta}`);
        console.log(`   - Válida: ${audioFile.ruta_absoluta ? 'SÍ' : 'NO'}`);
      }
      
      if (imageFile) {
        console.log(`📸 Imagen encontrada:`);
        console.log(`   - URL: ${imageFile.ruta_absoluta}`);
        console.log(`   - Válida: ${imageFile.ruta_absoluta ? 'SÍ' : 'NO'}`);
      }

      // Simular la función adaptDatabaseStory
      const adaptedStory = {
        id: historia.id,
        title: historia.titulo_provisional,
        imageUrl: imageFile?.ruta_absoluta || '/placeholder-story.jpg',
        audioUrl: audioFile?.ruta_absoluta || '',
        // ... otros campos
      };

      console.log('\n📊 RESULTADO DE ADAPTACIÓN:');
      console.log(`   - imageUrl: ${adaptedStory.imageUrl}`);
      console.log(`   - audioUrl: ${adaptedStory.audioUrl}`);
      console.log(`   - Imagen válida: ${adaptedStory.imageUrl !== '/placeholder-story.jpg'}`);
      console.log(`   - Audio válido: ${adaptedStory.audioUrl !== ''}`);

    } else {
      console.log('\n⚠️ NO HAY ARCHIVOS MULTIMEDIA');
      console.log('La historia no tiene archivos multimedia vinculados');
    }

    // 2. Probar la API directamente
    console.log('\n🌐 PROBANDO API /api/stories/11:');
    console.log('================================');
    
    try {
      const apiResponse = await fetch('http://localhost:9002/api/stories/11');
      const apiData = await apiResponse.json();
      
      if (apiResponse.ok) {
        console.log('✅ API responde correctamente');
        console.log(`📋 Archivos en respuesta API: ${apiData.story.archivos_multimedia?.length || 0}`);
        
        if (apiData.story.archivos_multimedia) {
          apiData.story.archivos_multimedia.forEach((archivo, index) => {
            console.log(`   ${index + 1}. ${archivo.tipo_archivo}: ${archivo.ruta_absoluta}`);
          });
        }
      } else {
        console.error('❌ Error en API:', apiData);
      }
    } catch (fetchError) {
      console.error('❌ Error llamando API:', fetchError.message);
    }

    // 3. Verificar que las URLs de archivos son accesibles
    console.log('\n🔗 VERIFICANDO ACCESIBILIDAD DE URLs:');
    console.log('====================================');
    
    if (historia.archivos_multimedia) {
      for (const archivo of historia.archivos_multimedia) {
        console.log(`\n🌐 Probando: ${archivo.ruta_absoluta}`);
        try {
          const response = await fetch(archivo.ruta_absoluta, { method: 'HEAD' });
          console.log(`   Status: ${response.status} (${response.ok ? 'OK' : 'ERROR'})`);
          console.log(`   Content-Type: ${response.headers.get('content-type') || 'N/A'}`);
        } catch (urlError) {
          console.log(`   ❌ Error de conexión: ${urlError.message}`);
        }
      }
    }

    console.log('\n🎯 DIAGNÓSTICO:');
    console.log('===============');
    
    const hasFiles = historia.archivos_multimedia && historia.archivos_multimedia.length > 0;
    const hasImage = historia.archivos_multimedia?.some(a => a.tipo_archivo === 'imagen_portada');
    const hasAudio = historia.archivos_multimedia?.some(a => a.tipo_archivo === 'audio_original');
    
    console.log(`✅ Historia existe: SÍ`);
    console.log(`✅ Historia publicada: ${historia.estado_procesamiento === 'publicada' ? 'SÍ' : 'NO'}`);
    console.log(`${hasFiles ? '✅' : '❌'} Tiene archivos multimedia: ${hasFiles ? 'SÍ' : 'NO'}`);
    console.log(`${hasImage ? '✅' : '❌'} Tiene imagen: ${hasImage ? 'SÍ' : 'NO'}`);
    console.log(`${hasAudio ? '✅' : '❌'} Tiene audio: ${hasAudio ? 'SÍ' : 'NO'}`);

    if (!hasFiles) {
      console.log('\n🚨 PROBLEMA IDENTIFICADO:');
      console.log('La historia NO tiene archivos multimedia vinculados');
      console.log('Necesitas subir la historia nuevamente desde el panel admin');
    } else if (!hasImage || !hasAudio) {
      console.log('\n⚠️ PROBLEMA PARCIAL:');
      console.log('La historia tiene algunos archivos pero no todos los tipos necesarios');
    } else {
      console.log('\n🎉 TODO CORRECTO:');
      console.log('La historia tiene todos los archivos necesarios');
      console.log('El problema puede estar en el frontend o en la configuración de Next.js');
    }

  } catch (error) {
    console.error('💥 Error en debug:', error);
  }
}

debugCurrentStory();
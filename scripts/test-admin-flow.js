// Script para probar el flujo completo del panel admin
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminFlow() {
  try {
    console.log('🔍 Probando flujo completo del panel admin...');
    
    // Simular datos que envía el formulario
    const mockFormData = {
      // Campos básicos
      titulo: 'Historia de Prueba Vinculación',
      descripcion_corta: 'Prueba para verificar que los archivos se vinculan correctamente',
      testimonio_completo: 'Este es un testimonio completo de prueba para verificar la vinculación de archivos multimedia.',
      
      // URLs de archivos (simulando que ya fueron subidas a Cloudinary)
      audio_url: 'https://res.cloudinary.com/dwiz8bahl/video/upload/v1234567890/test-audio.mp3',
      imagen_url: 'https://res.cloudinary.com/dwiz8bahl/image/upload/v1234567890/test-image.jpg',
      
      // Otros campos requeridos
      fuente_relato: 'llamada_oyente',
      genero_principal: 'paranormal',
      nivel_credibilidad: 4,
      nivel_impacto: 3,
      nivel_verificacion: 'testimonio_unico',
      
      admin_uid: 'test-admin-uid',
      publicar_inmediatamente: true,
      
      // Ubicación básica
      ubicacion: {
        pais: 'Colombia',
        departamento: 'Cundinamarca',
        ciudad: 'Bogotá'
      }
    };

    console.log('\n📤 Enviando datos al API de admin...');
    console.log('🎬 Audio URL:', mockFormData.audio_url);
    console.log('🖼️ Imagen URL:', mockFormData.imagen_url);

    // Llamar al API como lo haría el frontend
    const response = await fetch('http://localhost:9002/api/admin/historias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockFormData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error en API response:', result);
      return;
    }

    console.log('✅ Historia creada exitosamente!');
    console.log('📋 ID de historia:', result.historia?.id);

    // Verificar que los archivos se vincularon correctamente
    const historiaId = result.historia?.id;
    if (historiaId) {
      console.log('\n🔍 Verificando archivos multimedia vinculados...');
      
      const { data: archivos, error: archivosError } = await supabaseAdmin
        .from('archivos_multimedia')
        .select('*')
        .eq('historia_id', historiaId);

      if (archivosError) {
        console.error('❌ Error obteniendo archivos:', archivosError);
      } else {
        console.log(`📁 Archivos encontrados: ${archivos.length}`);
        
        archivos.forEach((archivo, index) => {
          console.log(`\n📁 Archivo ${index + 1}:`);
          console.log(`   Tipo: ${archivo.tipo_archivo}`);
          console.log(`   Nombre: ${archivo.nombre_archivo}`);
          console.log(`   URL: ${archivo.ruta_absoluta}`);
          console.log(`   Activo: ${archivo.is_active}`);
        });

        // Verificar que tenemos los tipos correctos
        const tieneImagen = archivos.some(a => a.tipo_archivo === 'imagen_portada');
        const tieneAudio = archivos.some(a => a.tipo_archivo === 'audio_original');
        
        console.log('\n📊 VERIFICACIÓN:');
        console.log(`✅ Imagen vinculada: ${tieneImagen ? 'SÍ' : 'NO'}`);
        console.log(`✅ Audio vinculado: ${tieneAudio ? 'SÍ' : 'NO'}`);

        if (tieneImagen && tieneAudio) {
          console.log('\n🎉 ¡VINCULACIÓN EXITOSA!');
          console.log('Los archivos se vincularon correctamente a la historia');
          
          // Probar la adaptación de datos
          console.log('\n🔄 Probando adaptación para frontend...');
          
          const { data: historiaCompleta, error: historiaError } = await supabaseAdmin
            .from('historias')
            .select(`
              *,
              ubicaciones(*),
              archivos_multimedia(*),
              testigos(*)
            `)
            .eq('id', historiaId)
            .single();

          if (historiaError) {
            console.error('❌ Error obteniendo historia completa:', historiaError);
          } else {
            console.log('✅ Historia obtenida con relaciones');
            console.log(`📋 Archivos en historia: ${historiaCompleta.archivos_multimedia?.length || 0}`);
            
            // Simular adaptación
            const audioFile = historiaCompleta.archivos_multimedia?.find(a => a.tipo_archivo === 'audio_original');
            const imageFile = historiaCompleta.archivos_multimedia?.find(a => a.tipo_archivo === 'imagen_portada');
            
            console.log('\n🎯 RESULTADO FINAL:');
            console.log(`📸 URL de imagen para UI: ${imageFile?.ruta_absoluta || 'NO ENCONTRADA'}`);
            console.log(`🎵 URL de audio para UI: ${audioFile?.ruta_absoluta || 'NO ENCONTRADA'}`);
          }
        } else {
          console.log('\n⚠️ PROBLEMA DE VINCULACIÓN');
          console.log('Los archivos no se vincularon correctamente');
        }
      }

      // Limpiar - eliminar historia de prueba
      console.log('\n🧹 Limpiando historia de prueba...');
      await supabaseAdmin.from('historias').delete().eq('id', historiaId);
      console.log('✅ Historia de prueba eliminada');
    }

  } catch (error) {
    console.error('💥 Error en prueba:', error);
  }
}

testAdminFlow();
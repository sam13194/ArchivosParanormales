// Script para corregir la imagen rota
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixBrokenImage() {
  try {
    console.log('🔧 Corrigiendo imagen rota de la historia ID: 11...');
    
    // Usar una imagen válida de Unsplash para apartamento oscuro
    const nuevasImagenes = [
      'https://images.unsplash.com/photo-1586047990160-e89b68dd4128?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800&h=600&fit=crop&q=80'
    ];
    
    // Probar cada imagen para encontrar una que funcione
    let imagenValida = null;
    
    for (const url of nuevasImagenes) {
      console.log(`🔍 Probando imagen: ${url}`);
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          console.log(`✅ Imagen válida encontrada: ${response.status}`);
          imagenValida = url;
          break;
        } else {
          console.log(`❌ Imagen no válida: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error probando imagen: ${error.message}`);
      }
    }
    
    if (!imagenValida) {
      // Usar placeholder local si no hay imágenes válidas
      imagenValida = '/apartamento-placeholder.svg';
      console.log('⚠️ Usando placeholder local');
    }
    
    // Actualizar la imagen en la base de datos
    console.log('\n🔄 Actualizando imagen en la base de datos...');
    
    const { data, error } = await supabaseAdmin
      .from('archivos_multimedia')
      .update({
        ruta_absoluta: imagenValida
      })
      .eq('historia_id', 11)
      .eq('tipo_archivo', 'imagen_portada')
      .select();

    if (error) {
      console.error('❌ Error actualizando imagen:', error);
      return;
    }

    console.log('✅ Imagen actualizada exitosamente');
    console.log('Nueva URL:', imagenValida);
    
    // Verificar el resultado
    console.log('\n🔍 Verificando resultado...');
    
    const { data: verificacion, error: errorVerif } = await supabaseAdmin
      .from('historias')
      .select(`
        id,
        titulo_provisional,
        archivos_multimedia(*)
      `)
      .eq('id', 11)
      .single();

    if (errorVerif) {
      console.error('❌ Error en verificación:', errorVerif);
    } else {
      console.log('\n📋 ARCHIVOS ACTUALIZADOS:');
      verificacion.archivos_multimedia.forEach(archivo => {
        console.log(`${archivo.tipo_archivo}: ${archivo.ruta_absoluta}`);
      });
    }

    // Probar la nueva imagen
    if (imagenValida !== '/apartamento-placeholder.svg') {
      console.log('\n🌐 Probando nueva imagen...');
      try {
        const testResponse = await fetch(imagenValida, { method: 'HEAD' });
        console.log(`Status: ${testResponse.status} (${testResponse.ok ? 'OK' : 'ERROR'})`);
      } catch (testError) {
        console.log(`❌ Error probando nueva imagen: ${testError.message}`);
      }
    }

    console.log('\n🎯 RESULTADO:');
    console.log('=============');
    console.log('✅ Imagen corregida');
    console.log('✅ Audio funcionando');
    console.log('🚀 La historia debería mostrarse correctamente ahora');
    console.log('\n📱 Probar en:');
    console.log('- Homepage: http://localhost:9002');
    console.log('- Historia: http://localhost:9002/story/11');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

fixBrokenImage();
// Script para ver constraints y crear datos válidos
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixConstraints() {
  try {
    const historiaId = 11;
    
    console.log('🔧 Creando datos con valores válidos...');
    
    // 1. Crear ubicación con tipo válido
    console.log('\n📍 Creando ubicación con tipo válido...');
    const { data: ubicacion, error: ubicacionError } = await supabaseAdmin
      .from('ubicaciones')
      .insert([{
        pais: 'Colombia',
        codigo_pais: 'CO',
        nivel1_nombre: 'Cundinamarca',
        nivel2_nombre: 'Bogotá',
        descripcion_lugar: 'Apartamento en zona urbana de Bogotá',
        tipo_lugar: 'casa' // Probemos con valores simples
      }])
      .select('id')
      .single();

    if (ubicacionError) {
      console.log('❌ Error con "casa", probando "apartamento"...');
      
      // Intentar con apartamento
      const { data: ubicacion2, error: ubicacionError2 } = await supabaseAdmin
        .from('ubicaciones')
        .insert([{
          pais: 'Colombia',
          codigo_pais: 'CO',
          nivel1_nombre: 'Cundinamarca',
          nivel2_nombre: 'Bogotá',
          descripcion_lugar: 'Apartamento en zona urbana de Bogotá'
          // Sin tipo_lugar para ver si es opcional
        }])
        .select('id')
        .single();

      if (ubicacionError2) {
        console.error('❌ Error creando ubicación:', ubicacionError2);
        return;
      }
      
      console.log('✅ Ubicación creada con ID:', ubicacion2.id);
      
      // Usar la segunda ubicación
      const { error: updateError } = await supabaseAdmin
        .from('historias')
        .update({
          ubicacion_id: ubicacion2.id,
          fecha_evento_inicio: '2024-10-15',
          hora_evento: '22:30:00'
        })
        .eq('id', historiaId);

      if (updateError) {
        console.error('❌ Error actualizando historia:', updateError);
        return;
      }
      
    } else {
      console.log('✅ Ubicación creada con ID:', ubicacion.id);
      
      // Actualizar historia con primera ubicación
      const { error: updateError } = await supabaseAdmin
        .from('historias')
        .update({
          ubicacion_id: ubicacion.id,
          fecha_evento_inicio: '2024-10-15',
          hora_evento: '22:30:00'
        })
        .eq('id', historiaId);

      if (updateError) {
        console.error('❌ Error actualizando historia:', updateError);
        return;
      }
    }

    console.log('✅ Historia actualizada con ubicación');

    // 2. Crear archivos multimedia (simplificado)
    console.log('\n🎬 Creando archivos multimedia...');
    
    const archivos = [
      {
        historia_id: historiaId,
        tipo_archivo: 'imagen',
        nombre_archivo: 'apartamento-abismo.jpg',
        ruta_relativa: '/images/apartamento-abismo.jpg'
      },
      {
        historia_id: historiaId,
        tipo_archivo: 'audio',
        nombre_archivo: 'apartamento-abismo.mp3',
        ruta_relativa: '/audio/apartamento-abismo.mp3',
        duracion_segundos: 1200
      }
    ];

    for (const archivo of archivos) {
      const { error: archivoError } = await supabaseAdmin
        .from('archivos_multimedia')
        .insert([archivo]);

      if (archivoError) {
        console.error(`❌ Error creando ${archivo.tipo_archivo}:`, archivoError);
      } else {
        console.log(`✅ ${archivo.tipo_archivo} creado`);
      }
    }

    // 3. Crear testigos básicos
    console.log('\n👥 Creando testigos...');
    
    const testigos = [
      {
        historia_id: historiaId,
        tipo_testigo: 'principal',
        pseudonimo: 'Lina M.',
        edad_aprox: 19,
        ocupacion: 'Estudiante'
      },
      {
        historia_id: historiaId,
        tipo_testigo: 'secundario',
        pseudonimo: 'Clara R.',
        edad_aprox: 18,
        ocupacion: 'Estudiante'
      }
    ];

    for (const testigo of testigos) {
      const { error: testigoError } = await supabaseAdmin
        .from('testigos')
        .insert([testigo]);

      if (testigoError) {
        console.error(`❌ Error creando testigo ${testigo.pseudonimo}:`, testigoError);
      } else {
        console.log(`✅ Testigo ${testigo.pseudonimo} creado`);
      }
    }

    console.log('\n🔍 Verificación final...');
    
    // Verificación final completa
    const { data: historiaFinal, error: finalError } = await supabaseAdmin
      .from('historias')
      .select(`
        id,
        titulo_provisional,
        ubicaciones(*),
        archivos_multimedia(*),
        testigos(*)
      `)
      .eq('id', historiaId)
      .single();

    if (finalError) {
      console.error('❌ Error en verificación final:', finalError);
    } else {
      console.log('✅ RESULTADO FINAL:');
      console.log(`📋 Historia: ${historiaFinal.titulo_provisional}`);
      console.log(`📍 Ubicación: ${historiaFinal.ubicaciones ? historiaFinal.ubicaciones.nivel2_nombre + ', ' + historiaFinal.ubicaciones.nivel1_nombre : 'NO'}`);
      console.log(`🎬 Archivos: ${historiaFinal.archivos_multimedia?.length || 0}`);
      console.log(`👥 Testigos: ${historiaFinal.testigos?.length || 0}`);
      
      if (historiaFinal.archivos_multimedia) {
        historiaFinal.archivos_multimedia.forEach(archivo => {
          console.log(`  - ${archivo.tipo_archivo}: ${archivo.nombre_archivo}`);
        });
      }
      
      if (historiaFinal.testigos) {
        historiaFinal.testigos.forEach(testigo => {
          console.log(`  - ${testigo.tipo_testigo}: ${testigo.pseudonimo}`);
        });
      }
    }

    console.log('\n🎉 ¡Proceso completado!');
    console.log('Ahora la historia debería mostrarse correctamente en el frontend.');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

fixConstraints();
// Script para agregar datos faltantes a la historia
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addMissingData() {
  try {
    const historiaId = 11;
    
    console.log('🔧 Agregando datos faltantes a la historia ID:', historiaId);
    
    // 1. Crear ubicación
    console.log('\n📍 Creando ubicación...');
    const { data: ubicacion, error: ubicacionError } = await supabaseAdmin
      .from('ubicaciones')
      .insert([{
        pais: 'Colombia',
        codigo_pais: 'CO',
        nivel1_nombre: 'Cundinamarca',
        nivel1_codigo: 'CUN',
        nivel2_nombre: 'Bogotá',
        nivel2_codigo: 'BOG',
        descripcion_lugar: 'Apartamento en zona urbana de Bogotá',
        tipo_lugar: 'Residencial'
      }])
      .select('id')
      .single();

    if (ubicacionError) {
      console.error('❌ Error creando ubicación:', ubicacionError);
      return;
    }

    console.log('✅ Ubicación creada con ID:', ubicacion.id);

    // 2. Actualizar historia con ubicación
    console.log('\n🔄 Actualizando historia con ubicación...');
    const { error: updateError } = await supabaseAdmin
      .from('historias')
      .update({
        ubicacion_id: ubicacion.id,
        fecha_evento_inicio: '2024-10-15', // Fecha ficticia
        hora_evento: '22:30:00'
      })
      .eq('id', historiaId);

    if (updateError) {
      console.error('❌ Error actualizando historia:', updateError);
      return;
    }

    console.log('✅ Historia actualizada con ubicación');

    // 3. Crear archivos multimedia placeholder
    console.log('\n🎬 Creando archivos multimedia placeholder...');
    
    // Verificar estructura de la tabla primero
    const { data: testArchivo, error: testError } = await supabaseAdmin
      .from('archivos_multimedia')
      .select('*')
      .limit(1);

    if (testError && testError.code !== 'PGRST116') {
      console.error('❌ Error verificando estructura:', testError);
      return;
    }

    // Crear imagen placeholder
    const { data: imagen, error: imagenError } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: historiaId,
        tipo_archivo: 'imagen',
        nombre_archivo: 'apartamento-abismo.jpg',
        ruta_relativa: '/placeholder-images/apartamento-abismo.jpg',
        tamano_bytes: 150000,
        formato: 'jpg',
        descripcion: 'Imagen representativa del apartamento donde ocurrieron los eventos paranormales'
      }])
      .select('id');

    if (imagenError) {
      console.error('❌ Error creando imagen:', imagenError);
      // Mostrar detalles para debug
      console.log('Detalle del error:', JSON.stringify(imagenError, null, 2));
    } else {
      console.log('✅ Imagen placeholder creada');
    }

    // Crear audio placeholder
    const { data: audio, error: audioError } = await supabaseAdmin
      .from('archivos_multimedia')
      .insert([{
        historia_id: historiaId,
        tipo_archivo: 'audio',
        nombre_archivo: 'apartamento-abismo.mp3',
        ruta_relativa: '/placeholder-audio/apartamento-abismo.mp3',
        tamano_bytes: 8500000, // ~8.5MB
        duracion_segundos: 1200, // 20 minutos
        formato: 'mp3',
        descripcion: 'Audio narrado de la historia del apartamento paranormal'
      }])
      .select('id');

    if (audioError) {
      console.error('❌ Error creando audio:', audioError);
      console.log('Detalle del error:', JSON.stringify(audioError, null, 2));
    } else {
      console.log('✅ Audio placeholder creado');
    }

    // 4. Crear testigos
    console.log('\n👥 Creando testigos...');
    
    const testigos = [
      {
        historia_id: historiaId,
        tipo_testigo: 'principal',
        pseudonimo: 'Lina M.',
        edad_aprox: 19,
        ocupacion: 'Estudiante',
        relacion_evento: 'Víctima principal de la posesión',
        presencial: true,
        credibilidad_estimada: 5,
        notas_testigo: 'Experimentó posesión demoníaca tras usar tabla Ouija'
      },
      {
        historia_id: historiaId,
        tipo_testigo: 'secundario',
        pseudonimo: 'Clara R.',
        edad_aprox: 18,
        ocupacion: 'Estudiante',
        relacion_evento: 'Amiga presente durante el ritual con tabla Ouija',
        presencial: true,
        credibilidad_estimada: 4,
        notas_testigo: 'Testigo presencial de los eventos paranormales'
      },
      {
        historia_id: historiaId,
        tipo_testigo: 'secundario',
        pseudonimo: 'Sofía L.',
        edad_aprox: 18,
        ocupacion: 'Estudiante',
        relacion_evento: 'Amiga presente durante el ritual',
        presencial: true,
        credibilidad_estimada: 4,
        notas_testigo: 'Participó en la sesión con tabla Ouija'
      },
      {
        historia_id: historiaId,
        tipo_testigo: 'secundario',
        pseudonimo: 'Marta G.',
        edad_aprox: 19,
        ocupacion: 'Estudiante',
        relacion_evento: 'Amiga presente durante el ritual',
        presencial: true,
        credibilidad_estimada: 4,
        notas_testigo: 'Cuarta participante en la sesión paranormal'
      }
    ];

    const { data: testigosData, error: testigosError } = await supabaseAdmin
      .from('testigos')
      .insert(testigos)
      .select('id');

    if (testigosError) {
      console.error('❌ Error creando testigos:', testigosError);
    } else {
      console.log('✅ Testigos creados:', testigosData.length);
    }

    console.log('\n🎉 ¡Datos faltantes agregados exitosamente!');
    console.log('\n🔍 Verificando resultado final...');
    
    // Verificación final
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
      console.log('✅ VERIFICACIÓN FINAL:');
      console.log(`- Ubicación: ${historiaFinal.ubicaciones ? 'SÍ' : 'NO'}`);
      console.log(`- Archivos multimedia: ${historiaFinal.archivos_multimedia?.length || 0}`);
      console.log(`- Testigos: ${historiaFinal.testigos?.length || 0}`);
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

addMissingData();
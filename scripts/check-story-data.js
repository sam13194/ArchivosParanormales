// Script para verificar todos los datos de la historia
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStoryData() {
  try {
    console.log('🔍 Obteniendo datos completos de la historia ID: 11...');
    
    const { data: historia, error } = await supabaseAdmin
      .from('historias')
      .select('*')
      .eq('id', 11)
      .single();

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('📋 DATOS COMPLETOS DE LA HISTORIA:');
    console.log('=====================================');
    
    // Mostrar datos principales
    console.log('🏷️ IDENTIFICACIÓN:');
    console.log(`ID: ${historia.id}`);
    console.log(`Código único: ${historia.codigo_unico}`);
    console.log(`Título: ${historia.titulo_provisional}`);
    console.log(`Estado: ${historia.estado_procesamiento}`);
    console.log(`Creado: ${historia.created_at}`);
    console.log(`Creado por: ${historia.created_by_uid}`);
    
    console.log('\n📝 CONTENIDO:');
    console.log(`Descripción corta: ${historia.descripcion_corta || 'NO DEFINIDA'}`);
    console.log(`Descripción larga: ${historia.descripcion_larga || 'NO DEFINIDA'}`);
    console.log(`Testimonio completo: ${historia.testimonio_completo ? 'SÍ (' + historia.testimonio_completo.length + ' chars)' : 'NO'}`);
    console.log(`Extracto verbatim: ${historia.extracto_verbatim ? 'SÍ (' + historia.extracto_verbatim.length + ' chars)' : 'NO'}`);
    
    console.log('\n🏷️ CLASIFICACIÓN:');
    console.log(`Género principal: ${historia.genero_principal || 'NO DEFINIDO'}`);
    console.log(`Fuente del relato: ${historia.fuente_relato || 'NO DEFINIDA'}`);
    console.log(`Impacto: ${historia.ponderacion_impacto || 'NO DEFINIDO'}`);
    console.log(`Credibilidad: ${historia.credibilidad_score || 'NO DEFINIDA'}`);
    console.log(`Verificación: ${historia.nivel_verificacion || 'NO DEFINIDO'}`);
    
    console.log('\n📍 UBICACIÓN Y CONTEXTO:');
    console.log(`Ubicación ID: ${historia.ubicacion_id || 'NO DEFINIDA'}`);
    console.log(`Fecha evento: ${historia.fecha_evento_inicio || 'NO DEFINIDA'}`);
    console.log(`Hora evento: ${historia.hora_evento || 'NO DEFINIDA'}`);
    
    console.log('\n🎬 PRODUCCIÓN:');
    console.log(`Dificultad: ${historia.dificultad_produccion || 'NO DEFINIDA'}`);
    console.log(`Tiempo estimado: ${historia.tiempo_produccion_estimado || 'NO DEFINIDO'}`);
    console.log(`Presupuesto: ${historia.presupuesto_estimado || 'NO DEFINIDO'}`);

    // Verificar relaciones
    console.log('\n🔗 VERIFICANDO RELACIONES...');
    
    // Check archivos multimedia
    const { data: archivos, error: archivosError } = await supabaseAdmin
      .from('archivos_multimedia')
      .select('*')
      .eq('historia_id', 11);
    
    console.log(`Archivos multimedia: ${archivos ? archivos.length : 0} encontrados`);
    if (archivos && archivos.length > 0) {
      archivos.forEach((archivo, index) => {
        console.log(`  ${index + 1}. Tipo: ${archivo.tipo_archivo}, Archivo: ${archivo.nombre_archivo}`);
      });
    }
    
    // Check ubicación si existe ubicacion_id
    if (historia.ubicacion_id) {
      const { data: ubicacion, error: ubicacionError } = await supabaseAdmin
        .from('ubicaciones')
        .select('*')
        .eq('id', historia.ubicacion_id)
        .single();
      
      console.log(`Ubicación: ${ubicacion ? 'ENCONTRADA' : 'NO ENCONTRADA'}`);
      if (ubicacion) {
        console.log(`  País: ${ubicacion.pais}`);
        console.log(`  Departamento: ${ubicacion.nivel1_nombre}`);
        console.log(`  Ciudad: ${ubicacion.nivel2_nombre}`);
      }
    } else {
      console.log('Ubicación: NO ASIGNADA');
    }
    
    // Check testigos
    const { data: testigos, error: testigosError } = await supabaseAdmin
      .from('testigos')
      .select('*')
      .eq('historia_id', 11);
    
    console.log(`Testigos: ${testigos ? testigos.length : 0} encontrados`);
    if (testigos && testigos.length > 0) {
      testigos.forEach((testigo, index) => {
        console.log(`  ${index + 1}. ${testigo.pseudonimo || 'Sin nombre'} (${testigo.tipo_testigo})`);
      });
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkStoryData();
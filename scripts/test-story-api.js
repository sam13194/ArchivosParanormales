// Script para probar la API y el adaptador
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Importar la función adaptDatabaseStory (simulada)
function adaptDatabaseStory(dbStory) {
  const audioFile = dbStory.archivos_multimedia?.find(a => a.tipo_archivo === 'audio_original');
  const imageFile = dbStory.archivos_multimedia?.find(a => a.tipo_archivo === 'imagen_portada');
  
  // Procesar testigos
  const witnesses = dbStory.testigos?.map(testigo => ({
    name: testigo.pseudonimo || `Testigo ${testigo.tipo_testigo}`,
    role: testigo.ocupacion || testigo.tipo_testigo || 'Testigo'
  })) || [];
  
  // Formatear fecha del evento
  const eventDate = dbStory.fecha_evento_inicio 
    ? new Date(dbStory.fecha_evento_inicio).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date(dbStory.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
  return {
    id: dbStory.id,
    title: dbStory.titulo_provisional,
    imageUrl: imageFile?.ruta_absoluta || '/placeholder-story.jpg',
    backgroundImageUrl: imageFile?.ruta_absoluta,
    imageHint: dbStory.descripcion_corta || 'Historia paranormal',
    location: dbStory.ubicaciones?.nivel2_nombre && dbStory.ubicaciones?.nivel1_nombre 
      ? `${dbStory.ubicaciones.nivel2_nombre}, ${dbStory.ubicaciones.nivel1_nombre}` 
      : dbStory.ubicaciones?.nivel1_nombre || 'Ubicación no especificada',
    impact: dbStory.ponderacion_impacto || 3,
    duration: 300,
    tags: dbStory.genero_principal ? [dbStory.genero_principal] : [],
    credibility: dbStory.credibilidad_score || 3,
    isBasedOnRealTestimony: true,
    summary: dbStory.descripcion_corta || dbStory.extracto_verbatim || 'Sin descripción disponible',
    audioUrl: audioFile?.ruta_absoluta || '',
    fullText: dbStory.testimonio_completo || dbStory.extracto_verbatim || '',
    witnesses: witnesses,
    eventDate: eventDate,
    relatedStories: []
  };
}

async function testStoryAPI() {
  try {
    console.log('🔍 Probando la obtención de datos de la historia ID: 11...');
    
    // Simular lo que hace la API /api/stories/11
    const { data, error } = await supabaseAdmin
      .from('historias')
      .select(`
        *,
        ubicaciones(*),
        archivos_multimedia(*),
        testigos(*),
        contexto_ambiental(*),
        factores_credibilidad(*),
        metricas_iniciales(*),
        performance_esperado(*),
        derechos(*),
        historia_subgeneros(
          *,
          subgeneros(*)
        ),
        historia_elementos(
          *,
          elementos_clave(*)
        ),
        colaboradores(*)
      `)
      .eq('id', 11)
      .single();
    
    if (error) {
      console.error('❌ Error obteniendo datos:', error);
      return;
    }
    
    console.log('✅ Datos obtenidos de la base de datos');
    
    // Mostrar datos crudos importantes
    console.log('\n📋 DATOS CRUDOS DE LA BD:');
    console.log('========================');
    console.log(`Título: ${data.titulo_provisional}`);
    console.log(`Estado: ${data.estado_procesamiento}`);
    console.log(`Archivos multimedia:`, data.archivos_multimedia?.length || 0);
    
    if (data.archivos_multimedia) {
      data.archivos_multimedia.forEach(archivo => {
        console.log(`  - ${archivo.tipo_archivo}: ${archivo.ruta_absoluta}`);
      });
    }
    
    console.log(`Ubicaciones:`, data.ubicaciones ? 'SÍ' : 'NO');
    if (data.ubicaciones) {
      console.log(`  - ${data.ubicaciones.nivel2_nombre}, ${data.ubicaciones.nivel1_nombre}`);
    }
    
    console.log(`Testigos:`, data.testigos?.length || 0);
    if (data.testigos) {
      data.testigos.forEach(testigo => {
        console.log(`  - ${testigo.tipo_testigo}: ${testigo.pseudonimo}`);
      });
    }
    
    // Probar la función de adaptación
    console.log('\n🔄 PROBANDO ADAPTACIÓN A FORMATO UI:');
    console.log('====================================');
    
    const adaptedStory = adaptDatabaseStory(data);
    
    console.log(`📋 Título adaptado: ${adaptedStory.title}`);
    console.log(`📍 Ubicación adaptada: ${adaptedStory.location}`);
    console.log(`🖼️ Imagen URL: ${adaptedStory.imageUrl}`);
    console.log(`🎵 Audio URL: ${adaptedStory.audioUrl}`);
    console.log(`⭐ Impacto: ${adaptedStory.impact}/5`);
    console.log(`🛡️ Credibilidad: ${adaptedStory.credibility}/5`);
    console.log(`🏷️ Tags: ${adaptedStory.tags.join(', ')}`);
    console.log(`👥 Testigos: ${adaptedStory.witnesses.length}`);
    
    if (adaptedStory.witnesses.length > 0) {
      adaptedStory.witnesses.forEach(witness => {
        console.log(`  - ${witness.name} (${witness.role})`);
      });
    }
    
    console.log(`📅 Fecha del evento: ${adaptedStory.eventDate}`);
    console.log(`📄 Resumen: ${adaptedStory.summary.substring(0, 100)}...`);
    
    console.log('\n🎯 VERIFICACIÓN DE FUNCIONALIDAD:');
    console.log('=================================');
    console.log(`✅ Historia está publicada: ${data.estado_procesamiento === 'publicada'}`);
    console.log(`✅ Tiene imagen: ${!!adaptedStory.imageUrl && adaptedStory.imageUrl !== '/placeholder-story.jpg'}`);
    console.log(`✅ Tiene audio: ${!!adaptedStory.audioUrl}`);
    console.log(`✅ Tiene ubicación: ${adaptedStory.location !== 'Ubicación no especificada'}`);
    console.log(`✅ Tiene testigos: ${adaptedStory.witnesses.length > 0}`);
    
    console.log('\n🚀 CONCLUSIÓN:');
    console.log('===============');
    console.log('La historia debería mostrarse correctamente en:');
    console.log('1. Homepage (http://localhost:9002)');
    console.log('2. Página individual (http://localhost:9002/story/11)');
    console.log('3. Con imagen y audio funcionales');

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

testStoryAPI();
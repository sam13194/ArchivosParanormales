// Script para verificar la estructura de las tablas
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDBStructure() {
  try {
    console.log('🔍 Verificando estructura de tabla archivos_multimedia...');
    
    // Usar información del schema de PostgreSQL
    const { data: columns, error } = await supabaseAdmin
      .rpc('get_table_columns', { table_name: 'archivos_multimedia' })
      .single();

    if (error) {
      // Si no existe la función, intentar query directo
      const { data: archivos, error: archivosError } = await supabaseAdmin
        .from('archivos_multimedia')
        .select('*')
        .limit(1);

      if (archivosError) {
        console.error('❌ Error:', archivosError);
        
        // Intentar ver qué tablas existen
        console.log('\n📋 Intentando listar todas las tablas...');
        const { data: allData, error: allError } = await supabaseAdmin
          .from('historias')
          .select(`
            id,
            titulo_provisional,
            archivos_multimedia:archivos_multimedia(*),
            ubicaciones:ubicaciones(*)
          `)
          .eq('id', 11)
          .single();
        
        if (allError) {
          console.error('❌ Error al obtener datos completos:', allError);
        } else {
          console.log('✅ Datos de la historia encontrada:');
          console.log(JSON.stringify(allData, null, 2));
        }
      } else {
        console.log('✅ Estructura de archivos_multimedia (ejemplo):');
        if (archivos && archivos.length > 0) {
          console.log('Columnas encontradas:', Object.keys(archivos[0]));
          console.log('Datos:', archivos[0]);
        } else {
          console.log('⚠️ No hay registros en archivos_multimedia');
        }
      }
    }

    // Verificar tabla ubicaciones también
    console.log('\n🌍 Verificando ubicaciones...');
    const { data: ubicacionTest, error: ubicacionError } = await supabaseAdmin
      .from('ubicaciones')
      .select('*')
      .limit(1);
    
    if (ubicacionError) {
      console.error('❌ Error en ubicaciones:', ubicacionError);
    } else if (ubicacionTest && ubicacionTest.length > 0) {
      console.log('✅ Columnas en ubicaciones:', Object.keys(ubicacionTest[0]));
    } else {
      console.log('⚠️ No hay registros en ubicaciones');
    }

  } catch (error) {
    console.error('💥 Error general:', error);
  }
}

checkDBStructure();
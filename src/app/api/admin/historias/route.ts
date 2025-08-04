import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// GET - Obtener todas las historias para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado'); // 'todas', 'publicadas', 'pendientes', etc.
    
    let query = supabaseAdmin
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
      `);

    // Filtrar por estado si se especifica
    if (estado && estado !== 'todas') {
      query = query.eq('estado_procesamiento', estado);
    }

    // Ordenar por fecha de creación descendente
    query = query.order('fecha_creacion', { ascending: false });

    const { data: historias, error } = await query;

    if (error) {
      console.error('Error fetching historias:', error);
      return NextResponse.json(
        { error: 'Failed to fetch historias' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      historias
    });

  } catch (error) {
    console.error('Admin historias GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva historia como admin (formulario completo)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    console.log('=== ADMIN HISTORIAS POST START ===');
    console.log('Form data keys:', Object.keys(formData));
    console.log('fecha_sucesos:', formData.fecha_sucesos);
    console.log('hora_evento:', formData.hora_evento);
    console.log('nivel_verificacion:', formData.nivel_verificacion);
    console.log('🎬 ARCHIVOS MULTIMEDIA RECIBIDOS:');
    console.log('audio_url:', formData.audio_url);
    console.log('imagen_url:', formData.imagen_url);
    const {
      // Campos básicos
      titulo,
      descripcion_corta,
      testimonio_completo,
      extracto_verbatim,
      historia_reescrita,
      
      // Archivos
      audio_url,
      imagen_url,
      
      // Análisis
      fuente_relato,
      genero_principal,
      nivel_credibilidad,
      nivel_impacto,
      nivel_verificacion,
      
      // Ubicación
      ubicacion,
      
      // Fecha
      fecha_sucesos,
      hora_evento,
      duracion_evento_minutos,
      
      // Testigos
      testigo_principal,
      testigos_secundarios = [],
      
      // Entidades paranormales
      entidades_reportadas = [],
      
      // Contexto ambiental
      contexto_ambiental,
      
      // Producción
      dificultad_produccion,
      tiempo_estimado_produccion,
      tiempo_produccion_estimado,
      recursos_necesarios,
      presupuesto_estimado,
      
      // Admin
      admin_uid,
      publicar_inmediatamente = true,
      
      // Campos adicionales del formulario completo
      ...resto_campos
    } = formData;

    // Validar campos obligatorios
    if (!titulo || !descripcion_corta || !testimonio_completo) {
      console.log('Missing required fields:', { titulo: !!titulo, descripcion_corta: !!descripcion_corta, testimonio_completo: !!testimonio_completo });
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: título, descripción_corta, testimonio_completo' },
        { status: 400 }
      );
    }

    // Generar código único
    const codigo_unico = `AP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Crear ubicación completa si se proporciona
    let ubicacion_id = null;
    if (ubicacion && (ubicacion.departamento !== 'Desconocido' || ubicacion.latitud || ubicacion.longitud)) {
      const { data: ubicacionData, error: ubicacionError } = await supabaseAdmin
        .from('ubicaciones')
        .insert([{
          pais: ubicacion.pais || 'Colombia',
          codigo_pais: ubicacion.codigo_pais || 'CO',
          nivel1_nombre: ubicacion.departamento === 'Desconocido' ? null : ubicacion.departamento,
          nivel1_codigo: ubicacion.nivel1_codigo,
          nivel2_nombre: ubicacion.ciudad === 'Desconocido' ? null : ubicacion.ciudad,
          nivel2_codigo: ubicacion.nivel2_codigo,
          nivel3_nombre: ubicacion.zona === 'Desconocido' ? null : ubicacion.zona,
          nivel4_nombre: ubicacion.nivel4_nombre,
          descripcion_lugar: ubicacion.descripcion_lugar === 'Desconocido' ? null : ubicacion.descripcion_lugar,
          tipo_lugar: ubicacion.tipo_lugar === 'Desconocido' ? null : ubicacion.tipo_lugar,
          latitud: ubicacion.latitud,
          longitud: ubicacion.longitud,
          precision_metros: ubicacion.precision_metros || 100,
          zona_horaria: ubicacion.zona_horaria || 'America/Bogota',
          altitud_metros: ubicacion.altitud_metros,
          actividad_paranormal_reportada: true,
          numero_historias_reportadas: 1,
          primera_actividad_reportada: fecha_sucesos && fecha_sucesos.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(fecha_sucesos).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          ultima_actividad_reportada: fecha_sucesos && fecha_sucesos.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(fecha_sucesos).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          fuente_verificacion: 'testimonio_directo'
        }])
        .select()
        .single();

      if (!ubicacionError && ubicacionData) {
        ubicacion_id = ubicacionData.id;
      }
    }

    // Crear la historia con todos los campos del formulario completo
    console.log('Creating historia with fecha_sucesos:', fecha_sucesos);
    console.log('Creating historia with hora_evento:', hora_evento);
    const historiaData = {
      codigo_unico,
      titulo_provisional: titulo,
      descripcion_corta,
      descripcion_larga: historia_reescrita,
      testimonio_completo,
      extracto_verbatim,
      created_by_uid: admin_uid,
      ubicacion_id,
      
      // Análisis
      fuente_relato: fuente_relato || 'llamada_oyente',
      genero_principal: genero_principal || 'fantasmas_apariciones',
      ponderacion_impacto: Math.max(1, Math.min(5, parseInt(resto_campos.ponderacion_impacto || nivel_impacto) || 3)),
      potencial_adaptacion: Math.max(1, Math.min(3, parseInt(resto_campos.potencial_adaptacion) || 2)),
      nivel_verificacion: ['sin_verificar', 'testimonio_unico', 'multiples_testigos', 'evidencia_fisica', 'investigacion_completa', 'verificado_experto'].includes(nivel_verificacion) ? nivel_verificacion : 'testimonio_unico',
      credibilidad_score: Math.max(0, Math.min(5, parseFloat(nivel_credibilidad) || 3.5)),
      
      // Fechas y tiempo
      fecha_evento_inicio: fecha_sucesos && fecha_sucesos !== 'Desconocido' && fecha_sucesos.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(fecha_sucesos).toISOString().split('T')[0] : null,
      hora_evento: hora_evento && hora_evento.match(/^\d{2}:\d{2}(:\d{2})?$/) ? hora_evento : null,
      duracion_evento_minutos: duracion_evento_minutos,
      fecha_transcripcion: new Date().toISOString().split('T')[0],
      
      // Metadata
      epoca_historica: resto_campos.epoca_historica || 'Contemporánea',
      protagonistas_descripcion: resto_campos.protagonistas_descripcion,
      palabras_clave_patron: resto_campos.palabras_clave_patron || [],
      longitud_extracto_palabras: extracto_verbatim ? extracto_verbatim.split(' ').length : 0,
      suceso_principal_resumen: descripcion_corta,
      historia_reescrita,
      
      // Producción
      duracion_impacto_emocional: ['leve', 'moderado', 'intenso', 'traumático'].includes(resto_campos.duracion_impacto_emocional) 
        ? resto_campos.duracion_impacto_emocional 
        : resto_campos.duracion_impacto_emocional === 'media' 
          ? 'moderado' 
          : 'moderado',
      dificultad_produccion: Math.max(1, Math.min(5, parseInt(dificultad_produccion) || 3)),
      tiempo_produccion_estimado: tiempo_produccion_estimado || tiempo_estimado_produccion || 300,
      recursos_necesarios: recursos_necesarios || {},
      presupuesto_estimado: presupuesto_estimado,
      notas_adicionales: resto_campos.notas_adicionales,
      
      // Derechos (campos directos en historias)
      derechos_uso: ['dominio_publico', 'uso_libre', 'permiso_verbal', 'contrato_firmado', 'pendiente_autorizacion', 'uso_restringido'].includes(resto_campos.derechos_uso) ? resto_campos.derechos_uso : 'permiso_verbal',
      autorizacion_comercial: resto_campos.autorizacion_comercial !== false,
      autorizacion_adaptacion: resto_campos.autorizacion_adaptacion !== false,
      restricciones_uso: resto_campos.restricciones_uso,
      contacto_derechos: resto_campos.contacto_derechos,
      
      // Admin bypass: publicar directamente
      estado_procesamiento: publicar_inmediatamente ? 'publicada' : 'extraida',
      fecha_publicacion: publicar_inmediatamente ? new Date().toISOString().split('T')[0] : null,
      
      // Metadatos de admin
      moderado_por_uid: admin_uid,
      fecha_moderacion: new Date().toISOString(),
      notas_moderacion: 'Creada directamente por administrador con formulario completo',
      
      // Removed analytics - these go in metricas_iniciales table
      
      // Hash para detección de similitudes
      hash_similarity: Buffer.from(titulo + testimonio_completo).toString('base64').substring(0, 64)
    };

    const { data: historia, error: historiaError } = await supabaseAdmin
      .from('historias')
      .insert([historiaData])
      .select()
      .single();

    if (historiaError) {
      console.error('Error creating historia:', historiaError);
      console.error('Historia data that failed:', JSON.stringify(historiaData, null, 2));
      return NextResponse.json(
        { error: 'Failed to create historia', details: historiaError.message },
        { status: 500 }
      );
    }

    // Crear registros relacionados después de crear la historia
    const historia_id = historia.id;
    
    // 1. Archivos multimedia
    const archivos = [];
    if (audio_url) {
      archivos.push({
        historia_id,
        tipo_archivo: 'audio_original',
        nombre_archivo: `${codigo_unico}_audio.mp3`,
        ruta_absoluta: audio_url, // Usar la URL de Cloudinary como ruta absoluta
        ruta_relativa: `historias/${historia_id}/audio.mp3`,
        uploaded_by_uid: admin_uid,
        duracion_segundos: resto_campos.duracion_audio || 0,
        formato: 'mp3',
        'tamaño_bytes': resto_campos.tamano_audio || 0,
        bitrate: resto_campos.bitrate_audio || '128kbps',
        sample_rate: resto_campos.sample_rate || 44100,
        canales: resto_campos.canales || 2,
        version: 1,
        is_active: true,
        descripcion: 'Audio principal de la historia'
      });
    }
    
    if (imagen_url) {
      archivos.push({
        historia_id,
        tipo_archivo: 'imagen_portada',
        nombre_archivo: `${codigo_unico}_imagen.jpg`,
        ruta_absoluta: imagen_url, // Usar la URL de Cloudinary como ruta absoluta
        ruta_relativa: `historias/${historia_id}/imagen.jpg`,
        uploaded_by_uid: admin_uid,
        'tamaño_bytes': resto_campos.tamano_imagen || 0,
        formato: 'jpg',
        ancho_px: resto_campos.ancho_imagen || 800,
        alto_px: resto_campos.alto_imagen || 600,
        version: 1,
        is_active: true,
        descripcion: 'Imagen principal de la historia'
      });
    }
    
    if (archivos.length > 0) {
      console.log('🎬 Insertando archivos multimedia:', archivos.length);
      console.log('📋 Archivos a insertar:', JSON.stringify(archivos, null, 2));
      
      const { data: archivosData, error: archivosError } = await supabaseAdmin
        .from('archivos_multimedia')
        .insert(archivos)
        .select();
      
      if (archivosError) {
        console.error('❌ Error insertando archivos multimedia:', archivosError);
        console.error('📋 Datos que causaron error:', JSON.stringify(archivos, null, 2));
        // No fallar la creación de historia por errores de archivos, solo log
      } else {
        console.log('✅ Archivos multimedia insertados exitosamente:', archivosData?.length || 0);
      }
    } else {
      console.log('ℹ️ No hay archivos multimedia para insertar');
    }

    // 2. Testigos
    const testigos = [];
    if (testigo_principal) {
      testigos.push({
        historia_id,
        tipo_testigo: 'principal',
        pseudonimo: testigo_principal.pseudonimo,
        edad_aprox: testigo_principal.edad,
        ocupacion: testigo_principal.ocupacion,
        relacion_evento: testigo_principal.relacion_evento,
        presencial: testigo_principal.presencial !== false,
        credibilidad_estimada: testigo_principal.credibilidad || 5,
        factores_credibilidad: testigo_principal.factores_credibilidad || {},
        antecedentes_paranormales: testigo_principal.antecedentes_paranormales || false,
        contacto_disponible: testigo_principal.contacto_disponible || false,
        notas_testigo: testigo_principal.notas
      });
    }
    
    testigos_secundarios.forEach((testigo: any) => {
      testigos.push({
        historia_id,
        tipo_testigo: 'secundario',
        pseudonimo: testigo.pseudonimo,
        edad_aprox: testigo.edad,
        ocupacion: testigo.ocupacion,
        relacion_evento: testigo.relacion_evento,
        presencial: testigo.presencial !== false,
        credibilidad_estimada: testigo.credibilidad || 5,
        factores_credibilidad: testigo.factores_credibilidad || {},
        antecedentes_paranormales: testigo.antecedentes_paranormales || false,
        contacto_disponible: testigo.contacto_disponible || false,
        notas_testigo: testigo.notas
      });
    });
    
    if (testigos.length > 0) {
      await supabaseAdmin.from('testigos').insert(testigos);
    }
    
    // 3. Contexto ambiental
    if (contexto_ambiental) {
      await supabaseAdmin.from('contexto_ambiental').insert([{
        historia_id,
        clima_evento: contexto_ambiental.clima,
        temperatura_aprox: contexto_ambiental.temperatura,
        humedad_aprox: contexto_ambiental.humedad,
        numero_personas_presente: contexto_ambiental.numero_personas || 1,
        situacion_social: contexto_ambiental.situacion_social,
        fase_lunar: contexto_ambiental.fase_lunar,
        festividad_religiosa: contexto_ambiental.festividad_religiosa,
        evento_historico: contexto_ambiental.evento_historico,
        aniversario_especial: contexto_ambiental.aniversario_especial,
        actividad_previa: contexto_ambiental.actividad_previa,
        estado_emocional_testigos: contexto_ambiental.estado_emocional,
        patron_temporal_detectado: contexto_ambiental.patron_temporal || false
      }]);
    }
    
    // 4. Factores de credibilidad
    await supabaseAdmin.from('factores_credibilidad').insert([{
      historia_id,
      multiples_testigos: testigos.length,
      evidencia_fisica: resto_campos.evidencia_fisica || 1,
      consistencia_relatos: resto_campos.consistencia_relatos || 3,
      ubicacion_verificable: ubicacion_id ? 4 : 2,
      contexto_historico: resto_campos.contexto_historico || 3,
      sobriedad_testigo: resto_campos.sobriedad_testigo || 4,
      conocimiento_previo: resto_campos.conocimiento_previo || 3,
      estado_emocional: resto_campos.estado_emocional_factor || 3,
      banderas_rojas: resto_campos.banderas_rojas || []
    }]);
    
    // 5. Métricas iniciales
    await supabaseAdmin.from('metricas_iniciales').insert([{
      historia_id,
      reproducciones: 0,
      me_gusta: 0,
      comentarios: 0,
      compartidos: 0
    }]);
    
    // 6. Performance esperado
    await supabaseAdmin.from('performance_esperado').insert([{
      historia_id,
      tiempo_estimado_escucha: tiempo_estimado_produccion || 300,
      audiencia_objetivo: resto_campos.audiencia_objetivo || 'general',
      engagement_esperado: resto_campos.engagement_esperado || 'medio'
    }]);
    
    // 7. Derechos
    await supabaseAdmin.from('derechos').insert([{
      historia_id,
      derechos_uso: resto_campos.derechos_uso || 'permiso_verbal',
      autorizacion_comercial: resto_campos.autorizacion_comercial !== false,
      autorizacion_adaptacion: resto_campos.autorizacion_adaptacion !== false,
      restricciones_uso: resto_campos.restricciones_uso,
      contacto_derechos: resto_campos.contacto_derechos
    }]);
    
    // 8. Subgéneros si se proporcionan
    if (resto_campos.subgeneros && Array.isArray(resto_campos.subgeneros) && resto_campos.subgeneros.length > 0) {
      const subgeneroInserts = resto_campos.subgeneros.map((subgenero_id: number) => ({
        historia_id,
        subgenero_id,
        relevancia: 3
      }));
      await supabaseAdmin.from('historia_subgeneros').insert(subgeneroInserts);
    }
    
    // 9. Entidades paranormales
    const entidades_para_procesar = entidades_reportadas && entidades_reportadas.length > 0 
      ? entidades_reportadas 
      : (resto_campos.entidades && resto_campos.entidades.length > 0 && resto_campos.entidades[0].nombre_entidad)
        ? resto_campos.entidades.map((e: any) => ({
            nombre: e.nombre_entidad,
            tipo: e.tipo_entidad,
            descripcion_fisica: e.descripcion_fisica,
            hostilidad: e.nivel_hostilidad
          }))
        : [];
        
    if (entidades_para_procesar && entidades_para_procesar.length > 0) {
      for (const entidad of entidades_para_procesar) {
        // Primero crear/actualizar la entidad
        const { data: entidadData, error: entidadError } = await supabaseAdmin
          .from('entidades_paranormales')
          .upsert({
            nombre: entidad.nombre,
            tipo_entidad: entidad.tipo || 'fantasma',
            descripcion_fisica: entidad.descripcion_fisica,
            comportamiento_tipico: entidad.comportamiento,
            nivel_hostilidad: entidad.hostilidad || 1,
            alias_conocidos: entidad.alias || [],
            genero: entidad.genero,
            edad_aparente_min: entidad.edad_min,
            edad_aparente_max: entidad.edad_max,
            vestimenta_tipica: entidad.vestimenta,
            caracteristicas_distintivas: entidad.caracteristicas,
            patron_comportamiento: entidad.patron_comportamiento,
            triggers_aparicion: entidad.triggers || [],
            palabras_clave_identificacion: entidad.palabras_clave || [],
            primera_aparicion_conocida: fecha_sucesos && fecha_sucesos.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(fecha_sucesos).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            ultima_aparicion_conocida: fecha_sucesos && fecha_sucesos.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(fecha_sucesos).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            numero_historias_asociadas: 1,
            radio_accion_km: entidad.radio_accion || 5,
            nivel_certeza: 'testimonio_unico'
          }, {
            onConflict: 'nombre',
            ignoreDuplicates: false
          })
          .select()
          .single();
          
        if (!entidadError && entidadData) {
          // Luego asociar con la historia
          await supabaseAdmin.from('historia_elementos').insert([{
            historia_id,
            elemento_id: entidadData.id,
            relevancia: 5
          }]);
        }
      }
    }

    return NextResponse.json({
      success: true,
      historia,
      message: publicar_inmediatamente ? 'Historia creada y publicada exitosamente' : 'Historia creada, pendiente de revisión'
    });

  } catch (error) {
    console.error('Admin historias POST error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar historia existente como admin
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const historia_id = searchParams.get('id');

    if (!historia_id) {
      return NextResponse.json(
        { error: 'ID de historia requerido' },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    const { data: historia, error } = await supabaseAdmin
      .from('historias')
      .update({
        ...updateData,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', historia_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating historia:', error);
      return NextResponse.json(
        { error: 'Failed to update historia' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      historia
    });

  } catch (error) {
    console.error('Admin historias PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar historia como admin
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const historia_id = searchParams.get('id');

    if (!historia_id) {
      return NextResponse.json(
        { error: 'ID de historia requerido' },
        { status: 400 }
      );
    }

    // Eliminar todos los registros relacionados en cascada
    const tablasRelacionadas = [
      'archivos_multimedia',
      'testigos', 
      'contexto_ambiental',
      'factores_credibilidad',
      'metricas_iniciales',
      'performance_esperado',
      'derechos',
      'historia_subgeneros',
      'historia_elementos',
      'colaboradores'
    ];
    
    for (const tabla of tablasRelacionadas) {
      await supabaseAdmin
        .from(tabla)
        .delete()
        .eq('historia_id', historia_id);
    }

    // Eliminar la historia
    const { error } = await supabaseAdmin
      .from('historias')
      .delete()
      .eq('id', historia_id);

    if (error) {
      console.error('Error deleting historia:', error);
      return NextResponse.json(
        { error: 'Failed to delete historia' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Historia eliminada exitosamente'
    });

  } catch (error) {
    console.error('Admin historias DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
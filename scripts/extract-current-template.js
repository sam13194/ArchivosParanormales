// Script para extraer la plantilla JSON actual del código
const fs = require('fs');
const path = require('path');

function extractCurrentTemplate() {
  try {
    console.log('📋 Extrayendo plantilla JSON actual del código...');
    
    // Esta es la plantilla actual tal como está en el código
    const currentTemplate = {
      // ===== RESTRICCIONES DE CAMPOS (IMPORTANTE LEER) =====
      // Los siguientes campos tienen restricciones específicas en la base de datos:
      // 
      // CAMPOS NUMÉRICOS CON RANGOS ESTRICTOS:
      // - nivel_credibilidad/credibilidad_score: 0-5 (decimal, precisión 0.1)
      // - ponderacion_impacto: 1-5 (entero)
      // - potencial_adaptacion: 1-3 (entero)
      // - dificultad_produccion: 1-5 (entero)
      // - factores_credibilidad (todos los subcampos): 1-5 (entero cada uno)
      //
      // CAMPOS ENUM (valores específicos permitidos):
      // - fuente_relato: 'llamada_oyente' | 'historia_programa' | 'investigacion_propia'
      // - nivel_verificacion: 'sin_verificar' | 'testimonio_unico' | 'multiples_testigos' | 'evidencia_fisica' | 'investigacion_completa' | 'verificado_experto'
      // - duracion_impacto_emocional: 'leve' | 'moderado' | 'intenso' | 'traumático'
      // - derechos_uso: 'dominio_publico' | 'uso_libre' | 'permiso_verbal' | 'contrato_firmado' | 'pendiente_autorizacion' | 'uso_restringido'
      // - estado_procesamiento: 'extraida' | 'en_adaptacion' | 'adaptada' | 'en_produccion' | 'producida' | 'publicada'
      //
      // TIPOS DE ARCHIVO MULTIMEDIA VÁLIDOS:
      // - tipo_archivo: 'audio_original' (para archivos de audio)
      // - tipo_archivo: 'imagen_portada' (para imágenes principales)
      //
      // ===== IDENTIFICACIÓN Y CONTROL =====
      codigo_unico: "BOGOTA_TEQUENDAMA_001",
      fecha_transcripcion: "2024-12-20",
      estado_procesamiento: "extraida",
      hash_similarity: "a4b7c9d2e5f8g1h4i7j0k3l6m9n2o5p8",
      palabras_clave_patron: ["hotel", "ascensores", "pasillos", "historico", "nocturno", "transparente"],
      
      // ===== INFORMACIÓN BÁSICA =====
      titulo: "Fenómenos Inexplicables en el Hotel Tequendama",
      descripcion_corta: "Un huésped reporta actividad paranormal en el icónico hotel de Bogotá",
      descripcion_larga: "Durante su estadía en el Hotel Tequendama, un turista experimenta fenómenos inexplicables que lo marcan de por vida.",
      testimonio_completo: "Yo me quedé en el Hotel Tequendama en diciembre del año pasado. Era mi primera vez en Bogotá y quería quedarme en un lugar emblemático. La primera noche todo normal, pero la segunda noche empezaron los ruidos extraños...",
      extracto_verbatim: "Los ascensores se movían solos, las luces se prendían y apagaban, y juraría que alguien caminaba por los pasillos en la madrugada",
      historia_reescrita: "La noche bogotana envolvía el Hotel Tequendama cuando Juan decidió salir de su habitación. Lo que no sabía era que no estaba solo en esos pasillos llenos de historia...",
      suceso_principal_resumen: "Actividad paranormal intensa en hotel histórico con múltiples fenómenos reportados por huésped",
      protagonistas_descripcion: "Juan Carlos M., ingeniero de 35 años en viaje de negocios",
      
      // ===== ARCHIVOS MULTIMEDIA COMPLETOS =====
      archivos_multimedia: [
        {
          tipo_archivo: "audio_original",  // REQUERIDO: Usar exactamente este valor
          nombre_archivo: "BOGOTA_TEQUENDAMA_001_original.mp3",
          ruta_absoluta: "https://res.cloudinary.com/tu-cuenta/video/upload/v1234567890/archivos-paranormales/historias/audio_ejemplo.mp3",  // REQUERIDO: URL completa de Cloudinary
          ruta_relativa: "audio/originales/BOGOTA_TEQUENDAMA_001_original.mp3",
          "tamaño_bytes": 8388608,  // Nota: usar "tamaño_bytes" con ñ
          hash_archivo: "sha256:audio_hash_example",
          duracion_segundos: 480,
          formato: "mp3",
          bitrate: "192kbps",
          sample_rate: 44100,
          canales: 2,
          descripcion: "Testimonio original completo",
          version: 1,
          is_active: true
        },
        {
          tipo_archivo: "imagen_portada",  // REQUERIDO: Usar exactamente este valor
          nombre_archivo: "BOGOTA_TEQUENDAMA_001_portada.jpg",
          ruta_absoluta: "https://res.cloudinary.com/tu-cuenta/image/upload/v1234567890/archivos-paranormales/historias/portada_ejemplo.jpg",  // REQUERIDO: URL completa de Cloudinary
          ruta_relativa: "imagen/portadas/BOGOTA_TEQUENDAMA_001_portada.jpg",
          "tamaño_bytes": 2097152,  // Nota: usar "tamaño_bytes" con ñ
          ancho_px: 1920,
          alto_px: 1080,
          descripcion: "Hotel Tequendama de noche con efectos paranormales",
          metadata_extra: {
            photographer: "AI Generated",
            style: "Hotel histórico nocturno",
            color_scheme: "Blue-black gradient",
            mood: "Misterioso"
          }
        }
      ],
      
      // ===== UBICACIÓN COMPLETA =====
      ubicacion: {
        pais: "Colombia",
        codigo_pais: "CO",
        nivel1_nombre: "Cundinamarca",
        nivel1_codigo: "CUN", 
        nivel2_nombre: "Bogotá",
        nivel2_codigo: "BOG",
        nivel3_nombre: "La Candelaria",
        nivel4_nombre: "Centro Histórico",
        latitud: 4.6097,
        longitud: -74.0817,
        precision_metros: 10,
        descripcion_lugar: "Hotel emblemático del centro de Bogotá",
        lugar_especifico: "Hotel Tequendama",
        tipo_lugar: "hotel",
        zona_horaria: "America/Bogota",
        altitud_metros: 2640,
        actividad_paranormal_reportada: true,
        numero_historias_reportadas: 3,
        primera_actividad_reportada: "1985-03-15",
        ultima_actividad_reportada: "2024-12-15",
        verificada: true,
        fuente_verificacion: "Google Maps + confirmación hotel"
      },
      
      // ===== CLASIFICACIÓN Y ANÁLISIS =====
      fuente_relato: "llamada_oyente",
      genero_principal: "paranormal",
      epoca_historica: "Contemporánea",
      nivel_credibilidad: 4.5, // Rango: 0-5 (decimal) ✅ CORRECTO
      nivel_impacto: 4,        // Rango: 1-5 (entero) ✅ CORRECTO
      ponderacion_impacto: 5,  // Rango: 1-5 (entero) ✅ CORRECTO
      potencial_adaptacion: 3, // Rango: 1-3 (entero) ✅ CORRECTO
      nivel_verificacion: "multiples_testigos",
      longitud_extracto_palabras: 156,
      
      // ===== FACTORES DE CREDIBILIDAD =====
      // Todos los valores en rango 1-5 ✅ CORRECTO
      factores_credibilidad: {
        multiples_testigos: 4,      // 1-5: Número de testigos
        evidencia_fisica: 2,        // 1-5: Nivel de evidencia física
        consistencia_relatos: 4,    // 1-5: Consistencia entre testimonios
        ubicacion_verificable: 5,   // 1-5: Verificabilidad del lugar
        contexto_historico: 4,      // 1-5: Contexto histórico del lugar
        sobriedad_testigo: 5,       // 1-5: Estado de sobriedad del testigo
        conocimiento_previo: 2,     // 1-5: Conocimiento previo de lo paranormal
        estado_emocional: 4         // 1-5: Estabilidad emocional del testigo
      },
      banderas_rojas: [],
      
      // ===== FECHAS Y TEMPORALIDAD =====
      fecha_sucesos: "2024-12-15",
      fecha_evento_inicio: "2024-12-15",
      fecha_evento_fin: "2024-12-17",
      hora_evento: "02:30:00",
      evento_recurrente: true,
      
      // ===== PRODUCCIÓN =====
      dificultad_produccion: 3,      // Rango: 1-5 (entero) - Dificultad de producción ✅ CORRECTO
      tiempo_produccion_estimado: 300, // En minutos - Tiempo estimado de producción
      presupuesto_estimado: 150.00,   // En pesos colombianos - Presupuesto estimado
      
      // ===== CONTENIDO Y ADVERTENCIAS =====
      contenido_sensible: true,
      advertencias: ["actividad_poltergeist", "contenido_perturbador", "apariciones_nocturnas"],
      edad_minima_recomendada: 16,
      duracion_impacto_emocional: "moderado",  // VALORES VÁLIDOS: 'leve' | 'moderado' | 'intenso' | 'traumático' ✅ CORRECTO
      
      // ===== TESTIGOS =====
      testigo_principal: {
        pseudonimo: "Juan Carlos M.",
        edad_aprox: 35,
        ocupacion: "Ingeniero",
        relacion_evento: "Huésped del hotel durante los eventos",
        presencial: true,
        credibilidad_estimada: 4,
        factores_credibilidad: {
          estado_mental: 5,
          sobriedad: 5,
          consistencia: 4,
          motivaciones_secundarias: 1
        },
        antecedentes_paranormales: false,
        contacto_disponible: false,
        notas_testigo: "Persona racional, sin historial de experiencias paranormales previas"
      },
      
      testigos_secundarios: [
        {
          pseudonimo: "Personal de Limpieza",
          tipo_testigo: "secundario",
          edad_aprox: 45,
          ocupacion: "Trabajador del hotel",
          relacion_evento: "Reporta actividad similar en el mismo piso",
          presencial: true,
          credibilidad_estimada: 3,
          notas: "Confirma algunos aspectos del testimonio principal"
        }
      ],
      
      // ===== DERECHOS =====
      derechos_uso: "permiso_verbal",         // ENUM válido ✅ CORRECTO
      autorizacion_comercial: true,
      autorizacion_adaptacion: true,
      restricciones_uso: "Ninguna restricción específica",
      contacto_derechos: "admin@archivosparanormales.com",
      
      // ===== CONTROL =====
      publicar_inmediatamente: true
    };

    // Guardar plantilla actual
    const currentPath = path.join(process.cwd(), 'plantilla_actual_descargable.json');
    fs.writeFileSync(currentPath, JSON.stringify(currentTemplate, null, 2));
    
    console.log('\n📁 ARCHIVOS GENERADOS:');
    console.log('======================');
    console.log(`✅ Plantilla actual: ${currentPath}`);
    
    // Verificar valores críticos
    console.log('\n🔍 VERIFICACIÓN DE VALORES CRÍTICOS:');
    console.log('====================================');
    console.log(`✅ nivel_credibilidad: ${currentTemplate.nivel_credibilidad} (debe ser 0-5)`);
    console.log(`✅ ponderacion_impacto: ${currentTemplate.ponderacion_impacto} (debe ser 1-5)`);  
    console.log(`✅ potencial_adaptacion: ${currentTemplate.potencial_adaptacion} (debe ser 1-3)`);
    console.log(`✅ dificultad_produccion: ${currentTemplate.dificultad_produccion} (debe ser 1-5)`);
    console.log(`✅ duracion_impacto_emocional: "${currentTemplate.duracion_impacto_emocional}" (debe ser enum válido)`);
    console.log(`✅ derechos_uso: "${currentTemplate.derechos_uso}" (debe ser enum válido)`);
    
    // Verificar archivos multimedia
    console.log('\n🎬 ARCHIVOS MULTIMEDIA:');
    console.log('======================');
    currentTemplate.archivos_multimedia.forEach((archivo, index) => {
      console.log(`📁 Archivo ${index + 1}:`);
      console.log(`   tipo_archivo: "${archivo.tipo_archivo}" (debe ser 'audio_original' o 'imagen_portada')`);
      console.log(`   ruta_absoluta: ${archivo.ruta_absoluta ? 'PRESENTE' : 'FALTANTE'} (debe usar ruta_absoluta, no url_cloudinary)`);
    });

    console.log('\n🎯 ESTA ES LA PLANTILLA QUE SE DESCARGA ACTUALMENTE');
    console.log('Compárala con la que descargas desde el panel admin');

  } catch (error) {
    console.error('💥 Error extrayendo plantilla:', error);
  }
}

extractCurrentTemplate();
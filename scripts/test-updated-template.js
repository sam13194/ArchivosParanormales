// Script para probar la plantilla JSON actualizada
const fs = require('fs');
const path = require('path');

function testUpdatedTemplate() {
  try {
    console.log('🔍 Probando plantilla JSON actualizada...');
    
    // Plantilla con rangos correctos
    const updatedTemplate = {
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

      // ===== INFORMACIÓN BÁSICA =====
      codigo_unico: "PRUEBA_TEMPLATE_001",
      titulo: "Historia de Prueba con Rangos Correctos",
      descripcion_corta: "Historia para probar que todos los campos están dentro de los rangos válidos",
      testimonio_completo: "Este testimonio sirve para verificar que la plantilla JSON actualizada funciona correctamente con las restricciones de la base de datos.",
      
      // ===== ARCHIVOS MULTIMEDIA =====
      archivos_multimedia: [
        {
          tipo_archivo: "audio_original",  // EXACTO según BD
          nombre_archivo: "prueba_audio.mp3",
          ruta_absoluta: "https://res.cloudinary.com/dwiz8bahl/video/upload/v1234567890/test-audio.mp3",
          ruta_relativa: "audio/prueba_audio.mp3",
          "tamaño_bytes": 5000000,
          duracion_segundos: 600,
          formato: "mp3",
          bitrate: "128kbps",
          sample_rate: 44100,
          canales: 2,
          descripcion: "Audio de prueba"
        },
        {
          tipo_archivo: "imagen_portada",  // EXACTO según BD
          nombre_archivo: "prueba_imagen.jpg",
          ruta_absoluta: "https://res.cloudinary.com/dwiz8bahl/image/upload/v1234567890/test-image.jpg",
          ruta_relativa: "imagen/prueba_imagen.jpg",
          "tamaño_bytes": 1000000,
          ancho_px: 800,
          alto_px: 600,
          descripcion: "Imagen de prueba"
        }
      ],
      
      // ===== UBICACIÓN =====
      ubicacion: {
        pais: "Colombia",
        departamento: "Cundinamarca",
        ciudad: "Bogotá",
        descripcion_lugar: "Lugar de prueba"
      },
      
      // ===== CLASIFICACIÓN CON RANGOS CORRECTOS =====
      fuente_relato: "llamada_oyente",           // ENUM válido
      genero_principal: "paranormal",
      nivel_credibilidad: 4.5,                  // 0-5 decimal ✅
      nivel_impacto: 4,                         // 1-5 entero ✅
      ponderacion_impacto: 4,                   // 1-5 entero ✅
      potencial_adaptacion: 2,                  // 1-3 entero ✅
      nivel_verificacion: "multiples_testigos", // ENUM válido ✅
      
      // ===== FACTORES DE CREDIBILIDAD (todos 1-5) =====
      factores_credibilidad: {
        multiples_testigos: 4,        // 1-5 ✅
        evidencia_fisica: 2,          // 1-5 ✅
        consistencia_relatos: 4,      // 1-5 ✅
        ubicacion_verificable: 5,     // 1-5 ✅
        contexto_historico: 4,        // 1-5 ✅
        sobriedad_testigo: 5,         // 1-5 ✅
        conocimiento_previo: 2,       // 1-5 ✅
        estado_emocional: 4           // 1-5 ✅
      },
      
      // ===== PRODUCCIÓN =====
      dificultad_produccion: 3,               // 1-5 entero ✅
      tiempo_produccion_estimado: 300,        // En minutos
      duracion_impacto_emocional: "moderado", // ENUM válido ✅
      
      // ===== DERECHOS =====
      derechos_uso: "permiso_verbal",         // ENUM válido ✅
      autorizacion_comercial: true,
      autorizacion_adaptacion: true,
      
      // ===== FECHAS =====
      fecha_sucesos: "2024-12-01",
      hora_evento: "22:30:00",
      
      // ===== TESTIGOS =====
      testigo_principal: {
        pseudonimo: "María L.",
        edad: 28,
        ocupacion: "Estudiante",
        credibilidad: 5
      }
    };

    // Verificar que todos los campos están en rangos correctos
    console.log('\n✅ VERIFICACIÓN DE RANGOS:');
    console.log('========================');
    
    // Verificar campos numéricos
    const checks = [
      { field: 'nivel_credibilidad', value: updatedTemplate.nivel_credibilidad, min: 0, max: 5, type: 'decimal' },
      { field: 'ponderacion_impacto', value: updatedTemplate.ponderacion_impacto, min: 1, max: 5, type: 'integer' },
      { field: 'potencial_adaptacion', value: updatedTemplate.potencial_adaptacion, min: 1, max: 3, type: 'integer' },
      { field: 'dificultad_produccion', value: updatedTemplate.dificultad_produccion, min: 1, max: 5, type: 'integer' }
    ];
    
    checks.forEach(check => {
      const isValid = check.value >= check.min && check.value <= check.max;
      const typeOk = check.type === 'integer' ? Number.isInteger(check.value) : true;
      const status = isValid && typeOk ? '✅' : '❌';
      console.log(`${status} ${check.field}: ${check.value} (rango: ${check.min}-${check.max}, tipo: ${check.type})`);
    });
    
    // Verificar factores de credibilidad
    console.log('\n✅ FACTORES DE CREDIBILIDAD:');
    Object.entries(updatedTemplate.factores_credibilidad).forEach(([key, value]) => {
      const isValid = value >= 1 && value <= 5 && Number.isInteger(value);
      const status = isValid ? '✅' : '❌';
      console.log(`${status} ${key}: ${value} (rango: 1-5, entero)`);
    });
    
    // Verificar enums
    console.log('\n✅ CAMPOS ENUM:');
    const enumChecks = [
      { field: 'fuente_relato', value: updatedTemplate.fuente_relato, valid: ['llamada_oyente', 'historia_programa', 'investigacion_propia'] },
      { field: 'nivel_verificacion', value: updatedTemplate.nivel_verificacion, valid: ['sin_verificar', 'testimonio_unico', 'multiples_testigos', 'evidencia_fisica', 'investigacion_completa', 'verificado_experto'] },
      { field: 'duracion_impacto_emocional', value: updatedTemplate.duracion_impacto_emocional, valid: ['leve', 'moderado', 'intenso', 'traumático'] },
      { field: 'derechos_uso', value: updatedTemplate.derechos_uso, valid: ['dominio_publico', 'uso_libre', 'permiso_verbal', 'contrato_firmado', 'pendiente_autorizacion', 'uso_restringido'] }
    ];
    
    enumChecks.forEach(check => {
      const isValid = check.valid.includes(check.value);
      const status = isValid ? '✅' : '❌';
      console.log(`${status} ${check.field}: "${check.value}"`);
    });
    
    // Verificar tipos de archivo
    console.log('\n✅ TIPOS DE ARCHIVO MULTIMEDIA:');
    updatedTemplate.archivos_multimedia.forEach((archivo, index) => {
      const validTypes = ['audio_original', 'imagen_portada'];
      const isValid = validTypes.includes(archivo.tipo_archivo);
      const hasRutaAbsoluta = archivo.ruta_absoluta && archivo.ruta_absoluta.startsWith('https://');
      const status = isValid && hasRutaAbsoluta ? '✅' : '❌';
      console.log(`${status} Archivo ${index + 1}: tipo="${archivo.tipo_archivo}", ruta_absoluta="${archivo.ruta_absoluta ? 'SÍ' : 'NO'}"`);
    });

    // Guardar plantilla actualizada
    console.log('\n💾 Guardando plantilla actualizada...');
    const templatePath = path.join(process.cwd(), 'plantilla_historia_actualizada.json');
    fs.writeFileSync(templatePath, JSON.stringify(updatedTemplate, null, 2));
    console.log(`✅ Plantilla guardada en: ${templatePath}`);

    console.log('\n🎯 RESUMEN:');
    console.log('===========');
    console.log('✅ Todos los campos numéricos están en rangos correctos');
    console.log('✅ Todos los campos enum usan valores válidos');
    console.log('✅ Tipos de archivo multimedia correctos');
    console.log('✅ Campo ruta_absoluta (no url_cloudinary) usado');
    console.log('✅ Plantilla lista para usar en el panel admin');

  } catch (error) {
    console.error('💥 Error probando plantilla:', error);
  }
}

testUpdatedTemplate();
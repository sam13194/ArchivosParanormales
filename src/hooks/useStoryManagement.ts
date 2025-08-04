'use client';

import { useState } from 'react';
// ✅ Import al inicio del archivo
import templateWithComments from '@/lib/json-template.json';

interface NewStoryFormData {
  // Tabla: historias (55 columns)
  historias: {
    titulo_provisional: string;
    descripcion_corta: string;
    descripcion_larga: string;
    testimonio_completo: string;
    extracto_verbatim: string;
    historia_reescrita: string;
    suceso_principal_resumen: string;
    protagonistas_descripcion: string;
    fuente_relato: string;
    genero_principal: string;
    epoca_historica: string;
    nivel_credibilidad: number;
    nivel_impacto: number;
    ponderacion_impacto: number;
    potencial_adaptacion: number;
    nivel_verificacion: string;
    longitud_extracto_palabras: number;
    fecha_sucesos: string;
    fecha_evento_inicio: string;
    fecha_evento_fin: string;
    hora_evento: string;
    evento_recurrente: boolean;
    dificultad_produccion: number;
    tiempo_produccion_estimado: number;
    presupuesto_estimado: number;
    contenido_sensible: boolean;
    advertencias: string[];
    edad_minima_recomendada: number;
    duracion_impacto_emocional: string;
    banderas_rojas: string[];
    notas_adicionales: string;
    duracion_evento_minutos: number;
    patron_recurrencia: string;
    palabras_clave_patron: string[];
    hash_similarity: string;
    codigo_unico: string;
    fecha_transcripcion: string;
    estado_procesamiento: string;
    publicar_inmediatamente: boolean;
    [key: string]: any;
  };
  
  // Tabla: ubicaciones (24 columns)
  ubicacion: {
    pais: string;
    codigo_pais: string;
    nivel1_nombre: string;
    nivel1_codigo: string;
    nivel2_nombre: string;
    nivel2_codigo: string;
    nivel3_nombre: string;
    nivel4_nombre: string;
    latitud: number | null;
    longitud: number | null;
    precision_metros: number;
    descripcion_lugar: string;
    lugar_especifico: string;
    tipo_lugar: string;
    zona_horaria: string;
    altitud_metros: number | null;
    actividad_paranormal_reportada: boolean;
    numero_historias_reportadas: number;
    primera_actividad_reportada: string;
    ultima_actividad_reportada: string;
    verificada: boolean;
    fuente_verificacion: string;
    departamento: string;
    municipio: string;
  };
  
  // Tabla: testigos (15 columns)
  testigo_principal: {
    tipo_testigo: string;
    nombre_completo: string;
    pseudonimo: string;
    edad_aprox: number;
    ocupacion: string;
    relacion_evento: string;
    presencial: boolean;
    credibilidad_estimada: number;
    factores_credibilidad: any;
    antecedentes_paranormales: boolean;
    contacto_disponible: boolean;
    notas_testigo: string;
  };
  testigos_secundarios: any[];
  
  // Tabla: entidades_paranormales (23 columns)
  entidades_paranormales: any[];
  
  // Tabla: contexto_ambiental (17 columns)
  contexto_ambiental: {
    clima: string;
    temperatura: string;
    humedad: string;
    condiciones_luz: string;
    ruidos_ambiente: string;
    factores_externos: string;
    numero_personas: number;
    situacion_social: string;
    fase_lunar: string;
    festividad_religiosa: string;
    evento_historico: string;
    aniversario_especial: string;
    actividad_previa: string;
    estado_emocional: string;
    patron_temporal: boolean;
    hora_del_dia: string;
    estacion_año: string;
  };
  
  // Tabla: archivos_multimedia (23 columns)
  archivos_multimedia: any[];
  
  // Tabla: elementos_clave (7 columns)
  elementos_clave: string[];
  
  // Tabla: factores_credibilidad (13 columns)
  factores_credibilidad: {
    multiples_testigos: number;
    evidencia_fisica: number;
    consistencia_relatos: number;
    ubicacion_verificable: number;
    contexto_historico: number;
    sobriedad_testigo: number;
    conocimiento_previo: number;
    estado_emocional: number;
    motivaciones_secundarias: number;
    corroboracion_externa: number;
    documentacion_disponible: number;
  };
  
  // Tabla: derechos (9 columns)
  derechos: {
    derechos_uso: string;
    autorizacion_comercial: boolean;
    autorizacion_adaptacion: boolean;
    restricciones_uso: string;
    contacto_derechos: string;
    fecha_autorizacion: string;
    vigencia_derechos: string;
    notas_legales: string;
  };
  
  // Tabla: performance_esperado (7 columns)
  performance_esperado: {
    audiencia_objetivo: string;
    engagement_esperado: number;
    potencial_viral: number;
    impacto_emocional_esperado: number;
    duracion_interes_estimada: number;
    metricas_objetivo: any;
  };
}

export function useStoryManagement() {
  // Form state
  const [newStoryForm, setNewStoryForm] = useState<NewStoryFormData>({
    // Tabla: historias (55 columns)
    historias: {
      titulo_provisional: '',
      descripcion_corta: '',
      descripcion_larga: '',
      testimonio_completo: '',
      extracto_verbatim: '',
      historia_reescrita: '',
      suceso_principal_resumen: '',
      protagonistas_descripcion: '',
      fuente_relato: 'llamada_oyente',
      genero_principal: 'fantasmas_apariciones',
      epoca_historica: 'Contemporánea',
      nivel_credibilidad: 0,
      nivel_impacto: 1,
      ponderacion_impacto: 1,
      potencial_adaptacion: 1,
      nivel_verificacion: 'sin_verificar',
      longitud_extracto_palabras: 0,
      fecha_sucesos: 'Desconocido',
      fecha_evento_inicio: 'Desconocido',
      fecha_evento_fin: 'Desconocido',
      hora_evento: '',
      evento_recurrente: false,
      dificultad_produccion: 1,
      tiempo_produccion_estimado: 0,
      presupuesto_estimado: 0,
      contenido_sensible: false,
      advertencias: [],
      edad_minima_recomendada: 0,
      duracion_impacto_emocional: 'leve',
      banderas_rojas: [],
      notas_adicionales: '',
      duracion_evento_minutos: 0,
      patron_recurrencia: '',
      palabras_clave_patron: [],
      hash_similarity: '',
      codigo_unico: '',
      fecha_transcripcion: '',
      estado_procesamiento: 'extraida',
      publicar_inmediatamente: false
    },
    
    // Tabla: ubicaciones (24 columns)
    ubicacion: {
      pais: 'Colombia',
      codigo_pais: 'CO',
      nivel1_nombre: '',
      nivel1_codigo: '',
      nivel2_nombre: '',
      nivel2_codigo: '',
      nivel3_nombre: '',
      nivel4_nombre: '',
      latitud: null,
      longitud: null,
      precision_metros: 100,
      descripcion_lugar: '',
      lugar_especifico: '',
      tipo_lugar: '',
      zona_horaria: 'America/Bogota',
      altitud_metros: null,
      actividad_paranormal_reportada: false,
      numero_historias_reportadas: 0,
      primera_actividad_reportada: '',
      ultima_actividad_reportada: '',
      verificada: false,
      fuente_verificacion: '',
      departamento: '',
      municipio: ''
    },
    
    // Tabla: testigos (15 columns)
    testigo_principal: {
      tipo_testigo: 'principal',
      nombre_completo: '',
      pseudonimo: '',
      edad_aprox: 0,
      ocupacion: '',
      relacion_evento: '',
      presencial: true,
      credibilidad_estimada: 0,
      factores_credibilidad: {},
      antecedentes_paranormales: false,
      contacto_disponible: false,
      notas_testigo: ''
    },
    testigos_secundarios: [],
    
    // Tabla: entidades_paranormales (23 columns)
    entidades_paranormales: [],
    
    // Tabla: contexto_ambiental (17 columns)
    contexto_ambiental: {
      clima: '',
      temperatura: '',
      humedad: '',
      condiciones_luz: '',
      ruidos_ambiente: '',
      factores_externos: '',
      numero_personas: 1,
      situacion_social: '',
      fase_lunar: '',
      festividad_religiosa: '',
      evento_historico: '',
      aniversario_especial: '',
      actividad_previa: '',
      estado_emocional: '',
      patron_temporal: false,
      hora_del_dia: '',
      estacion_año: ''
    },
    
    // Tabla: archivos_multimedia (23 columns)
    archivos_multimedia: [],
    
    // Tabla: elementos_clave (7 columns)
    elementos_clave: [],
    
    // Tabla: factores_credibilidad (13 columns)
    factores_credibilidad: {
      multiples_testigos: 0,
      evidencia_fisica: 0,
      consistencia_relatos: 0,
      ubicacion_verificable: 0,
      contexto_historico: 0,
      sobriedad_testigo: 0,
      conocimiento_previo: 0,
      estado_emocional: 0,
      motivaciones_secundarias: 0,
      corroboracion_externa: 0,
      documentacion_disponible: 0
    },
    
    // Tabla: derechos (9 columns)
    derechos: {
      derechos_uso: '',
      autorizacion_comercial: false,
      autorizacion_adaptacion: false,
      restricciones_uso: '',
      contacto_derechos: '',
      fecha_autorizacion: '',
      vigencia_derechos: '',
      notas_legales: ''
    },
    
    // Tabla: performance_esperado (7 columns)
    performance_esperado: {
      audiencia_objetivo: '',
      engagement_esperado: 0,
      potencial_viral: 0,
      impacto_emocional_esperado: 0,
      duracion_interes_estimada: 0,
      metricas_objetivo: {}
    }
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // File states
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isLoadingJson, setIsLoadingJson] = useState(false);

  // Helper functions for secondary witnesses
  const addTestigoSecundario = () => {
    const nuevoTestigo = {
      tipo_testigo: 'secundario',
      nombre_completo: '',
      pseudonimo: '',
      edad_aprox: 0,
      ocupacion: '',
      relacion_evento: '',
      presencial: false,
      credibilidad_estimada: 0,
      factores_credibilidad: {},
      antecedentes_paranormales: false,
      contacto_disponible: false,
      notas_testigo: ''
    };
    
    setNewStoryForm(prev => ({
      ...prev,
      testigos_secundarios: [...prev.testigos_secundarios, nuevoTestigo]
    }));
  };

  const removeTestigoSecundario = (index: number) => {
    setNewStoryForm(prev => ({
      ...prev,
      testigos_secundarios: prev.testigos_secundarios.filter((_, i) => i !== index)
    }));
  };

  const updateTestigoSecundario = (index: number, field: string, value: any) => {
    setNewStoryForm(prev => {
      const updatedTestigos = [...prev.testigos_secundarios];
      updatedTestigos[index] = { ...updatedTestigos[index], [field]: value };
      return { ...prev, testigos_secundarios: updatedTestigos };
    });
  };

  // Validation function
  const validateStoryForm = (): boolean => {
    const errors: string[] = [];

    if (!newStoryForm.historias.titulo_provisional?.trim()) {
      errors.push('El título provisional es requerido');
    }

    if (!newStoryForm.historias.descripcion_corta?.trim()) {
      errors.push('La descripción corta es requerida');
    }

    if (!newStoryForm.historias.testimonio_completo?.trim()) {
      errors.push('El testimonio completo es requerido');
    }

    if (!newStoryForm.testigo_principal.pseudonimo?.trim()) {
      errors.push('El pseudónimo del testigo principal es requerido');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Clear form function
  const clearForm = () => {
    setNewStoryForm({
      // Reset to initial state... (same as above initial state)
      historias: {
        titulo_provisional: '',
        descripcion_corta: '',
        descripcion_larga: '',
        testimonio_completo: '',
        extracto_verbatim: '',
        historia_reescrita: '',
        suceso_principal_resumen: '',
        protagonistas_descripcion: '',
        fuente_relato: 'anonimo',
        genero_principal: 'fantasmas_apariciones',
        epoca_historica: 'Contemporánea',
        nivel_credibilidad: 0,
        nivel_impacto: 1,
        ponderacion_impacto: 1,
        potencial_adaptacion: 1,
        nivel_verificacion: 'sin_verificar',
        longitud_extracto_palabras: 0,
        fecha_sucesos: 'Desconocido',
        fecha_evento_inicio: 'Desconocido',
        fecha_evento_fin: 'Desconocido',
        hora_evento: '',
        evento_recurrente: false,
        dificultad_produccion: 1,
        tiempo_produccion_estimado: 0,
        presupuesto_estimado: 0,
        contenido_sensible: false,
        advertencias: [],
        edad_minima_recomendada: 0,
        duracion_impacto_emocional: 'leve',
        banderas_rojas: [],
        notas_adicionales: '',
        duracion_evento_minutos: 0,
        patron_recurrencia: '',
        palabras_clave_patron: [],
        hash_similarity: '',
        codigo_unico: '',
        fecha_transcripcion: '',
        estado_procesamiento: 'extraida',
        publicar_inmediatamente: false
      },
      ubicacion: {
        pais: 'Colombia',
        codigo_pais: 'CO',
        nivel1_nombre: '',
        nivel1_codigo: '',
        nivel2_nombre: '',
        nivel2_codigo: '',
        nivel3_nombre: '',
        nivel4_nombre: '',
        latitud: null,
        longitud: null,
        precision_metros: 100,
        descripcion_lugar: '',
        lugar_especifico: '',
        tipo_lugar: '',
        zona_horaria: 'America/Bogota',
        altitud_metros: null,
        actividad_paranormal_reportada: false,
        numero_historias_reportadas: 0,
        primera_actividad_reportada: '',
        ultima_actividad_reportada: '',
        verificada: false,
        fuente_verificacion: '',
        departamento: '',
        municipio: ''
      },
      testigo_principal: {
        tipo_testigo: 'principal',
        nombre_completo: '',
        pseudonimo: '',
        edad_aprox: 0,
        ocupacion: '',
        relacion_evento: '',
        presencial: true,
        credibilidad_estimada: 0,
        factores_credibilidad: {},
        antecedentes_paranormales: false,
        contacto_disponible: false,
        notas_testigo: ''
      },
      testigos_secundarios: [],
      entidades_paranormales: [],
      contexto_ambiental: {
        clima: '',
        temperatura: '',
        humedad: '',
        condiciones_luz: '',
        ruidos_ambiente: '',
        factores_externos: '',
        numero_personas: 1,
        situacion_social: '',
        fase_lunar: '',
        festividad_religiosa: '',
        evento_historico: '',
        aniversario_especial: '',
        actividad_previa: '',
        estado_emocional: '',
        patron_temporal: false,
        hora_del_dia: '',
        estacion_año: ''
      },
      archivos_multimedia: [],
      elementos_clave: [],
      factores_credibilidad: {
        multiples_testigos: 0,
        evidencia_fisica: 0,
        consistencia_relatos: 0,
        ubicacion_verificable: 0,
        contexto_historico: 0,
        sobriedad_testigo: 0,
        conocimiento_previo: 0,
        estado_emocional: 0,
        motivaciones_secundarias: 0,
        corroboracion_externa: 0,
        documentacion_disponible: 0
      },
      derechos: {
        derechos_uso: '',
        autorizacion_comercial: false,
        autorizacion_adaptacion: false,
        restricciones_uso: '',
        contacto_derechos: '',
        fecha_autorizacion: '',
        vigencia_derechos: '',
        notas_legales: ''
      },
      performance_esperado: {
        audiencia_objetivo: '',
        engagement_esperado: 0,
        potencial_viral: 0,
        impacto_emocional_esperado: 0,
        duracion_interes_estimada: 0,
        metricas_objetivo: {}
      }
    });
    
    setValidationErrors([]);
    setAudioFile(null);
    setImageFile(null);
    setJsonFile(null);
  };

  // File upload handler with real API integration
  const handleFileUpload = async (file: File, type: 'audio' | 'image'): Promise<void> => {
    setIsUploadingFiles(true);
    
    try {
      console.log(`Uploading ${type} file:`, file.name);
      
      // Upload via our API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      // Optional: add storyId and userId if available
      // formData.append('storyId', 'story_123');
      // formData.append('userId', 'user_456');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }
      
      const { data: uploadResult } = await response.json();
      
      // Auto-detect quality based on file size and type
      const autoQuality = file.size > 5000000 ? 'alta' : 
                         file.size > 1000000 ? 'media' : 'baja';
      
      // Create multimedia file entry with auto-populated fields
      const newMultimediaFile = {
        // ✅ Auto-populated fields from upload
        tipo_archivo: type === 'audio' ? 'audio' : 'imagen',
        nombre_archivo: uploadResult.originalName || file.name,
        url_archivo: uploadResult.secure_url, // Real Cloudinary URL appears immediately
        tamaño_bytes: uploadResult.originalSize || file.size,
        fecha_creacion: uploadResult.uploadDate,
        calidad_archivo: autoQuality,
        duracion_segundos: uploadResult.duration || 0,
        metadata_tecnica: {
          format: uploadResult.format,
          width: uploadResult.width || null,
          height: uploadResult.height || null,
          duration: uploadResult.duration || null,
          public_id: uploadResult.public_id,
          resource_type: uploadResult.resource_type,
          content_type: uploadResult.contentType,
          bytes: uploadResult.bytes
        },
        verificacion_autenticidad: 'no_verificado',
        acceso_publico: true,
        
        // ⚠️ Fields that need manual input (set to appropriate defaults)
        descripcion_archivo: type === 'audio' ? 'Audio del testimonio' : 'Imagen relacionada con la historia',
        fuente_archivo: '', // Empty, needs manual input
        derechos_autor: '', // Empty, needs manual input  
        evidencia_paranormal: false, // Default, can be changed
        relevancia_historia: 3, // Default medium relevance
        timestamp_evento: '', // Empty, needs manual input
        coordenadas_captura: '', // Empty, needs manual input
        dispositivo_captura: '', // Empty, needs manual input
        condiciones_captura: '', // Empty, needs manual input
        procesamiento_aplicado: '', // Empty, needs manual input
        analisis_experto: '', // Empty, needs manual input
        transcripcion_texto: '', // Empty, needs manual input for audio
        palabras_clave: [] // Can be populated later
      };
      
      // Add to the multimedia files array
      setNewStoryForm(prev => ({
        ...prev,
        archivos_multimedia: [...prev.archivos_multimedia, newMultimediaFile]
      }));
      
      console.log('File uploaded successfully:', uploadResult.secure_url);
      alert(`✅ Archivo subido exitosamente!\n\nURL: ${uploadResult.secure_url}\n\nLos campos se han rellenado automáticamente. Revisa y completa la información faltante.`);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`❌ Error al subir archivo: ${error.message}`);
    } finally {
      setIsUploadingFiles(false);
    }
  };

  // JSON load handler
  const handleJsonLoad = async (file: File): Promise<void> => {
    setIsLoadingJson(true);
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Handle structured JSON template (with sections) or flat JSON
      const historyData = jsonData.historias || jsonData;
      const locationData = jsonData.ubicacion || {};
      const mainWitness = jsonData.testigo_principal || {};
      const secondaryWitnesses = jsonData.testigos_secundarios || [];
      const paranormalEntities = jsonData.entidades_paranormales || [];
      const environmentalContext = jsonData.contexto_ambiental || {};
      const socialContext = jsonData.contexto_social || {};
      const temporalContext = jsonData.contexto_temporal_astronomico || {};
      const culturalContext = jsonData.contexto_cultural_religioso || {};
      const multimediaFiles = jsonData.archivos_multimedia || [];
      const keyElements = jsonData.elementos_clave || [];
      const credibilityFactors = jsonData.factores_credibilidad || {};
      const rights = jsonData.derechos || {};
      const performance = jsonData.performance_esperado || {};
      
      // Map JSON data to form structure with comprehensive mapping
      setNewStoryForm(prev => ({
        ...prev,
        historias: {
          ...prev.historias,
          titulo_provisional: historyData.titulo_provisional || historyData.titulo || '',
          descripcion_corta: historyData.descripcion_corta || '',
          descripcion_larga: historyData.descripcion_larga || '',
          testimonio_completo: historyData.testimonio_completo || '',
          extracto_verbatim: historyData.extracto_verbatim || '',
          historia_reescrita: historyData.historia_reescrita || '',
          suceso_principal_resumen: historyData.suceso_principal_resumen || '',
          protagonistas_descripcion: historyData.protagonistas_descripcion || '',
          fuente_relato: historyData.fuente_relato || 'anonimo',
          genero_principal: historyData.genero_principal || 'fantasmas_apariciones',
          epoca_historica: historyData.epoca_historica || 'Contemporánea',
          nivel_credibilidad: historyData.nivel_credibilidad || 0,
          nivel_impacto: historyData.nivel_impacto || historyData.ponderacion_impacto || 1,
          ponderacion_impacto: historyData.ponderacion_impacto || 1,
          potencial_adaptacion: historyData.potencial_adaptacion || 1,
          nivel_verificacion: historyData.nivel_verificacion || 'sin_verificar',
          fecha_sucesos: historyData.fecha_sucesos || 'Desconocido',
          fecha_evento_inicio: historyData.fecha_evento_inicio || 'Desconocido',
          fecha_evento_fin: historyData.fecha_evento_fin || 'Desconocido',
          hora_evento: historyData.hora_evento || '',
          evento_recurrente: historyData.evento_recurrente || false,
          contenido_sensible: historyData.contenido_sensible || false,
          edad_minima_recomendada: historyData.edad_minima_recomendada || 0,
          duracion_impacto_emocional: historyData.duracion_impacto_emocional || 'leve',
          notas_adicionales: historyData.notas_adicionales || '',
          duracion_evento_minutos: historyData.duracion_evento_minutos || 0,
          patron_recurrencia: historyData.patron_recurrencia || '',
          palabras_clave_patron: historyData.palabras_clave_patron || [],
          hash_similarity: historyData.hash_similarity || '',
          codigo_unico: historyData.codigo_unico || '',
          fecha_transcripcion: historyData.fecha_transcripcion || '',
          estado_procesamiento: historyData.estado_procesamiento || 'extraida',
          publicar_inmediatamente: historyData.publicar_inmediatamente || false,
          advertencias: historyData.advertencias || [],
          banderas_rojas: historyData.banderas_rojas || [],
          dificultad_produccion: historyData.dificultad_produccion || 1,
          tiempo_produccion_estimado: historyData.tiempo_produccion_estimado || 0,
          presupuesto_estimado: historyData.presupuesto_estimado || 0,
          longitud_extracto_palabras: historyData.longitud_extracto_palabras || 0
        },
        ubicacion: {
          ...prev.ubicacion,
          pais: locationData.pais || 'Colombia',
          codigo_pais: locationData.codigo_pais || 'CO',
          nivel1_nombre: locationData.nivel1_nombre || locationData.departamento || '',
          nivel1_codigo: locationData.nivel1_codigo || '',
          nivel2_nombre: locationData.nivel2_nombre || locationData.municipio || locationData.ciudad || '',
          nivel2_codigo: locationData.nivel2_codigo || '',
          nivel3_nombre: locationData.nivel3_nombre || locationData.zona || '',
          nivel4_nombre: locationData.nivel4_nombre || locationData.barrio || '',
          descripcion_lugar: locationData.descripcion_lugar || locationData.descripcion || '',
          lugar_especifico: locationData.lugar_especifico || '',
          tipo_lugar: locationData.tipo_lugar || locationData.tipo || '',
          latitud: locationData.latitud || null,
          longitud: locationData.longitud || null,
          precision_metros: locationData.precision_metros || 100,
          zona_horaria: locationData.zona_horaria || 'America/Bogota',
          altitud_metros: locationData.altitud_metros || null,
          actividad_paranormal_reportada: locationData.actividad_paranormal_reportada || false,
          numero_historias_reportadas: locationData.numero_historias_reportadas || 0,
          primera_actividad_reportada: locationData.primera_actividad_reportada || '',
          ultima_actividad_reportada: locationData.ultima_actividad_reportada || '',
          verificada: locationData.verificada || false,
          fuente_verificacion: locationData.fuente_verificacion || '',
          departamento: locationData.departamento || locationData.nivel1_nombre || '',
          municipio: locationData.municipio || locationData.nivel2_nombre || ''
        },
        testigo_principal: {
          ...prev.testigo_principal,
          tipo_testigo: mainWitness.tipo_testigo || 'principal',
          nombre_completo: mainWitness.nombre_completo || '',
          pseudonimo: mainWitness.pseudonimo || '',
          edad_aprox: mainWitness.edad_aprox || mainWitness.edad || 0,
          ocupacion: mainWitness.ocupacion || '',
          relacion_evento: mainWitness.relacion_evento || '',
          presencial: mainWitness.presencial ?? true,
          credibilidad_estimada: mainWitness.credibilidad_estimada || mainWitness.credibilidad || 0,
          factores_credibilidad: mainWitness.factores_credibilidad || {},
          antecedentes_paranormales: mainWitness.antecedentes_paranormales || false,
          contacto_disponible: mainWitness.contacto_disponible || false,
          notas_testigo: mainWitness.notas_testigo || mainWitness.notas || ''
        },
        testigos_secundarios: (secondaryWitnesses || []).map((witness: any) => ({
          ...witness,
          notas_testigo: witness.notas_testigo || witness.notas || ''
        })),
        entidades_paranormales: (paranormalEntities || []).map((entity: any) => ({
          ...entity,
          tipo_entidad: entity.tipo_entidad || entity.tipo || '',
          nombre_entidad: entity.nombre_entidad || entity.Nombre_Entidad || '',
          descripcion_fisica: entity.descripcion_fisica || entity.Descripcion_Fisica || entity.descripcion || '',
          nivel_agresividad: entity.nivel_agresividad || entity.Nivel_Agresividad || 0,
          horarios_actividad: entity.horarios_actividad || entity.Horarios_Actividad || '',
          consistencia_apariciones: entity.consistencia_apariciones || entity.Consistencia_Aparicion || 0,
          patron_movimiento: entity.patron_movimiento || entity.Patron_Movimiento || '',
          reaccion_presencia_humana: entity.reaccion_presencia_humana || entity.Reaccion_Presencia_Humana || '',
          olores_asociados: entity.olores_asociados || entity.Olores_Asociados || '',
          sonidos_caracteristicos: entity.sonidos_caracteristicos || entity.Sonidos_Caracteristicos || '',
          objetos_afectados: entity.objetos_afectados || entity.Objetos_Afectados || '',
          historia_previa_lugar: entity.historia_previa_lugar || entity.Historia_Previa_Lugar || '',
          vinculos_emocionales: entity.vinculos_emocionales || entity.Vinculos_Emocionales || '',
          metodos_interaccion: entity.metodos_interaccion || entity.Metodos_Interaccion || '',
          respuesta_rituales: entity.respuesta_rituales || entity.Respuesta_Rituales || '',
          evidencia_fisica_dejada: entity.evidencia_fisica_dejada || entity.Evidencia_Fisica_Dejada || ''
        })),
        contexto_ambiental: {
          ...prev.contexto_ambiental,
          // Condiciones atmosféricas
          clima: environmentalContext.clima || '',
          temperatura: environmentalContext.temperatura || '',
          humedad: environmentalContext.humedad || '',
          condiciones_luz: environmentalContext.condiciones_luz || '',
          ruidos_ambiente: environmentalContext.ruidos_ambiente || '',
          factores_externos: environmentalContext.factores_externos || '',
          // Contexto social (puede venir de contexto_ambiental o contexto_social)
          numero_personas: socialContext.numero_personas || environmentalContext.numero_personas || 1,
          situacion_social: socialContext.situacion_social || environmentalContext.situacion_social || '',
          estado_emocional: socialContext.estado_emocional || environmentalContext.estado_emocional || '',
          actividad_previa: socialContext.actividad_previa || environmentalContext.actividad_previa || '',
          // Contexto temporal (puede venir de contexto_ambiental o contexto_temporal_astronomico)
          fase_lunar: temporalContext.fase_lunar || environmentalContext.fase_lunar || '',
          hora_del_dia: temporalContext.hora_del_dia || environmentalContext.hora_del_dia || '',
          estacion_año: temporalContext.estacion_año || environmentalContext.estacion_año || '',
          patron_temporal: temporalContext.patron_temporal || environmentalContext.patron_temporal || false,
          // Contexto cultural (puede venir de contexto_ambiental o contexto_cultural_religioso)
          festividad_religiosa: culturalContext.festividad_religiosa || environmentalContext.festividad_religiosa || '',
          evento_historico: culturalContext.evento_historico || environmentalContext.evento_historico || '',
          aniversario_especial: culturalContext.aniversario_especial || environmentalContext.aniversario_especial || ''
        },
        elementos_clave: keyElements || [],
        archivos_multimedia: multimediaFiles || [],
        factores_credibilidad: credibilityFactors || {},
        derechos: rights || {},
        performance_esperado: performance || {}
      }));
      
      alert('JSON cargado exitosamente');
      
    } catch (error) {
      console.error('Error loading JSON:', error);
      alert('Error al cargar el archivo JSON: ' + error.message);
    } finally {
      setIsLoadingJson(false);
    }
  };

  // Download JSON template
  const downloadJsonTemplate = () => {
    const template = {
      // ✅ Incluir primero los comentarios de documentación
      ...templateWithComments,
      
      // ✅ Luego los datos reales del formulario
      historias: newStoryForm.historias,
      ubicacion: newStoryForm.ubicacion,
      testigo_principal: newStoryForm.testigo_principal,
      testigos_secundarios: newStoryForm.testigos_secundarios,
      entidades_paranormales: newStoryForm.entidades_paranormales,
      contexto_ambiental: newStoryForm.contexto_ambiental,
      archivos_multimedia: newStoryForm.archivos_multimedia,
      elementos_clave: newStoryForm.elementos_clave,
      factores_credibilidad: newStoryForm.factores_credibilidad,
      derechos: newStoryForm.derechos,
      performance_esperado: newStoryForm.performance_esperado
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historia-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Create new story
  const createNewStory = async (): Promise<void> => {
    if (!validateStoryForm()) {
      return;
    }
    
    setIsSubmittingStory(true);
    
    try {
      // In a real implementation, you would send this to your API
      console.log('Creating new story:', newStoryForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Historia creada exitosamente!');
      clearForm();
      
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Error al crear la historia');
    } finally {
      setIsSubmittingStory(false);
    }
  };

  return {
    // State
    newStoryForm,
    setNewStoryForm,
    validationErrors,
    audioFile,
    setAudioFile,
    imageFile,
    setImageFile,
    isUploadingFiles,
    isSubmittingStory,
    jsonFile,
    setJsonFile,
    isLoadingJson,
    
    // Functions
    addTestigoSecundario,
    removeTestigoSecundario,
    updateTestigoSecundario,
    validateStoryForm,
    clearForm,
    handleFileUpload,
    handleJsonLoad,
    downloadJsonTemplate,
    createNewStory
  };
}
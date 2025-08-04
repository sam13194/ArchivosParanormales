import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/admin/historias/bulk - Crear múltiples historias desde JSON
export async function POST(request: NextRequest) {
  try {
    const { historias, admin_uid } = await request.json();
    
    if (!historias || !Array.isArray(historias) || historias.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de historias' },
        { status: 400 }
      );
    }
    
    if (!admin_uid) {
      return NextResponse.json(
        { error: 'Se requiere admin_uid' },
        { status: 400 }
      );
    }
    
    const resultados = [];
    const errores = [];
    
    for (let i = 0; i < historias.length; i++) {
      const historia = historias[i];
      
      try {
        // Usar la misma lógica que el endpoint individual
        const response = await fetch(`${request.nextUrl.origin}/api/admin/historias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...historia,
            admin_uid,
            publicar_inmediatamente: historia.publicar_inmediatamente ?? true
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          resultados.push({
            index: i,
            titulo: historia.titulo,
            success: true,
            historia_id: result.historia?.id,
            codigo_unico: result.historia?.codigo_unico
          });
        } else {
          errores.push({
            index: i,
            titulo: historia.titulo || `Historia ${i + 1}`,
            error: result.error || 'Error desconocido'
          });
        }
        
      } catch (error) {
        errores.push({
          index: i,
          titulo: historia.titulo || `Historia ${i + 1}`,
          error: `Error procesando: ${error}`
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      total_procesadas: historias.length,
      exitosas: resultados.length,
      con_errores: errores.length,
      resultados,
      errores
    });
    
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET /api/admin/historias/bulk/template - Descargar plantilla JSON
export async function GET(request: NextRequest) {
  try {
    const plantilla = {
      historias: [
        {
          // Información básica
          titulo: "El Fantasma del Hotel [Ejemplo]",
          descripcion_corta: "Breve descripción de la historia paranormal",
          testimonio_completo: "Testimonio completo del testigo principal con todos los detalles",
          extracto_verbatim: "\"Escuché pasos en el pasillo, pero no había nadie allí\"",
          historia_reescrita: "Versión adaptada para producción",
          
          // Análisis
          fuente_relato: "llamada_oyente", // llamada_oyente, email, redes_sociales, presencial
          genero_principal: "fantasmas_apariciones", // fantasmas_apariciones, poltergeist, ovnis, criptozoologia
          nivel_credibilidad: 7, // 1-10
          nivel_impacto: 6, // 1-10  
          nivel_verificacion: "testimonio_unico", // testimonio_unico, multiples_testigos, evidencia_fisica
          
          // Ubicación
          ubicacion: {
            pais: "Colombia",
            codigo_pais: "CO",
            departamento: "Cundinamarca", // o "Desconocido"
            nivel1_codigo: "25",
            ciudad: "Bogotá", // o "Desconocido"
            nivel2_codigo: "25001",
            zona: "Centro Histórico", // o "Desconocido"
            nivel4_nombre: "Barrio La Candelaria",
            descripcion_lugar: "Hotel histórico del centro", // o "Desconocido"
            tipo_lugar: "hotel", // o "Desconocido"
            latitud: 4.5981,
            longitud: -74.0758,
            precision_metros: 100,
            zona_horaria: "America/Bogota",
            altitud_metros: 2640
          },
          
          // Fechas y tiempo
          fecha_sucesos: "2024-01-15", // o "Desconocido"
          hora_evento: "23:30:00",
          duracion_evento_minutos: 30,
          
          // Testigos
          testigo_principal: {
            pseudonimo: "María G.",
            edad: "35-40 años",
            ocupacion: "Recepcionista",
            relacion_evento: "Testigo directo durante turno nocturno",
            presencial: true,
            credibilidad: 8,
            factores_credibilidad: {
              consistencia_relato: "alta",
              estado_sobriedad: "sobrio",
              experiencias_previas: false
            },
            antecedentes_paranormales: false,
            contacto_disponible: true,
            notas: "Empleada con 5 años de experiencia, relato consistente"
          },
          
          testigos_secundarios: [
            {
              pseudonimo: "Carlos R.",
              edad: "45-50 años",
              ocupacion: "Guardia de seguridad",
              relacion_evento: "Confirmó sonidos extraños",
              presencial: true,
              credibilidad: 7,
              antecedentes_paranormales: true,
              contacto_disponible: false,
              notas: "Reportes similares en el pasado"
            }
          ],
          
          // Entidades paranormales
          entidades_reportadas: [
            {
              nombre: "Dama de Gris",
              tipo: "fantasma",
              descripcion_fisica: "Mujer elegante de mediana edad, vestido gris largo",
              comportamiento: "Camina por pasillos, desaparece al ser vista",
              hostilidad: 1, // 1-5 (1=pacífico, 5=hostil)
              genero: "femenino",
              edad_min: 35,
              edad_max: 45,
              vestimenta: "Vestido gris de época, años 1940s",
              caracteristicas: "Transparente, no hace ruido al caminar",
              patron_comportamiento: "Aparece entre 11 PM y 3 AM",
              triggers: ["aniversario_muerte", "huespedes_sensibles"],
              palabras_clave: ["dama_gris", "mujer_elegante", "vestido_largo"]
            }
          ],
          
          // Contexto ambiental
          contexto_ambiental: {
            clima: "Noche despejada",
            temperatura: 14,
            humedad: 65,
            numero_personas: 3,
            situacion_social: "Turno nocturno normal del hotel",
            fase_lunar: "Luna llena",
            festividad_religiosa: "Ninguna",
            evento_historico: "Aniversario del hotel (80 años)",
            aniversario_especial: "Muerte de la antigua propietaria",
            actividad_previa: "Check-in de huéspedes, limpieza de habitaciones",
            estado_emocional: "Calma inicial, tensión después del avistamiento",
            patron_temporal: false
          },
          
          // Producción
          dificultad_produccion: 3, // 1-5
          tiempo_estimado_produccion: 180, // segundos
          recursos_necesarios: ["musica_ambiente", "efectos_sonoros", "narracion_dramatizada"],
          presupuesto_estimado: 25000, // COP
          
          // Archivos (URLs de Cloudinary después de subir)
          audio_url: "", // Se llenará después de la subida
          imagen_url: "", // Se llenará después de la subida
          
          // Campos adicionales opcionales
          epoca_historica: "Contemporánea",
          protagonistas_descripcion: "Personal nocturno del hotel",
          palabras_clave_patron: ["hotel", "fantasma", "dama_gris", "pasillos"],
          duracion_impacto_emocional: "media",
          notas_adicionales: "Historia reportada múltiples veces por diferentes empleados",
          
          // Factores de credibilidad (se calculan automáticamente pero se pueden especificar)
          evidencia_fisica: 2, // 1-5
          consistencia_relatos: 4, // 1-5
          contexto_historico: 4, // 1-5
          sobriedad_testigo: 5, // 1-5
          conocimiento_previo: 2, // 1-5
          estado_emocional_factor: 4, // 1-5
          banderas_rojas: [], // Array de strings con posibles inconsistencias
          
          // Performance y audiencia
          audiencia_objetivo: "general", // general, joven_adulto, adulto, premium
          engagement_esperado: "alto", // bajo, medio, alto
          
          // Derechos
          derechos_uso: "permiso_verbal", // permiso_verbal, contrato_firmado, dominio_publico
          autorizacion_comercial: true,
          autorizacion_adaptacion: true,
          restricciones_uso: "Mantener anonimato de testigos",
          contacto_derechos: "admin@archivos-paranormales.com",
          
          // Subgéneros (IDs que deben existir en la tabla subgeneros)
          subgeneros: [1, 3], // Por ejemplo: [1=Fantasmas, 3=Hoteles Embrujados]
          
          // Control de publicación
          publicar_inmediatamente: true
        }
      ]
    };
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', 'attachment; filename="plantilla_historias_archivos_paranormales.json"');
    
    return new Response(JSON.stringify(plantilla, null, 2), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Template download error:', error);
    return NextResponse.json(
      { error: 'Error generando plantilla' },
      { status: 500 }
    );
  }
}
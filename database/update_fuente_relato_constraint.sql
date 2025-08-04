-- Actualizar constraint de fuente_relato para incluir más opciones
-- Eliminar constraint existente
ALTER TABLE historias DROP CONSTRAINT IF EXISTS historias_fuente_relato_check;

-- Agregar nuevo constraint con opciones ampliadas
ALTER TABLE historias ADD CONSTRAINT historias_fuente_relato_check 
CHECK (fuente_relato IN (
  'llamada_oyente',
  'historia_programa', 
  'investigacion_propia',
  'anonimo',
  'redes_sociales',
  'correo_electronico',
  'entrevista_presencial',
  'testimonio_escrito',
  'tercera_persona',
  'archivo_historico',
  'periodico_local',
  'transmision_tv'
));

-- Verificar que el constraint se aplicó correctamente
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'historias_fuente_relato_check';
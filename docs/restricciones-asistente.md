# Restricciones para el Asistente de IA

## Comandos Git - NO EJECUTAR

El asistente **NO DEBE** ejecutar comandos git directamente. En su lugar:

- ✅ Proporcionar los comandos para que el usuario los ejecute
- ✅ Explicar qué hace cada comando
- ❌ NO ejecutar: `git commit`, `git push`, `git pull`, `git merge`, etc.

### Razón
- Permite al usuario revisar los cambios antes de confirmarlos
- Evita commits o pushes accidentales
- Mantiene control sobre el historial del repositorio

## Otros Comandos Sensibles

- ❌ Comandos que modifiquen configuración de git
- ❌ Comandos que eliminen archivos permanentemente
- ❌ Operaciones que requieran autenticación externa

## Seguridad

- ✅ Analizar archivos de credenciales para detectar secretos
- ✅ Sugerir mejores prácticas de seguridad
- ❌ NO exponer credenciales en logs o comentarios
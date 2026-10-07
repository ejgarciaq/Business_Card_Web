# AGENTS.md — Reglas de Revisión y Buenas Prácticas

## 1. Idioma y Formato de Respuesta
- **Idioma:** Todas las observaciones, sugerencias y explicaciones deben redactarse estrictamente en **español**.
- **Tono:** Directo, constructivo y enfocado en la calidad del código.

## 2. Calidad de Código y Mantenibilidad
- **Sintaxis Moderna:** Priorizar ES6+, `async/await`, desestructuración y programación funcional declarativa.
- **Limpieza de Código:**
  - Señalar y solicitar la eliminación de `console.log`, comentarios de depuración (`// TODO` huérfanos) o código muerto/no utilizado.
  - Verificar que no existan variables ni importaciones no utilizadas (*unused imports*).
- **Tipado e Interfaces:** Si se usa TypeScript, exigir tipos explícitos en lugar de `any`. Definir interfaces/tipos claros para las `props` de componentes.

## 3. Arquitectura y Componentes (React / Web)
- **Componentes Pequeños:** Promover el principio de responsabilidad única (SRP). Si un componente crece demasiado, sugerir su modularización.
- **Rendimiento:**
  - Evitar renderizados innecesarios.
  - Sugerir el uso adecuado de hooks (`useMemo`, `useCallback`, `useEffect` con dependencias correctas).
- **Estilos:** Priorizar el uso consistente de utilidades de diseño (como Tailwind CSS) en lugar de estilos inline o CSS embebido redundante.

## 4. Seguridad
- **Credenciales y Tokens:** Alertar de inmediato si se detecta cualquier API key, contraseña, secret o token quemado en el código (*hardcoded*).
- **Inyección y Manejo de Datos:** Validar que la entrada de usuario no genere vulnerabilidades de inyección o renderizado XSS no desinfectado (`dangerouslySetInnerHTML`).

## 5. Manejo de Errores
- **Estructura Robusta:** Asegurar el uso adecuado de bloques `try/catch` en llamadas asíncronas y peticiones HTTP.
- **Retroalimentación al Usuario:** Garantizar que los errores sean capturados y devuelvan mensajes descriptivos o estados de error amigables.
# Informe de Diseño Responsivo e Identidad Visual

Este documento detalla los cambios realizados para asegurar que la plataforma sea 100% accesible en dispositivos móviles y cuente con una identidad visual profesional y consistente.

## 📱 Adaptabilidad Móvil (Responsive)

### Sidebar y Navegación
- **Header Móvil:** Se implementó un encabezado fijo para dispositivos móviles con el logo oficial y un menú tipo hamburguesa.
- **Menú Desplegable:** Sistema de navegación lateral para móviles con animaciones fluidas (`framer-motion`) y fondo desenfocado (`backdrop-blur`).
- **Layout Adaptativo:** Uso de `flex-col` en móviles y `flex-row` en escritorio para el layout global de la aplicación.

### Tablas y Grillas
- **Comparador:** Rediseño de la tabla de comparación. En móviles, los datos se apilan verticalmente con etiquetas de banco claras, eliminando el scroll horizontal difícil de usar.
- **Grillas Flexibles:** Todas las secciones de tarjetas (Bancos, Divisas, Variables) ahora ajustan automáticamente el número de columnas (de 1 a 4) según el ancho de la pantalla.
- **Buscadores:** El componente `SearchBar` fue optimizado con paddings y tamaños de fuente variables para mejorar la usabilidad táctil.

## 🎨 Identidad Visual y UI/UX

### Branding Oficial
- **Logo Procesado:** Integración del logo oficial de OPEN BCRA. Se realizó un recorte técnico de los espacios en blanco y optimización de resolución.
- **Favicon:** Generación de íconos de sistema para navegadores y accesos directos.
- **Sidebar Footer:** Inclusión de la versión de la aplicación (v0.2.0) vinculada automáticamente al `package.json`.

### Unificación Estética
- **Consistencia de Tarjetas:** Se unificó el diseño de las tarjetas de **Estadísticas Cambiarias** y **Estadísticas Monetarias**. Ahora comparten:
  - Estructura de encabezado e íconos.
  - Escala tipográfica para valores y unidades.
  - Badges de periodicidad y origen de datos.
- **Ancho Expandido:** El contenedor principal se amplió a `max-w-[1600px]` para aprovechar monitores Ultra-Wide en entornos de escritorio profesionales.

## ⚙️ Mejoras Técnicas
- **TypeScript Safety:** Revisión exhaustiva de tipos opcionales en todos los componentes para evitar errores durante el proceso de construcción en producción.
- **Configuración de Entorno:** Inyección de variables de versión en `next.config.ts`.
- **Docker Ready:** Optimización del `Dockerfile` para el modo standalone de Next.js.

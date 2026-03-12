# OPEN BCRA - Régimen de Transparencia

Aplicación web moderna para la consulta y comparación de productos financieros basada en los datos abiertos del Banco Central de la República Argentina (BCRA).

## 🚀 Mejoras Implementadas

### 1. Visualización Detallada de Productos
Se rediseñó la página de detalle de cada entidad para exponer la totalidad de los datos provistos por la API:
- **Préstamos:** Identificación por tipo (Personal, Prendario, Hipotecario), visualización de TEA, CFT, montos máximos, plazos y requisitos de ingreso/antigüedad.
- **Plazos Fijos:** Detalle de tasas, inversión mínima, plazos y canal de constitución (Home Banking vs. Sucursal).
- **Tarjetas de Crédito:** Comisiones de renovación, mantenimiento, tasas de financiación y adelanto.
- **Paquetes:** Composición detallada de los combos bancarios y costos asociados.
- **Cuentas:** Información sobre moneda y procesos de apertura simplificada.

### 2. Sistema de Filtros Inteligentes
- **Página de Detalle:** Navegación por categorías mediante botones interactivos que permiten filtrar productos sin recargar la página.
- **Dashboard Principal:** Comparativa de Plazos Fijos con filtros por moneda (Pesos, UVA, Dólares) y deduplicación automática para mostrar solo la mejor tasa por cada banco.

### 3. Comparador de Entidades
- Herramienta de comparación "cara a cara" entre dos entidades financieras.
- Resaltado automático de la "Mejor Opción" basado en lógica financiera (menor tasa en préstamos/tarjetas, mayor tasa en plazos fijos).
- Organización por pestañas técnicas.

### 4. Identidad Visual y UI/UX
- **Mapeo de Logos:** Corrección exhaustiva de los códigos de entidad del BCRA para vincular correctamente los logos SVG de cada banco y billetera digital.
- **Layout:** Diseño basado en grillas responsivas (hasta 3 columnas) para facilitar la lectura de datos técnicos.
- **Consistencia:** Uso de iconografía de Lucide-React para cada campo técnico.

## 🛠️ Tecnologías
- **Frontend:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Datos:** API Pública de Transparencia del BCRA

## 📂 Estructura de Datos de Logos
Los logos se encuentran en `public/logos/` y el mapeo lógico en `src/data/logos.ts`, utilizando los códigos internos de la API de Transparencia (ej. Santander: 72, BBVA: 17).

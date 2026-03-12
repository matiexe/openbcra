# OPEN BCRA - Régimen de Transparencia 🇦🇷

Una plataforma moderna, rápida y detallada para consultar y comparar productos financieros en Argentina, utilizando datos oficiales del **Banco Central de la República Argentina (BCRA)**.

![Versión](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)

## 🎯 Propósito
Este proyecto democratiza el acceso a la información financiera, permitiendo a los usuarios comparar tasas de plazos fijos, costos de tarjetas de crédito y condiciones de préstamos de manera clara y profesional.

## ✨ Características Principales

- 🏦 **Directorio de Entidades:** Listado completo de bancos y PSPs con sus respectivos logos e identidad visual.
- 📊 **Dashboard de Plazos Fijos:** Comparativa en tiempo real con filtros por moneda (Pesos, UVA, USD) y ordenamiento inteligente por mejor tasa (TEA).
- 🔄 **Comparador Cara a Cara:** Herramienta interactiva para enfrentar dos entidades y determinar cuál ofrece mejores condiciones según el producto.
- 📋 **Detalle Técnico Exhaustivo:** Acceso a datos de "letra chica" como CFT, cargos por cancelación, requisitos de ingreso y tipos de tasa.
- 🔍 **Consulta Crediticia:** Integración con los servicios de deudores y cheques rechazados del BCRA.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes de Cliente:** Framer Motion (Animaciones)
- **Iconografía:** Lucide React
- **Fuentes:** Geist (Sans & Mono)

## 🚀 Instalación y Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📂 Estructura del Proyecto

- `src/app`: Rutas y páginas de la aplicación.
- `src/components`: Componentes reutilizables y lógica de cliente.
- `src/services`: Integración con la API de Transparencia del BCRA.
- `src/data`: Mapeos de logos y constantes de entidades.
- `public/logos`: Repositorio de logos bancarios en formato SVG.

## 📄 Documentación Adicional
Para más detalles sobre las funcionalidades implementadas y la arquitectura técnica, consulte la carpeta `/docs`.

---
*Datos provistos por el Régimen de Transparencia del BCRA.*

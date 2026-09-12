# Salfa · Suite de Prevención

Aplicaciones web independientes (sin backend, sin build step) y formatos de registro para prevención de riesgos en terreno.

## Estructura

```
salfa-prevencion/
├── index.html              # Página de inicio, enlaza a ambas apps
├── fatiga/
│   └── index.html          # Turno·Seguro — control de fatiga y test de reacción
├── checklist/
│   └── index.html          # HSE Montajes — checklist pre-uso con firma digital
└── formatos/
    └── CC-146-Registro-Verificacion-Segregacion-SUSPEL.xlsx   # Registro mensual de segregación SUSPEL
```

## Apps

### 🟡 Turno·Seguro — `/fatiga`
Autoevaluación de fatiga antes de operar maquinaria: horas de sueño, nivel de energía y un test de tiempo de reacción. Calcula un score de riesgo (apto / moderado / alto) y lleva un historial de turno en memoria (se reinicia al recargar la página).

### 🟠 HSE Montajes — `/checklist`
Checklist de inspección pre-uso de herramientas (RUT, área, 3 puntos de control) con firma digital en canvas. Guarda los registros en `localStorage` del navegador como cola offline, y simula sincronización a un backend cuando hay conexión.

**Nota:** ambas apps son prototipos front-end. El checklist no envía datos a ningún servidor real — el botón "Sincronizar" simula el envío y vacía la cola local. Para producción real, hay que reemplazar esa simulación por una llamada a una API.

### 🔴 CC-146 · Registro de segregación SUSPEL — `/formatos`
Planilla Excel (`.xlsx`) para el **registro mensual de verificación de segregación de sustancias peligrosas (SUSPEL)** según la Tabla de Incompatibilidades Químicas (clases 1 a 9), con registro fotográfico. Hojas del libro:

- **Portada**: código del documento (CC-146), leyenda de colores e instrucciones de uso.
- **Tabla Incompatibilidad**: matriz de referencia de las 14 clases de riesgo, coloreada igual que la tabla de incompatibilidad (rojo = peligro / amarillo = precaución / verde = sin incompatibilidad).
- **Registro CC-146**: formulario mensual — datos generales, verificación de segregación por par de clases presentes en la bodega (el nivel de riesgo se calcula automáticamente con una fórmula `INDEX/MATCH` contra la Tabla Incompatibilidad), condiciones generales de segregación y firmas.
- **Registro Fotográfico**: bloques para pegar la evidencia fotográfica mensual (mínimo 1 fotografía por verificación).
- **Seguimiento Mensual**: control de cumplimiento del registro mes a mes (Enero a Diciembre).

Las celdas con fondo ámbar son las que se deben completar cada mes; no modificar las fórmulas de la columna "Nivel según tabla".

## Cómo correrlas localmente

No requieren instalación ni dependencias — son HTML/CSS/JS puro (usan Tailwind y Google Fonts vía CDN, así que necesitas conexión a internet la primera vez que cargan).

```bash
# Opción 1: abrir directamente
open index.html

# Opción 2: servidor local simple
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

## Deploy en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En "Source", selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda — GitHub te dará una URL tipo `https://tu-usuario.github.io/tu-repo/`.

## Stack

- HTML + Tailwind CSS (CDN) + CSS custom (variables, tipografía Barlow Condensed / Inter / IBM Plex Mono vía Google Fonts)
- JavaScript vanilla, sin frameworks
- Persistencia: `localStorage` (solo en el checklist)

## Pendientes para producción

- [ ] Reemplazar la simulación de sync por una API real (REST o similar)
- [ ] Autenticación de operadores/supervisores
- [ ] Notificación real a supervisor en caso de "Alto riesgo" en Turno·Seguro
- [ ] Persistir historial de Turno·Seguro (hoy se pierde al recargar)
- [ ] Compresión de la firma (el `dataURL` del canvas puede pesar bastante en `localStorage`)

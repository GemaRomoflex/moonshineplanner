# Moonshine Flow Manager — Control de Pedidos y Planificación 24/7

Sistema integral de administración de pedidos, secuenciación automática por turnos y catálogo de 83 estructuras con gestión de técnicos, portal de aprobación del supervisor e integración a **GitHub Pages**, **SharePoint**, **PowerApps**, **Outlook** y **SketchUp**.

---

## 🚀 Despliegue e Inicio Rápido

### 1. Despliegue en la Nube con GitHub Pages (Sin Servidor — Recomendado)
La aplicación está diseñada con arquitectura estática moderna (HTML5, Tailwind y JavaScript ES6), por lo que **no requiere ningún servidor local** ni tener tu computadora prendida para que los demás la utilicen:
- Aloja el repositorio en GitHub y activa **GitHub Pages** desde `Settings > Pages > Branch: main`.
- Obtendrás un enlace público permanente (ej. `https://<usuario>.github.io/<repositorio>/`).
- Cualquier supervisor, jefe o técnico de piso puede abrir la app desde cualquier laptop, tablet o celular en la planta 24/7.
- Los datos se guardan de forma persistente en el navegador (`LocalStorage`) y pueden sincronizarse con SharePoint / Supabase.

### 2. Inicio Local en Windows:
- **Modo directo (Web Standalone):** Haz doble clic en `index.html` para abrirlo directamente en Microsoft Edge o Google Chrome.
- **Modo con Escáner COM local (Opcional):** Si deseas escanear la aplicación de escritorio de Outlook instalada en tu equipo, ejecuta `start_app.bat`.

---

## 🛠️ Módulos Principales de la Aplicación

### 1. Bandeja de Entrada & Aprobación de Solicitudes (Supervisor)
- **Monitoreo y Recepción:** Detecta requerimientos de estructuras filtrando por palabras clave clave prioritarias: **`Moonshine`**, **`estructuras`**, **`mesas`**, **`carritos`**, **`racks`**, **`estaciones`**, **`perfil`**.
- **Carga Rápida en GitHub Pages (`[ + Pegar Correo / Solicitud ]`):** Permite copiar y pegar el texto de cualquier correo de Outlook, mensaje de Teams o WhatsApp. El sistema analiza automáticamente el texto, detecta el solicitante, el área sugerida, el nivel de urgencia y la estructura recomendada del catálogo.
- **Herramientas de Revisión para el Supervisor:** Antes de que cualquier pedido afecte el programa de producción:
  - El supervisor puede ajustar o confirmar la estructura asignada y la cantidad.
  - Seleccionar la prioridad en 1 clic: 🚨 **Crítica**, ⚡ **Alta**, 🔷 **Normal** o ⚪ **Baja**.
  - Asignar el área de destino en planta.
- **Aprobación en 1 Clic (`[ ✅ Aceptar y Pasar al Plan Maestro ]`):** Genera de inmediato el folio oficial (`MSH-2026-XXX`), asigna el estado `Programado`, lo incorpora a la secuenciación del Plan Maestro 24/7 y lo retira de la bandeja de pendientes.

### 2. Gestión de Técnicos & Calendario de Turnos 24/7 (Roster)
- **Administración Nominal de Técnicos:** Permite registrar, editar y dar de baja a los técnicos del taller (`[ + Registrar Nuevo Técnico ]`). Cuando se unan nuevos integrantes al equipo en el futuro, se incorporan con su ID, nombre, turno habitual (T1, T2 o T3) y especialidad.
- **Calendario Semanal Interactivo (Lunes a Domingo x T1, T2, T3):**
  - Muestra qué técnicos están asignados cada día en cada turno en formato de calendario visual.
  - **Alternar Descansos con 1 Clic:** Al hacer clic sobre cualquier técnico, alterna entre **🟢 Activo (Trabajando)** y **😴 Descanso Rotativo**.
  - **Asignación Rápida:** Selector `[ + Asignar ]` en cada casilla para transferir o añadir técnicos de refuerzo en turnos específicos.
  - **Capacidad Dinámica Automática:** Cada técnico activo aporta 7.5 horas efectivas de ensamble por turno (ej. 2 técnicos = 15.0h, 3 técnicos = 22.5h, 1 técnico = 7.5h). El motor recalcula la producción en tiempo real.

### 3. Formulario Rápido de Pedidos ("Nuevo Pedido")
- Formulario limpio y optimizado (< 30 segundos) con cálculo automático de horas según el catálogo oficial y panel lateral con la capacidad operativa en vivo del taller.

### 4. Motor de Planificación Semanal 24/7 ("Plan Maestro Semanal")
- Secuencia de forma continua los pedidos a lo largo de los **7 días** en los **3 turnos diarios (T1, T2 y T3)** considerando la dotación exacta de técnicos y el nivel de prioridad.
- Muestra los nombres de los técnicos asignados a cada turno y el progreso de fabricación.

### 5. Modo Piso de Taller ("Taller Moonshine")
- Diseñado para pantallas táctiles o monitores en el taller.
- Detecta el turno en vivo, muestra los técnicos que están laborando actualmente y las estructuras asignadas con botones de acción grandes: `[ Iniciar ]`, `[ Listo ]` y `[ Ver Ficha y SketchUp ]`.

### 6. Catálogo Oficial de 83 Estructuras & Diseños SketchUp
- Catálogo precargado con las estructuras industriales de Axiom (carros Kitting, racks dinámicos, mesas de ensamble ergonómicas, fixtures, etc.), con sus horas estándar y enlaces 3D SketchUp.

### 7. Generador de Correo Diario para Supervisores (Outlook)
- Genera la plantilla corporativa en HTML lista para pegar en Outlook con el resumen de producción del día.

### 8. Integración con SharePoint y PowerApps
- Exportación e importación CSV con las columnas estándar de lista de SharePoint.
  - Shadow Board 5S
  - Dispositivo Poka-Yoke / Fixture Mecánico
  - Mesa de Inspección de Calidad
  - Carro Tipo Tren Tugger Cart
- Permite agregar nuevas estructuras personalizadas con su código de archivo 3D de SketchUp (`.skp`) y horas estimadas.

### 5. Generador de Correo Diario y Semanal para Outlook
- Genera una plantilla con formato HTML listo para Microsoft Outlook.
- Un solo clic en `[Copiar Formato para Outlook]` copia el contenido con estilos e íconos para pegarlo directamente en el cuerpo de un nuevo correo (Ctrl + V).
- Botón `[Abrir en Outlook]` para disparar el cliente de correo predeterminado.

### 6. Matriz de Rol de Técnicos 24/7 (Descansos Rotativos)
- Cuadrícula interactiva de Lunes a Domingo por Turno 1, 2 y 3.
- Un clic en cualquier celda alterna entre **2 Técnicos** y **1 Técnico** por turno, recalculando la capacidad del motor en tiempo real.

### 7. Integración con SharePoint y PowerApps
- **Exportación CSV SharePoint:** Descarga un archivo compatible con las columnas de lista de SharePoint:
  - `Title`, `Solicitante`, `Area`, `EstructuraNombre`, `Cantidad`, `Prioridad`, `Estado`, `HorasEstimadas`, `DiaEntrega`, `TurnoEntrega`, `FechaRequerida`, `CanalEntrada`, `SketchupRef`, `Notas`.
- **Importación CSV SharePoint:** Permite cargar pedidos históricos o sincronizados desde listas existentes.
- **Webhook Power Automate:** Permite vincular la URL del flujo en la nube para notificaciones directas.

---

## 🔒 Privacidad y Almacenamiento
Todos los datos se guardan de forma persistente en el navegador local (`LocalStorage`), por lo que funcionan 100% desconectados y sin necesidad de instalar bases de datos o software de terceros en equipos corporativos.

# Guía Paso a Paso: Cómo Armar el Dashboard y Plan Automático en Power BI (Sin Web App)

Esta guía está diseñada para que conectes tus **2 listas de SharePoint** (la de la **PowerApp de Estructuras** y la de la **PowerApp de Mantenimientos**) directamente a **Power BI Desktop** en unos **15 minutos**, de modo que **Power BI calcule y actualice el Plan Maestro de Producción y Entregas 100% solo**.

---

## 📋 Resumen de Archivos en esta Carpeta (`powerbi_standalone/`)

1. **`1_PowerQuery_Listas_SharePoint.pq`** ➔ Código que une tus 2 listas de SharePoint y les cruza automáticamente el catálogo de las 48+ estructuras de Moonshine con sus horas estándar y costos en USD.
2. **`2_DAX_Motor_Plan_Automatico.dax`** ➔ Fórmulas que ordenan la fila por prioridad y fecha, calculan las horas acumuladas, asignan el turno (`T1`, `T2`, `T3`), separan técnicos de *Estructuras* vs *Mantenimiento* y calculan la **Fecha Compromiso de Entrega (+3 días de holgura)**.
3. **`3_Tema_Corporativo_Moonshine.json`** ➔ Archivo de colores y diseño ejecutivo para importar en Power BI en 2 clics.
4. **`Guia_Paso_a_Paso_PowerBI_Moonshine.pdf`** ➔ Este mismo manual en formato PDF listo para imprimir o consultar.

---

## 🚀 PASO 1: Conectar tus 2 Listas de SharePoint en Power BI Desktop (4 minutos)

1. Abre **Power BI Desktop** en tu computadora y crea un **Informe en blanco**.
2. En la barra superior (pestaña *Inicio*), haz clic en el botón **"Transformar datos"** (esto abrirá la ventana del *Editor de Power Query*).
3. En el panel izquierdo (donde dice *Consultas*), haz **clic derecho en un espacio vacío** ➔ **Nueva consulta** ➔ **Consulta en blanco**.
4. Con esa consulta seleccionada, cámbiale el nombre (a la derecha en *Propiedades*) y ponle exactamente:
   ```text
   Plan_Moonshine
   ```
5. En la barra superior de Power Query, haz clic en el botón **"Editor avanzado"**.
6. Borra las 4 líneas que vienen por defecto, abre el archivo **`1_PowerQuery_Listas_SharePoint.pq`** en el Bloc de Notas, **cópialo todo y pégalo ahí adentro**.
7. **Edita únicamente las 3 primeras variables del código (líneas 15 a 17):**
   ```powerquery
   URL_Sitio_SharePoint = "https://flextronics365.sharepoint.com/sites/TU_SITIO_AQUI",
   Nombre_Lista_Estructuras = "Solicitudes_Estructuras",
   Nombre_Lista_Mantenimientos = "Solicitudes_Mantenimientos",
   ```
   > **Tip importante sobre el URL de SharePoint:** Pon únicamente la ruta hasta el nombre de tu sitio (por ejemplo `https://flextronics365.sharepoint.com/sites/Moonshine`), **sin** poner `/Lists/...` ni `/AllItems.aspx`.
8. Haz clic en **Listo**.
9. Si Power BI te muestra un aviso amarillo pidiendo credenciales:
   * Haz clic en **Editar credenciales** ➔ elige **Cuenta de Microsoft (Organización)** ➔ **Iniciar sesión** (con tu correo de Flex) ➔ **Conectar**.
10. Verás que aparece toda tu tabla consolidada con ambas listas unidas, las horas estimadas y el tipo de trabajo. Arriba a la izquierda haz clic en **"Cerrar y aplicar"**.

---

## ⚙️ PASO 2: Pegar las Fórmulas DAX que Generan el Plan (5 minutos)

Ahora vamos a darle el "cerebro" a Power BI para que ordene la fila de producción y calcule las fechas de entrega:

1. En Power BI Desktop, ve al icono de **Vista de tabla** (en la barra lateral izquierda) y selecciona tu tabla **`Plan_Moonshine`** a la derecha.
2. Abre el archivo **`2_DAX_Motor_Plan_Automatico.dax`**.
3. Para cada una de las **7 Columnas Calculadas (Bloque A del archivo)**:
   * Haz clic arriba en el botón **"Nueva columna"**.
   * Copia y pega la fórmula desde el archivo `.dax` y presiona **Enter**:
     1. **`Prioridad_Peso`** *(Convierte Crítica=1, Alta=2, Normal=3, Baja=4)*.
     2. **`Clave_Ordenamiento_FIFO`** *(Desempata por En Fabricación > Prioridad > Fecha de Solicitud)*.
     3. **`Posicion_En_Fila`** *(Numera del 1 en adelante todos los pedidos pendientes en el taller)*.
     4. **`Horas_Acumuladas_Cola`** *(Suma las horas de fabricación en la fila hasta ese pedido)*.
     5. **`Turno_Programado`** *(Asigna T1 Matutino, T2 Vespertino o T3 Nocturno según las horas acumuladas)*.
     6. **`Fecha_Fin_Fabricacion`** *(Calcula qué día termina de fabricarse según la capacidad diaria de 45 hrs)*.
     7. **`Fecha_Compromiso_Entrega`** *(Le suma automáticamente los **+3 días de holgura** a la fecha de término)*.
   * *(Detalle rápido)*: Selecciona las columnas `Fecha_Fin_Fabricacion` y `Fecha_Compromiso_Entrega` y arriba en *Herramientas de columnas ➔ Tipo de datos* asegúrate de que digan **Fecha (Date)** con formato corto (`dd/mm/yyyy`).
4. Para las **Medidas de Tarjetas KPI (Bloque B del archivo)**:
   * Haz clic arriba en el botón **"Nueva medida"** y pega las medidas:
     * `KPI_Total_Pendientes`
     * `KPI_Estructuras_Pendientes`
     * `KPI_Mantenimientos_Pendientes`
     * `KPI_Horas_En_Cola`
     * `KPI_Listos_Para_Entrega`
     * `Vista_HTML_Plan_Moonshine` *(Opcional, por si quieres usar el visual HTML)*

---

## 🎨 PASO 3: Aplicar el Tema y Armar las Gráficas del Dashboard (4 minutos)

1. **Importar el Diseño Corporativo:**
   * En Power BI Desktop, ve arriba a la pestaña **Ver (View)** ➔ despliega la flechita de **Temas (Themes)** ➔ **Buscar temas (Browse for themes)**.
   * Selecciona el archivo **`3_Tema_Corporativo_Moonshine.json`**. ¡Tu reporte tomará los colores corporativos de inmediato!

2. **Acomodar los 4 bloques visuales en la pantalla (Vista de Informe):**
   * **Arriba (4 Tarjetas de Indicadores):**
     * Inserta el visual **Tarjeta (Card)** 4 veces en la parte superior y arrastra en cada una:
       1. `KPI_Total_Pendientes` (Total en Fila)
       2. `KPI_Estructuras_Pendientes` (Solicitudes de Estructuras)
       3. `KPI_Mantenimientos_Pendientes` (Solicitudes de Mantenimiento / Extra)
       4. `KPI_Horas_En_Cola` (Horas de Carga en Taller)
   * **Izquierda Arriba (Filtros / Segmentadores):**
     * Inserta 2 **Segmentadores de datos (Slicers)**: uno con `Origen_Lista` (*PowerApp Estructuras* vs *PowerApp Mantenimientos*) y otro con `Prioridad` (*Crítica, Alta, Normal, Baja*).
   * **Centro (Gráfica de Carga por Área y Turno):**
     * **Gráfica 1 (Columnas apiladas):** En *Eje X* pon `Area`, en *Leyenda* pon `Tipo_Trabajo` (*Estructura Nueva* vs *Mantenimiento*) y en *Eje Y* pon `Horas_Estimadas`.
     * **Gráfica 2 (Matriz de Turnos):** En *Filas* pon `Turno_Programado`, en *Columnas* pon `Fecha_Fin_Fabricacion` y en *Valores* pon `Horas_Estimadas`.
   * **Abajo a todo lo ancho (Tabla Maestra del Plan de Producción y Entregas):**
     * Inserta una **Tabla (Table)** (o descarga de *Obtener más objetos visuales* el visual gratuito **"HTML Content"** y métele la medida `Vista_HTML_Plan_Moonshine`).
     * Si usas la Tabla nativa de Power BI, arrastra estas columnas en este orden:
       1. `Posicion_En_Fila` *(Ordénala de menor a mayor dando clic en el encabezado)*
       2. `Folio`
       3. `Tipo_Trabajo` *(Muestra si es Estructura Nueva o Mantenimiento)*
       4. `Solicitante`
       5. `Area`
       6. `Estructura_o_Trabajo`
       7. `Cantidad`
       8. `Horas_Estimadas`
       9. `Prioridad`
       10. `Estado`
       11. `Turno_Programado`
       12. `Especialidad_Requerida`
       13. **`Fecha_Compromiso_Entrega`**

---

## ☁️ PASO 4: Publicarlo y Dejarlo 100% Automático para Moonshine (2 minutos)

Para que tú **no tengas que volver a tocar el archivo nunca más**:

1. Guarda tu archivo en Power BI Desktop (ej. `Dashboard_Plan_Moonshine.pbix`) y haz clic arriba a la derecha en **"Publicar" (Publish)**.
2. Elige tu espacio de trabajo en Power BI (ej. *Mi área de trabajo* o el grupo de *Moonshine / Ingeniería*).
3. Abre el enlace que te da para ir a **Power BI en el navegador (app.powerbi.com)**.
4. Busca el **Modelo semántico (Conjunto de datos)** que acabas de subir ➔ haz clic en los 3 puntitos `(...)` ➔ **Configuración (Settings)**:
   * En **Credenciales de origen de datos (Data source credentials)**, haz clic en *Editar credenciales*, elige **OAuth2** y nivel de privacidad **Organizacional**, e inicia sesión con tu cuenta de Flex.
   * Abajo abre **Actualización programada (Scheduled refresh)**, actívala y agrega horarios (por ejemplo: `07:00 AM`, `12:00 PM`, `04:00 PM`, `08:00 PM`).
5. **¡Terminaste!** Comparte el link del reporte con tu jefe y con el equipo de Moonshine:
   * Cada vez que alguien pida algo en la **PowerApp de Estructuras** o en la **PowerApp de Mantenimientos**, aparecerá automáticamente en la fila del Power BI con su fecha compromiso de entrega.
   * Cada vez que la gente de Moonshine cambie un pedido a **"Entregado / Completado"** en SharePoint o en su PowerApp, saldrá de la fila y todas las fechas del plan se recalcularán solas.

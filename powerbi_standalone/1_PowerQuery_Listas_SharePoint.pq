// =========================================================================================
// SCRIPT POWER QUERY (M) - UNIFICADOR AUTOMÁTICO DE LAS 2 LISTAS DE SHAREPOINT (MOONSHINE)
// =========================================================================================
// INSTRUCCIONES RÁPIDAS:
// 1. Abre Power BI Desktop -> Clic en "Transformar datos" (abre Power Query).
// 2. En el panel izquierdo: Clic derecho -> "Nueva consulta" -> "Consulta en blanco".
// 3. Cámbiale el nombre a la consulta por: Plan_Moonshine
// 4. Arriba haz clic en "Editor avanzado", borra todo y pega este código completo.
// 5. SOLO EDITA LAS 3 VARIABLES DEL PASO 1 (URL de tu SharePoint y nombres de tus 2 listas).
// =========================================================================================

let
    // =====================================================================================
    // PASO 1: CONFIGURA AQUÍ TU SITIO DE SHAREPOINT Y EL NOMBRE EXACTO DE TUS 2 LISTAS
    // =====================================================================================
    URL_Sitio_SharePoint = "https://flextronics365.sharepoint.com/sites/TU_SITIO_AQUI",
    Nombre_Lista_Estructuras = "Solicitudes_Estructuras",      // <-- Pon aquí el nombre de tu lista de Estructuras (PowerApp 1)
    Nombre_Lista_Mantenimientos = "Solicitudes_Mantenimientos", // <-- Pon aquí el nombre de tu lista de Mantenimientos (PowerApp 2)

    // =====================================================================================
    // PASO 2: CATÁLOGO INTERNO DE ESTRUCTURAS MOONSHINE (TIEMPOS ESTÁNDAR Y COSTOS USD)
    // (Incrustado para no depender de ningún Excel ni Web App externa)
    // =====================================================================================
    CatalogoMoonshine = #table(
        type table [Codigo = text, NombreEstructura = text, Categoria = text, HorasEstandar = number, PrecioUSD = number, SketchUpUrl = text],
        {
            {"EST-001", "TRAY CAR", "Carros & Material Handling", 4.5, 800, "https://app.sketchup.com/share/tc/northAmerica/_zVwqJGofb4?source=web&stoken=dQ8CICeo5FXQGA-Uksqh5MlvRv3W7oQTm6SNylmnnMnpiLOTDWigQd-Rq5DdSHcu"},
            {"EST-002", "Trasporte Car", "Carros & Material Handling", 4.5, 735, "https://app.sketchup.com/share/tc/northAmerica/tb7YM5W-Wis?source=web&stoken=1gODLAj0k0Zu72KejNp6NLiJhMC7zLFqKk2HNYFMB6RkF8TDl23DKhYbcTr5x3Sk"},
            {"EST-003", "ASSY TRAY", "Estaciones & Ensamble", 6.0, 800, "https://app.sketchup.com/share/tc/northAmerica/MQT9ebGm_V8?source=web&stoken=wvY7URS-R4XVHo835w5WKqtkGv5o2FSlk_FAuG_ZDH7cfRr11Nv34TTHG2B9kpDX"},
            {"EST-004", "DEK", "Estaciones & Ensamble", 6.0, 5, "https://app.sketchup.com/share/tc/northAmerica/MQj09x9H0YM?source=web&stoken=pOaCEhYjLjcpgregNlwbUZUuye_-2eLfRnw0Rd4D6RFa0kgnLXDttLEMqtznJ2DJ"},
            {"EST-005", "LAPTOP CAR", "Carros & Material Handling", 4.5, 744, "https://app.sketchup.com/share/tc/northAmerica/jlfjrJXEnjc?stoken=Mmejb0PzJvGeZ8sZ77ic3Jn1nQIkP06e0v78VOgaMaECt-Vv-icABrWd_4J1pHJN&source=web"},
            {"EST-006", "Disassembly 2", "Estaciones & Ensamble", 6.0, 827, "https://app.sketchup.com/share/tc/northAmerica/Z3ZS22mb2mk?stoken=ogE_04fBEwcYSpiYMaFjjPkNuR9M8w46vs5vVPsIPg4hBtJWO8ivXv9yhL4HKYVb&source=web"},
            {"EST-007", "Porta Zebra", "Dispositivos & Accesorios", 3.5, 250, "https://app.sketchup.com/share/tc/northAmerica/dE-ovLMe3II?source=web&stoken=UFiDZmaK60j3yGKNxC6mW0EFWIwO6QBZ6HfqefuhiKJILE9a_qk57HrH6CvtmwvA"},
            {"EST-008", "Fuse Assembly", "Estaciones & Ensamble", 6.0, 59, "https://app.sketchup.com/share/tc/northAmerica/BvFzUmnUOVk?stoken=2J_qJ2VH6v-hG-0-_Beahu5dL303yeRi82F6r8hAfr2_U5Fqpd8RcvWwB28KCb0o&source=web"},
            {"EST-009", "CAJA PARA MATERIAL", "Dispositivos & Accesorios", 3.5, 200, "https://app.sketchup.com/share/tc/northAmerica/VG7ufhG5_jQ?source=web&stoken=4Xa3jP6olsOluAjnkxgJMXqGUltreDhJSf1sjaslz47a--Qs8tOBKQYpntNycHPv"},
            {"EST-010", "FISH CHASIS CART", "Carros & Material Handling", 4.5, 667, "https://app.sketchup.com/share/tc/northAmerica/R-XepLQ4BXg?source=web&stoken=46bLt8JKP3ZYEdtlYCFfsAUEq1X6YBiLWd4XZQ4LmfMGU_97r_V8cQ7t_dcuDzoN"},
            {"EST-011", "FISHFAN CART", "Carros & Material Handling", 4.5, 2000, "https://app.sketchup.com/share/tc/northAmerica/V1Fp126folg?source=web&stoken=NEQqYVp2SPHi9DpImpBvCoJ2bEWnaJiBXcGxhPd1zGkhIyuuize8nSjA3f0RUiak"},
            {"EST-012", "COVER&EJECTOR CART", "Carros & Material Handling", 4.5, 1500, "https://app.sketchup.com/share/tc/northAmerica/GVSvoaUdC54?source=web&stoken=oTYKX5MtUyHA3F4uep3hr4dcJGZ4NoNeJ4-KAiBQZpoEMI-arPGKm02DHIu2FuMP"},
            {"EST-013", "PUFFIN-MANIFOLD IN&OUT CART", "Carros & Material Handling", 4.5, 375, "https://app.sketchup.com/share/tc/northAmerica/MQT9ebGm_V8?source=web&stoken=do5q2rjs8JXcHTUHFxW6CatkGv5o2FSlk_FAuG_ZDH7cfRr11Nv34TTHG2B9kpDX"},
            {"EST-014", "LEAK CART", "Carros & Material Handling", 4.5, 38, "https://app.sketchup.com/share/tc/northAmerica/NRQqwb159pI?source=web&stoken=qSrjINS1I69s1ef-RCeufUYPHHX-CtzgZPnGYgVcksmwX4K8s_c1PcPikaUXH3j-"},
            {"EST-015", "SQUARE DOUBLE TABLE", "Mesas & Workstations", 5.5, 300, "https://app.sketchup.com/share/tc/northAmerica/HeLH7C_33ek?source=web&stoken=YFKB5ukgcEw93B0yPSwPCZDvlIzLNPiFUzSQAgM1S7_rJFoPZMHA9HB3-OsVySvN"},
            {"EST-016", "Conveyor 2 Niveles", "Racks & Conveyors", 6.5, 2800, "https://app.sketchup.com/share/tc/northAmerica/3Nck-rvHDxY?source=web&stoken=yWZxe5Nc5CScCXo26DjbzmkKX8yF3sLIigq3mhubXa6fdfblWFidqKTThEQWqXI4"},
            {"EST-017", "Mesa SMT 1", "Mesas & Workstations", 5.5, 167, "https://app.sketchup.com/share/tc/northAmerica/bc41jMsd-Bw?source=web&stoken=YR-1kBX5FMa-sNapjuH9A8E4tcgvdL3R2lWehhhr9D-iQxDUrPeCIkJsfvzIz7Ym"},
            {"EST-018", "Carro Chassis", "Carros & Material Handling", 4.5, 800, "https://app.sketchup.com/share/tc/northAmerica/R-XepLQ4BXg?source=web&stoken=46bLt8JKP3ZYEdtlYCFfsAUEq1X6YBiLWd4XZQ4LmfMGU_97r_V8cQ7t_dcuDzoN"},
            {"EST-019", "QA Pressfit", "Estaciones & Ensamble", 6.0, 700, "https://app.sketchup.com/share/tc/northAmerica/hkpq36hhDDk?source=web&stoken=M0o0SvAAt4_cw12fRyyqpMQ6I-7mTiAvvXvYIgDy0YQwyBnN_dAtZLkn0uBUj4wU"},
            {"EST-020", "Conveyor pequeño", "Racks & Conveyors", 6.5, 500, "https://app.sketchup.com/share/tc/northAmerica/I4EQ-l3al04?source=web&stoken=U6Qsf7FLTuzGKxi6QxFeyMDwMNCKlBCh3sUOgENvMFo82NBDAQUHSgdCY78yR7Ev"},
            {"EST-021", "Conveyor Assy PCBA", "Racks & Conveyors", 6.5, 741, "https://app.sketchup.com/share/tc/northAmerica/nqB4wcna-eM?stoken=DSmWZSnTqEyVdp0pYTYZ3JOIqKJEavBkHU2v0iJWVz-tN_fJmvVe6wUqTrNQH0_0&source=web"},
            {"EST-022", "REPAIR", "Estaciones & Ensamble", 6.0, 181, "https://app.sketchup.com/share/tc/northAmerica/r9jESbsJ8JY?stoken=nUGB2ZwzyQ72Ebh6ab_sCI_VGajvRR8ocwUVLWDhQdFxqINUeUykvWJJ0d1bWlJj&source=web"},
            {"EST-023", "Carro charolas Seguridad", "Carros & Material Handling", 4.5, 56, "https://app.sketchup.com/share/tc/northAmerica/5d_nzk-euSE?source=web&stoken=Mf6Lgzt8hzEo7snnu2qdPTMyXngE7zUMw7KDWO5LBU4dJCvAHmB_3BD95FHgw_XK"},
            {"EST-024", "Bote Backend", "Dispositivos & Accesorios", 3.5, 118, "https://app.sketchup.com/share/tc/northAmerica/0eN5VqB2fcU?stoken=nM6_5acfFuleNwXtokhjnyJCig4_v8zwtjEh4t0XwGD_sLJJtz7g3Rq77vUbB6iH&source=web"},
            {"EST-025", "ICT TABLE", "Mesas & Workstations", 5.5, 274, "https://app.sketchup.com/share/tc/northAmerica/MDDZpzYyJUE?source=web&stoken=QLjd5lG1wLhTUsYlSh4zvKcDI00r7xzOrHQbLMd02JrCWqphhdE3Qp7T245vvhnp"},
            {"EST-026", "Caja seca", "Dispositivos & Accesorios", 3.5, 200, "https://app.sketchup.com/share/tc/northAmerica/ntntic-Zjag?source=web&stoken=UyCJeFmtlgXLH24Ic04QkT3j2Yv9pkOvn5Jvt7WZbCFQkrOk63u5rmEk6PPg4WDc"},
            {"EST-027", "Heatsink Car", "Carros & Material Handling", 4.5, 500, "https://app.sketchup.com/share/tc/northAmerica/2_eOm-k2ZTc?source=web&stoken=-XOdupSoNOGMf45OplTz1Bk8sZSgRFA9rOOuwmTcsJc3gKUATEmyzmBJfKPz09Y7"},
            {"EST-028", "HV MATERIAL", "Estaciones & Ensamble", 6.0, 3075, "https://app.sketchup.com/share/tc/northAmerica/BvFzUmnUOVk?stoken=2J_qJ2VH6v-hG-0-_Beahu5dL303yeRi82F6r8hAfr2_U5Fqpd8RcvWwB28KCb0o&source=web"},
            {"EST-029", "AOI Station", "Estaciones & Ensamble", 6.0, 422, "https://app.sketchup.com/share/tc/northAmerica/UGfG_Ox_3TM?stoken=ObwG82BoYgP1_Li7oBk0vYYvy534P3Dr3o1-buhLJnBoLByvYd5MSBbgWwurGgSm&source=web"},
            {"EST-030", "ROMA", "Estaciones & Ensamble", 6.0, 236, "https://app.sketchup.com/share/tc/northAmerica/BvFzUmnUOVk?stoken=2J_qJ2VH6v-hG-0-_Beahu5dL303yeRi82F6r8hAfr2_U5Fqpd8RcvWwB28KCb0o&source=web"},
            {"EST-031", "DEBUG", "Estaciones & Ensamble", 6.0, 557, "https://app.sketchup.com/share/tc/northAmerica/T6qwDM78usA?stoken=jUvyRlBUxhpfEwVGnsqEw-5YB9IRAA2NUKy-b6mGoFCALXn-9Xr3GUrAyF2J6FW6&source=web"},
            {"EST-032", "SMK SMT", "Estaciones & Ensamble", 6.0, 676, "https://app.sketchup.com/share/tc/northAmerica/pK0_iRNZVUE?source=web&stoken=l62fSmFNcHL_xIoWRVSioqGxLljij4b-ECV2xXySd4PtL_I1BbwBl4sJchoPfA27"},
            {"EST-033", "SUPPORT DESK", "Mesas & Workstations", 5.5, 289, ""},
            {"EST-034", "Transfer Car", "Carros & Material Handling", 4.5, 169, "https://app.sketchup.com/share/tc/northAmerica/5d_nzk-euSE?source=web&stoken=Mf6Lgzt8hzEo7snnu2qdPTMyXngE7zUMw7KDWO5LBU4dJCvAHmB_3BD95FHgw_XK"},
            {"EST-035", "Mac Label", "Estaciones & Ensamble", 6.0, 430, "https://app.sketchup.com/share/tc/northAmerica/ORLSuX6ahYQ?stoken=eYN2kCudUwqCQ23jB6D7sxcL3Foye9WO1SSeEW5IWfSSCa_YfRYwe5RWOZPXDjtb&source=web"},
            {"EST-036", "PCBA 6 niveles", "Racks & Conveyors", 6.5, 990, "https://app.sketchup.com/share/tc/northAmerica/PQ4OgVNLBaw?stoken=UIF0ugor-TrT4QMrowyKXIO6-ArN1JGrGwo_ajorhwt9Iag6skmjYvRfZ_rZEZ5I&source=web"},
            {"EST-037", "TIE TABLE", "Mesas & Workstations", 5.5, 93, "https://app.sketchup.com/share/tc/northAmerica/rJn8s0a5TEo?stoken=7gVICKyqzYui1r1yFkoo-hAgjQffJ_p2GvAIcpmG3P-J4jT5hw0vrqQjikujHxDX&source=web"},
            {"EST-038", "SIPLACE PRO", "Estaciones & Ensamble", 6.0, 462, "https://app.sketchup.com/share/tc/northAmerica/VmOC_M6UUQg?stoken=TW0N0m9SIuTDttjoRgInnsjQsZA4uQOWvA5JU4tDJ8jyemusowXkSvbUgBWmsP-x&source=web"},
            {"EST-039", "ASM DOUBLE TABLE", "Mesas & Workstations", 5.5, 586, "https://app.sketchup.com/share/tc/northAmerica/g6hSjnxwKoY?stoken=F_92jM3i0hNLKv6nEsL_6AgiheqrsGViRnqFhsRiD2I-gMgKgTsK4Tqkh6vs25-B&source=web"},
            {"EST-040", "Remove Pressfit", "Estaciones & Ensamble", 6.0, 904, "https://app.sketchup.com/share/tc/northAmerica/B6eNDBreZu8?stoken=YOqM0WHDACPZrj7tPU-eefgTlb3-eV0CbACI-jSqmWIMr2hpJ8NVkAi7tyjM2LcA&source=web"},
            {"EST-041", "ASM TABLE", "Mesas & Workstations", 5.5, 134, "https://app.sketchup.com/share/tc/northAmerica/g6hSjnxwKoY?stoken=F_92jM3i0hNLKv6nEsL_6AgiheqrsGViRnqFhsRiD2I-gMgKgTsK4Tqkh6vs25-B&source=web"},
            {"EST-042", "RACK U21", "Racks & Conveyors", 6.5, 2000, "https://app.sketchup.com/share/tc/northAmerica/X2XBYEmmVxM?source=web&stoken=IyPpqVFF_jyitUklm5Dt3d03Sch_KHp7egisVOo69-wp7R2ZeN1YNb-L-CQ5jXws"},
            {"EST-043", "SQUARE TABLE", "Mesas & Workstations", 5.5, 744, "https://app.sketchup.com/share/tc/northAmerica/QBsL3lZTbTY?stoken=K8tPsqpQdILNKnIZUDEbWAPMsr08eR-iUU7xxGCTaUHHC6gTSJS9UGo7ocj3iNkY&source=web"},
            {"EST-044", "Jalula de Seguridad", "Racks & Conveyors", 6.5, 676, "https://app.sketchup.com/share/tc/northAmerica/_3xehHfojl8?stoken=y10KxlTjR9jZBq0uJ7mySxBlouPW8V6PJGsxGiP_bE5oaE9wwGtlNiTlAXVYsVWm&source=web"},
            {"EST-045", "Table Minipot", "Mesas & Workstations", 5.5, 198, "https://app.sketchup.com/share/tc/northAmerica/gkb8w-h7P_k?source=web&stoken=DPig1VC_j8FHaB79yu8_yCKZA_p-CSARB5ZDizq3b37LNdWOYoIHczcfqkVvgrG0"},
            {"EST-046", "FRESH MARKET", "Estaciones & Ensamble", 6.0, 987, "https://app.sketchup.com/share/tc/northAmerica/oKS0AEh6bmQ?stoken=hgaflSzGOWfUi7nRoJaRCi0JPA0Zh9sK2UutnWSW1tEP-bglmUywBNUSua1z2Ywf&source=web"},
            {"EST-047", "Pizarron de 45 grados con Acrilico", "Dispositivos & Accesorios", 3.5, 698, ""},
            {"EST-048", "MEETING STATION", "Estaciones & Ensamble", 6.0, 1169, ""}
        }
    ),

    // =====================================================================================
    // PASO 3: FUNCIONES INTELIGENTES DE MAPEO (A PRUEBA DE CAMBIOS DE NOMBRE DE COLUMNA)
    // =====================================================================================
    // Extrae texto de una columna aunque en SharePoint sea un Record (ej. Persona o Choice)
    ExtraerTexto = (valor as any) as nullable text =>
        if valor = null then null
        else if Value.Is(valor, type record) then
            if Record.HasFields(valor, "Title") then Text.From(valor[Title])
            else if Record.HasFields(valor, "Value") then Text.From(valor[Value])
            else if Record.HasFields(valor, "DisplayName") then Text.From(valor[DisplayName])
            else if Record.HasFields(valor, "Email") then Text.From(valor[Email])
            else null
        else if Value.Is(valor, type list) then
            if List.Count(valor) > 0 then @ExtraerTexto(valor{0}) else null
        else
            Text.Trim(Text.From(valor)),

    // Busca el primer campo que exista y no esté vacío dentro de una lista de posibles nombres
    BuscarCampo = (fila as record, posiblesNombres as list, valorPorDefecto as any) as any =>
        let
            nombresEnFila = Record.FieldNames(fila),
            coincidencias = List.Select(posiblesNombres, each List.Contains(nombresEnFila, _, Comparer.OrdinalIgnoreCase)),
            valoresNoNulos = List.Transform(
                coincidencias,
                (nombreBuscado) =>
                    let
                        nombreReal = List.First(List.Select(nombresEnFila, each Comparer.OrdinalIgnoreCase(_, nombreBuscado) = 0)),
                        val = ExtraerTexto(Record.Field(fila, nombreReal))
                    in
                        if val <> null and val <> "" then val else null
            ),
            limpios = List.RemoveNulls(valoresNoNulos)
        in
            if List.Count(limpios) > 0 then limpios{0} else valorPorDefecto,

    // Busca la estructura en el catálogo para devolver Horas Estándar, Precio y Link SketchUp
    BuscarEnCatalogo = (nombreTrabajo as text, esMantenimiento as logical) as record =>
        let
            textoLimpio = Text.Upper(Text.Trim(nombreTrabajo ?? "")),
            filasCatalogo = Table.ToRecords(CatalogoMoonshine),
            coincidencia = List.First(
                List.Select(
                    filasCatalogo,
                    each Text.Contains(textoLimpio, Text.Upper(_[NombreEstructura])) or Text.Contains(Text.Upper(_[NombreEstructura]), textoLimpio)
                ),
                null
            ),
            horasDefault = if esMantenimiento then 3.5 else 5.0,
            precioDefault = if esMantenimiento then 80 else 350
        in
            if coincidencia <> null and textoLimpio <> "" then
                [HorasUnitarias = coincidencia[HorasEstandar], PrecioUnitarioUSD = coincidencia[PrecioUSD], Categoria = coincidencia[Categoria], SketchUp = coincidencia[SketchUpUrl]]
            else if Text.Contains(textoLimpio, "RACK") or Text.Contains(textoLimpio, "CONVEYOR") then
                [HorasUnitarias = 6.5, PrecioUnitarioUSD = 750, Categoria = "Racks & Conveyors", SketchUp = ""]
            else if Text.Contains(textoLimpio, "MESA") or Text.Contains(textoLimpio, "TABLE") or Text.Contains(textoLimpio, "ESTACION") then
                [HorasUnitarias = 5.5, PrecioUnitarioUSD = 400, Categoria = "Mesas & Workstations", SketchUp = ""]
            else if Text.Contains(textoLimpio, "CARRO") or Text.Contains(textoLimpio, "CART") or Text.Contains(textoLimpio, "CARRITO") then
                [HorasUnitarias = 4.5, PrecioUnitarioUSD = 500, Categoria = "Carros & Material Handling", SketchUp = ""]
            else
                [HorasUnitarias = horasDefault, PrecioUnitarioUSD = precioDefault, Categoria = if esMantenimiento then "Mantenimiento / Arreglo" else "Estructura General", SketchUp = ""],

    // Normaliza la Prioridad en las 4 categorías estándar del Plan Maestro
    NormalizarPrioridad = (prioRaw as nullable text) as text =>
        let
            p = Text.Upper(prioRaw ?? "NORMAL")
        in
            if Text.Contains(p, "CRIT") or Text.Contains(p, "CRÍT") or Text.Contains(p, "URG") or Text.Contains(p, "PARO") or p = "1" then "Crítica"
            else if Text.Contains(p, "ALT") or Text.Contains(p, "HIGH") or p = "2" then "Alta"
            else if Text.Contains(p, "BAJ") or Text.Contains(p, "LOW") or p = "4" then "Baja"
            else "Normal",

    // Normaliza el Estado para saber qué pedidos siguen activos en el Plan y cuáles ya se entregaron
    NormalizarEstado = (estadoRaw as nullable text) as text =>
        let
            e = Text.Upper(estadoRaw ?? "PENDIENTE")
        in
            if Text.Contains(e, "ENTREG") or Text.Contains(e, "CERRAD") or Text.Contains(e, "COMPLET") or Text.Contains(e, "DONE") or Text.Contains(e, "FINALIZ") then "Entregado"
            else if Text.Contains(e, "LISTO") or Text.Contains(e, "TERMINAD") or Text.Contains(e, "READY") then "Listo para Entrega"
            else if Text.Contains(e, "PROCES") or Text.Contains(e, "FABRIC") or Text.Contains(e, "PROGRES") or Text.Contains(e, "WORKING") then "En Fabricación"
            else if Text.Contains(e, "CANCEL") or Text.Contains(e, "RECHAZ") then "Cancelado"
            else "Programado",

    // Convierte cualquier tabla de SharePoint al esquema maestro unificado
    EstandarizarTablaSharePoint = (tablaOrigen as table, etiquetaOrigen as text, prefijoFolio as text, esMantenimiento as logical) as table =>
        let
            registros = Table.ToRecords(tablaOrigen),
            transformados = List.Transform(
                registros,
                (r) =>
                    let
                        idRaw = BuscarCampo(r, {"ID", "Id", "Folio"}, "0"),
                        folio = BuscarCampo(r, {"Folio", "Codigo", "Ticket"}, prefijoFolio & "-" & Text.PadStart(Text.From(idRaw), 3, "0")),
                        solicitante = BuscarCampo(r, {"Solicitante", "NombreSolicitante", "Usuario", "Requisitor", "Creado por", "Author", "CreatedBy"}, "Solicitante Planta"),
                        area = BuscarCampo(r, {"Area", "Área", "Linea", "Línea", "Departamento", "Proyecto", "Celda"}, "Planta General"),
                        trabajo = BuscarCampo(r, {"Estructura", "EstructuraNombre", "TipoEstructura", "NombreEstructura", "Title", "Título", "Descripcion", "Descripción", "Mantenimiento", "Problema", "Falla", "Trabajo"}, if esMantenimiento then "Mantenimiento de Estructura" else "Estructura Moonshine"),
                        cantidadTxt = BuscarCampo(r, {"Cantidad", "Piezas", "Qty", "Unidades"}, "1"),
                        cantidad = try Number.From(cantidadTxt) otherwise 1,
                        cantidadSegura = if cantidad <= 0 or cantidad = null then 1 else cantidad,
                        infoCat = BuscarEnCatalogo(trabajo, esMantenimiento),
                        horasManualesTxt = BuscarCampo(r, {"HorasEstimadas", "Horas", "TiempoEstimado"}, null),
                        horasFinales = if horasManualesTxt <> null and (try Number.From(horasManualesTxt) otherwise 0) > 0
                                       then Number.From(horasManualesTxt)
                                       else Number.Round(infoCat[HorasUnitarias] * cantidadSegura, 1),
                        prioridad = NormalizarPrioridad(BuscarCampo(r, {"Prioridad", "Urgencia", "Priority", "NivelUrgencia"}, "Normal")),
                        estado = NormalizarEstado(BuscarCampo(r, {"Estado", "Estatus", "Status", "Etapa"}, "Programado")),
                        fechaTxt = BuscarCampo(r, {"FechaSolicitud", "Fecha", "Created", "Creado"}, DateTime.ToText(DateTime.LocalNow())),
                        fechaSolicitud = try Date.From(DateTime.From(fechaTxt)) otherwise Date.From(DateTime.LocalNow()),
                        notas = BuscarCampo(r, {"Notas", "Comentarios", "Observaciones", "Detalle", "Descripcion"}, "")
                    in
                        [
                            Folio = folio,
                            ID_SharePoint = try Number.From(idRaw) otherwise 0,
                            Origen_Lista = etiquetaOrigen,
                            Tipo_Trabajo = if esMantenimiento then "🔧 Mantenimiento / Solicitud Extra" else "🏗️ Estructura Nueva",
                            Especialidad_Requerida = if esMantenimiento then "Técnico Mantenimiento / Arreglos" else "Técnico Estructuras Nuevas",
                            Solicitante = solicitante,
                            Area = area,
                            Estructura_o_Trabajo = trabajo,
                            Categoria = infoCat[Categoria],
                            Cantidad = cantidadSegura,
                            Horas_Estimadas = horasFinales,
                            Costo_Estimado_USD = Number.Round(infoCat[PrecioUnitarioUSD] * cantidadSegura, 2),
                            Prioridad = prioridad,
                            Estado = estado,
                            Fecha_Solicitud = fechaSolicitud,
                            Link_3D_SketchUp = infoCat[SketchUp],
                            Notas = notas
                        ]
            ),
            tablaSalida = Table.FromRecords(
                transformados,
                type table [
                    Folio = text,
                    ID_SharePoint = Int64.Type,
                    Origen_Lista = text,
                    Tipo_Trabajo = text,
                    Especialidad_Requerida = text,
                    Solicitante = text,
                    Area = text,
                    Estructura_o_Trabajo = text,
                    Categoria = text,
                    Cantidad = Int64.Type,
                    Horas_Estimadas = number,
                    Costo_Estimado_USD = number,
                    Prioridad = text,
                    Estado = text,
                    Fecha_Solicitud = date,
                    Link_3D_SketchUp = text,
                    Notas = text
                ]
            )
        in
            tablaSalida,

    // =====================================================================================
    // PASO 4: CONEXIÓN A SHAREPOINT ONLINE Y EXTRACCIÓN DE LAS 2 LISTAS
    // =====================================================================================
    OrigenSharePoint = SharePoint.Tables(URL_Sitio_SharePoint, [Implementation = "2.0", ViewMode = "All"]),

    // 1) Obtener tabla de Estructuras (PowerApp 1)
    FilaListaEstructuras = Table.SelectRows(OrigenSharePoint, each Comparer.OrdinalIgnoreCase([Title], Nombre_Lista_Estructuras) = 0),
    TablaRawEstructuras = if Table.RowCount(FilaListaEstructuras) > 0 then FilaListaEstructuras{0}[Items] else #table({}, {}),
    TablaEstructurasNormalizada = EstandarizarTablaSharePoint(TablaRawEstructuras, "PowerApp Estructuras", "EST", false),

    // 2) Obtener tabla de Mantenimientos / Solicitudes Extra (PowerApp 2)
    FilaListaMantenimientos = Table.SelectRows(OrigenSharePoint, each Comparer.OrdinalIgnoreCase([Title], Nombre_Lista_Mantenimientos) = 0),
    TablaRawMantenimientos = if Table.RowCount(FilaListaMantenimientos) > 0 then FilaListaMantenimientos{0}[Items] else #table({}, {}),
    TablaMantenimientosNormalizada = EstandarizarTablaSharePoint(TablaRawMantenimientos, "PowerApp Mantenimientos", "MTO", true),

    // =====================================================================================
    // PASO 5: UNIÓN DE AMBAS LISTAS EN UNA SOLA TABLA MAESTRA PARA EL DASHBOARD
    // =====================================================================================
    TablaConsolidada = Table.Combine({TablaEstructurasNormalizada, TablaMantenimientosNormalizada})
in
    TablaConsolidada

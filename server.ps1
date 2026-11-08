# ====================================================================
# Servidor Local Web para Moonshine Flow Manager
# Permite acceder a la app desde tablets y celulares en la red de planta
# Y provee la API para escanear correos de Microsoft Outlook en vivo
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$port = 8080
$prefix = "http://localhost:$port/"
$baseDir = $PSScriptRoot
if (-not $baseDir) {
    if ($MyInvocation.MyCommand.Path) {
        $baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    } else {
        $baseDir = (Get-Location).Path
    }
}
$cacheFile = Join-Path $baseDir "outlook_cache.json"

# Obtener IP local para compartir con el jefe y planta
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | 
    Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254*" } | 
    Select-Object -First 1).IPAddress
if (-not $localIp) { $localIp = "localhost" }
$networkUrl = "http://${localIp}:${port}/"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Moonshine Flow Manager - Servidor Local Axiom 24/7   " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Acceso Local:         $prefix" -ForegroundColor Yellow
Write-Host "Enlace para tu Jefe:  $networkUrl" -ForegroundColor Magenta
Write-Host "Para detener el servidor presiona Ctrl + C" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

# Función para escanear Outlook de forma segura con timeout y múltiples palabras clave
function Get-OutlookMoonshineEmails {
    param(
        [string[]]$Keywords = @("moonshine", "estructuras", "estructura", "mesas", "mesa", "carritos", "carrito", "carro", "carros", "racks", "rack", "estaciones", "estacion", "estación", "perfil", "perfiles"),
        [int]$MaxResults = 20
    )

    # 1. Verificar si Outlook está corriendo
    $proc = Get-Process OUTLOOK -ErrorAction SilentlyContinue
    if (-not $proc) {
        $cached = @()
        if ($cacheFile -and (Test-Path $cacheFile)) {
            try { $cached = Get-Content $cacheFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch {}
        }
        $emailList = @()
        if ($cached) { $emailList = $cached }
        return @{
            success = $false
            outlookRunning = $false
            message = "Microsoft Outlook no está abierto actualmente en este equipo. Por favor inicia Outlook para escanear en tiempo real."
            emails = $emailList
        }
    }

    # 2. Escanear buzón en segundo plano con límite de 4 segundos
    $scriptBlock = {
        param($kwList, $max, $cachePath)
        try {
            $outlook = New-Object -ComObject Outlook.Application
            $ns = $outlook.GetNameSpace("MAPI")
            $inbox = $ns.GetDefaultFolder(6) # 6 = olFolderInbox
            
            $items = $inbox.Items
            $items.Sort("[ReceivedTime]", $true) # Más recientes primero
            
            $results = @()
            $inspected = 0
            
            # Limpiar y normalizar lista de palabras clave
            $cleanKws = @()
            foreach ($k in $kwList) {
                if ($k -and $k.Trim() -ne "") {
                    $cleanKws += $k.Trim().ToLower()
                }
            }
            if ($cleanKws.Count -eq 0) {
                $cleanKws = @("moonshine", "estructuras", "estructura", "mesas", "mesa", "carritos", "carrito", "carro", "carros", "racks", "rack", "estaciones", "estacion", "estación", "perfil", "perfiles")
            }
            
            foreach ($item in $items) {
                $inspected++
                if ($inspected -gt 150 -or $results.Count -ge $max) { break }
                
                try {
                    $subject = [string]$item.Subject
                    $body = [string]$item.Body
                    
                    $subLower = $subject.ToLower()
                    $bodyLower = $body.ToLower()
                    $fullText = "$subLower $bodyLower"
                    
                    $matchedWords = @()
                    foreach ($kw in $cleanKws) {
                        if ($fullText.Contains($kw)) {
                            $matchedWords += $kw
                        }
                    }
                    
                    if ($matchedWords.Count -gt 0) {
                        $senderName = try { $item.SenderName } catch { "Desconocido" }
                        $senderEmail = try { $item.SenderEmailAddress } catch { "" }
                        $received = try { $item.ReceivedTime.ToString("yyyy-MM-dd HH:mm:ss") } catch { "" }
                        $importance = switch ($item.Importance) {
                            2 { "Alta" }
                            0 { "Baja" }
                            Default { "Normal" }
                        }
                        
                        $clean = ($body -replace "[\r\n\t]+", " ").Trim()
                        $preview = if ($clean.Length -gt 250) { $clean.Substring(0, 250) + "..." } else { $clean }
                        
                        # Detección inteligente de estructuras comunes
                        $sugerenciaEstructura = ""
                        if ($fullText -match "carro|carrito|kitting|tugger") { $sugerenciaEstructura = "Carro de Transporte ESD (Kitting)" }
                        elseif ($fullText -match "rack|fifo|gravedad") { $sugerenciaEstructura = "Rack Dinámico FIFO por Gravedad (4 Niveles)" }
                        elseif ($fullText -match "mesa|estacion|estación|workstation") { $sugerenciaEstructura = "Estación de Trabajo / Mesa de Ensamble Ergonómica" }
                        elseif ($fullText -match "shadow|5s|tablero") { $sugerenciaEstructura = "Shadow Board / Tablero de Herramientas 5S" }
                        elseif ($fullText -match "poka|fixture") { $sugerenciaEstructura = "Dispositivo Poka-Yoke / Fixture Mecánico" }
                        elseif ($fullText -match "inspeccion|inspección|calidad") { $sugerenciaEstructura = "Mesa de Inspección de Calidad con Iluminación" }
                        elseif ($fullText -match "perfil|perfiles|estructura|estructuras") { $sugerenciaEstructura = "Estación de Trabajo / Mesa de Ensamble Ergonómica" }

                        # Detección de urgencia
                        $prioridadSugerida = $importance
                        if ($fullText -match "urgente|linea parada|línea parada|emergencia|critico|crítico|paro") {
                            $prioridadSugerida = "Crítica"
                        } elseif ($fullText -match "kaizen|npi|asap|pronto|alta") {
                            $prioridadSugerida = "Alta"
                        }

                        # Detección de área de planta
                        $areaSugerida = ""
                        if ($fullText -match "smt\s*0?1") { $areaSugerida = "Línea SMT 01" }
                        elseif ($fullText -match "smt\s*0?2") { $areaSugerida = "Línea SMT 02" }
                        elseif ($fullText -match "smt\s*0?3") { $areaSugerida = "Línea SMT 03" }
                        elseif ($fullText -match "backend\s*a") { $areaSugerida = "Ensamble Backend A" }
                        elseif ($fullText -match "backend\s*b") { $areaSugerida = "Ensamble Backend B" }
                        elseif ($fullText -match "calidad") { $areaSugerida = "Calidad & NPI" }
                        elseif ($fullText -match "almacen|almacén") { $areaSugerida = "Almacén de Componentes" }
                        elseif ($fullText -match "pruebas|testing") { $areaSugerida = "Área de Pruebas / Testing" }
                        
                        $palabrasTexto = ($matchedWords | Select-Object -Unique) -join ", "
                        
                        $results += @{
                            id = [string]$item.EntryID
                            subject = $subject
                            sender = $senderName
                            senderEmail = $senderEmail
                            receivedTime = $received
                            preview = $preview
                            body = if ($body.Length -gt 1500) { $body.Substring(0, 1500) } else { $body }
                            importance = $importance
                            sugerenciaEstructura = $sugerenciaEstructura
                            prioridadSugerida = $prioridadSugerida
                            areaSugerida = $areaSugerida
                            palabrasDetectadas = $palabrasTexto
                        }
                    }
                } catch {}
            }
            
            return @{
                success = $true
                outlookRunning = $true
                count = $results.Count
                emails = $results
            }
        } catch {
            return @{
                success = $false
                outlookRunning = $true
                message = $_.Exception.Message
                emails = @()
            }
        }
    }

    $job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $Keywords, $MaxResults, $cacheFile
    $completed = Wait-Job $job -Timeout 4
    if (-not $completed) {
        Stop-Job $job -ErrorAction SilentlyContinue
        Remove-Job $job -Force -ErrorAction SilentlyContinue
        
        $cached = @()
        if ($cacheFile -and (Test-Path $cacheFile)) {
            try { $cached = Get-Content $cacheFile -Raw -Encoding UTF8 | ConvertFrom-Json } catch {}
        }
        $emailList = @()
        if ($cached) { $emailList = $cached }
        return @{
            success = $false
            outlookRunning = $true
            message = "Outlook demoró en responder. Mostrando última copia guardada."
            emails = $emailList
        }
    }

    $out = Receive-Job $job
    Remove-Job $job -Force -ErrorAction SilentlyContinue

    if ($out.success -and $out.emails.Count -gt 0) {
        try {
            $out.emails | ConvertTo-Json -Depth 5 | Set-Content $cacheFile -Encoding UTF8
        } catch {}
    }

    return $out
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Servidor HTTP iniciado exitosamente." -ForegroundColor Green
    
    # Abrir navegador automáticamente solo si no se inició en modo silencioso (-Silent)
    if ($args -notcontains "-Silent") {
        try { Start-Process $prefix -ErrorAction SilentlyContinue } catch {}
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers para permitir peticiones desde GitHub Pages y cualquier tablet / IP
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "*")
        $response.AddHeader("Access-Control-Allow-Private-Network", "true")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $localPath = $request.Url.LocalPath

        # =======================================================
        # API: Escaneo de Outlook en tiempo real
        # =======================================================
        if ($localPath -eq "/api/scan-outlook") {
            $defaultKeywords = @("moonshine", "estructuras", "estructura", "mesas", "mesa", "carritos", "carrito", "carro", "carros", "racks", "rack", "estaciones", "estacion", "estación", "perfil", "perfiles")
            $keywordsList = $defaultKeywords
            if ($request.QueryString["keyword"]) {
                $rawParam = [System.Web.HttpUtility]::UrlDecode($request.QueryString["keyword"])
                if (-not $rawParam) { $rawParam = $request.QueryString["keyword"] }
                $splitKws = $rawParam -split "[,|;]" | ForEach-Object { $_.Trim().ToLower() } | Where-Object { $_ -ne "" }
                if ($splitKws.Count -gt 0) {
                    $keywordsList = $splitKws
                }
            }
            $limit = 20
            if ($request.QueryString["limit"]) {
                [int]::TryParse($request.QueryString["limit"], [ref]$limit) | Out-Null
            }

            $scanResult = Get-OutlookMoonshineEmails -Keywords $keywordsList -MaxResults $limit
            $jsonString = $scanResult | ConvertTo-Json -Depth 5
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)

            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # =======================================================
        # API: Abrir Outlook con búsqueda filtrada
        # =======================================================
        if ($localPath -eq "/api/open-outlook") {
            try {
                Start-Process "outlook.exe" -ErrorAction SilentlyContinue
                $respObj = @{ success = $true; message = "Outlook iniciado." }
            } catch {
                $respObj = @{ success = $false; message = $_.Exception.Message }
            }
            $jsonString = $respObj | ConvertTo-Json
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # =======================================================
        # API: Información de Red para compartir con Jefe
        # =======================================================
        if ($localPath -eq "/api/network-info") {
            $info = @{
                localUrl = $prefix
                networkUrl = $networkUrl
                ip = $localIp
                port = $port
            }
            $jsonString = $info | ConvertTo-Json
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # =======================================================
        # Servidor de Archivos Estáticos
        # =======================================================
        if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "/index.html"
        }

        $filePath = Join-Path $baseDir ($localPath.TrimStart('/'))

        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".csv"  { "text/csv; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".ico"  { "image/x-icon" }
                Default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mimeType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Archivo no encontrado")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Servidor detenido." -ForegroundColor Yellow
}

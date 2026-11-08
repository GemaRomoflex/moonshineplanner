@echo off
chcp 65001 >nul
title Instalador de Sincronizador Automatico de Outlook - Moonshine Axiom

set "INSTALL_DIR=%LOCALAPPDATA%\MoonshineAxiom"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_LAUNCHER=%STARTUP_DIR%\Moonshine_Outlook_AutoSync.vbs"
set "PS_SCRIPT=%INSTALL_DIR%\outlook_sync_service.ps1"

if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Copiar el motor de lectura de Outlook a la carpeta local del supervisor
copy /Y "%~dp0server.ps1" "%PS_SCRIPT%" >nul 2>&1

:: Si se descargó solo el .bat desde GitHub Pages sin server.ps1 al lado, generar el script embebido
if not exist "%PS_SCRIPT%" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$u = 'https://gemaromoflex.github.io/moonshineplanner/server.ps1'; try { Invoke-WebRequest -Uri $u -OutFile '%PS_SCRIPT%' -UseBasicParsing } catch {}"
)

:: Crear lanzador 100% invisible (cero ventanas) en el Inicio Automatico de Windows
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ""%PS_SCRIPT%"" -Silent", 0, False
) > "%VBS_LAUNCHER%"

:: Iniciar el servicio en segundo plano ahora mismo
cscript //nologo "%VBS_LAUNCHER%"

powershell -NoProfile -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('¡Listo! El Sincronizador Automático de Outlook quedó instalado en esta computadora.' + [Environment]::NewLine + [Environment]::NewLine + '• Correrá en silencio cada vez que enciendas tu laptop (sin abrir ventanas).' + [Environment]::NewLine + '• Al entrar a tu página de Moonshine en GitHub Pages, tus correos de Outlook se leerán automáticamente.', 'Moonshine Axiom — Auto-Sincronización Activada', 'OK', 'Information')"
exit

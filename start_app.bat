@echo off
title Moonshine Flow Manager - 24/7 Server ^& Outlook Sync
color 0B

echo ====================================================================
echo    MOONSHINE FLOW MANAGER ^| AXIOM MANUFACTURING 24/7
echo    Control de Pedidos, Secuenciacion y Escaner de Outlook
echo ====================================================================
echo.

:: Verificar si el servidor ya esta corriendo
netstat -ano | findstr :8080 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] El servidor Moonshine ya esta activo en el puerto 8080.
    echo Abriendo la aplicacion en tu navegador...
    start "" "http://localhost:8080"
    timeout /t 2 >nul
    exit
)

echo [INFO] Iniciando Servidor Local con conexion a Outlook...
echo [INFO] Se abrira una ventana con el servidor en segundo plano.
echo.

start "Moonshine Server 8080" powershell.exe -NoExit -ExecutionPolicy Bypass -File "%~dp0server.ps1"

timeout /t 2 >nul
exit

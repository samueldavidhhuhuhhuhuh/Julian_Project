@echo off
title BOT JULIAN - BAILEYS (NO CERRAR)
color 0E

echo.
echo ==========================================
echo    LIMPIEZA AUTOMATICA DE SESION
echo ==========================================

:: Comprobamos si existe la carpeta de sesión y la borramos
if exist "auth_info_baileys" (
    echo    Eliminando sesion antigua para evitar errores...
    rmdir /s /q "auth_info_baileys"
    echo    [OK] Sesion eliminada. Prepara tu celular para escanear.
) else (
    echo    [OK] Sistema limpio.
)

echo.
echo    INICIANDO MOTOR MODERNO (ESM)...
echo.
cd /d "%~dp0"
node bot.js
pause
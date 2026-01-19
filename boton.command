#!/bin/bash

# --- CONFIGURACIÓN INICIAL (Igual a @echo off y cd /d %~dp0) ---
# Nos aseguramos de estar en la carpeta correcta
cd "$(dirname "$0")"

# Configuración de colores (Simulando Color 0E - Amarillo)
YELLOW='\033[1;33m'
RESET='\033[0m'

# Poner título a la ventana (Best effort para Mac)
echo -n -e "\033]0;BOT JULIAN - BAILEYS (NO CERRAR)\007"

clear
echo ""
echo -e "${YELLOW}=========================================="
echo "    LIMPIEZA AUTOMATICA DE SESION"
echo "==========================================${RESET}"

# --- LÓGICA DE LIMPIEZA (Igual al IF EXIST) ---
if [ -d "auth_info_baileys" ]; then
    echo "    Eliminando sesion antigua para evitar errores..."
    rm -rf "auth_info_baileys"
    echo "    [OK] Sesion eliminada. Prepara tu celular para escanear."
else
    echo "    [OK] Sistema limpio."
fi

echo ""
echo -e "${YELLOW}    INICIANDO MOTOR MODERNO (ESM)...${RESET}"
echo ""

# --- EJECUCIÓN ---
node bot.js

# --- PAUSE (Para que la ventana no se cierre si hay error) ---
echo ""
read -p "Presiona Enter para cerrar..."
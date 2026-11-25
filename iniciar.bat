@echo off
REM =====================================================
REM  Baby Sarai - Iniciar la aplicacion (Windows)
REM  Evidencia GA8-220501096-AA1-EV02
REM  Doble clic sobre este archivo para:
REM    1. Revisar que Node.js este instalado
REM    2. Crear el archivo .env la primera vez
REM    3. Instalar las dependencias la primera vez
REM    4. Compilar el front-end si no existe dist
REM    5. Iniciar el servidor y abrir el navegador
REM  Requisito previo: MySQL encendido y scripts 001 a 004 ejecutados.
REM =====================================================
chcp 65001 >nul
title Baby Sarai - servidor
cd /d "%~dp0"

echo.
echo  ====================================
echo   Baby Sarai - tienda y panel
echo  ====================================
echo.

where node >nul 2>nul
if errorlevel 1 goto sinNode

if not exist ".env" goto crearEnv

if exist "node_modules" goto revisarFront
echo  Instalando dependencias del servidor. Solo pasa la primera vez...
call npm install --omit=dev
if errorlevel 1 goto error

:revisarFront
if exist "babysarai-frontend\dist\index.html" goto iniciar
echo  Compilando el front-end. Solo pasa la primera vez...
call npm run install:front
if errorlevel 1 goto error
call npm run build:front
if errorlevel 1 goto error

:iniciar
echo.
echo  Abriendo http://localhost:3000 en el navegador...
echo  Para detener el servidor cierra esta ventana o pulsa Ctrl + C.
echo.
start "" cmd /c "timeout /t 3 >nul & start http://localhost:3000"
call npm start
goto fin

:sinNode
echo  No se encontro Node.js en este equipo.
echo  Instala la version 20 o superior desde https://nodejs.org y vuelve a intentarlo.
goto fin

:crearEnv
copy ".env.example" ".env" >nul
echo  Se creo el archivo .env con la configuracion de ejemplo.
echo  Completa DB_PASSWORD con la clave de MySQL y JWT_SECRETO con un texto largo,
echo  guarda el archivo y vuelve a ejecutar iniciar.bat.
notepad ".env"
goto fin

:error
echo.
echo  Ocurrio un error. Revisa el mensaje de arriba.

:fin
echo.
pause

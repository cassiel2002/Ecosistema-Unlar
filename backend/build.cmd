@echo off
REM Script para compilar el proyecto

echo ========================================
echo  Compilando Ecosistema UNLAR Backend
echo ========================================
echo.

REM Configurar JAVA_HOME
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo Descargando dependencias y compilando...
echo Esto puede tardar unos minutos la primera vez.
echo.

REM Compilar sin ejecutar tests
.\mvnw.cmd clean install -DskipTests

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo  Compilacion exitosa!
    echo  Puedes ejecutar el proyecto con: run.cmd
) else (
    echo  Error en la compilacion
    echo  Revisa los mensajes de error arriba
)
echo ========================================
pause

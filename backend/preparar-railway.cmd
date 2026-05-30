@echo off
REM ============================================
REM Script para preparar el proyecto para Railway
REM ============================================

echo.
echo ========================================
echo   PREPARANDO PROYECTO PARA RAILWAY
echo ========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "pom.xml" (
    echo ERROR: No se encuentra pom.xml
    echo Ejecuta este script desde la carpeta ecosistema-backend
    pause
    exit /b 1
)

echo [1/4] Compilando el proyecto...
call mvn clean package -DskipTests
if errorlevel 1 (
    echo ERROR: Fallo la compilacion
    pause
    exit /b 1
)

echo.
echo [2/4] Verificando archivos de configuracion...
if not exist "nixpacks.toml" (
    echo ERROR: Falta nixpacks.toml
    pause
    exit /b 1
)
if not exist "Procfile" (
    echo ERROR: Falta Procfile
    pause
    exit /b 1
)
if not exist "system.properties" (
    echo ERROR: Falta system.properties
    pause
    exit /b 1
)
echo Todos los archivos de configuracion presentes!

echo.
echo [3/4] Verificando Git...
if not exist ".git" (
    echo Inicializando repositorio Git...
    git init
    git add .
    git commit -m "Initial commit - Backend para Railway"
    echo.
    echo IMPORTANTE: Ahora debes crear un repositorio en GitHub y ejecutar:
    echo git remote add origin https://github.com/TU_USUARIO/ecosistema-backend.git
    echo git push -u origin main
) else (
    echo Repositorio Git ya existe
)

echo.
echo [4/4] Mostrando resumen...
echo.
echo ========================================
echo   PROYECTO LISTO PARA RAILWAY
echo ========================================
echo.
echo Archivos creados:
echo   - nixpacks.toml
echo   - Procfile
echo   - system.properties
echo   - .env.example
echo   - application-prod.properties
echo.
echo Proximos pasos:
echo   1. Sube el codigo a GitHub
echo   2. Ve a railway.app
echo   3. Deploy from GitHub repo
echo   4. Configura las variables de entorno
echo   5. Generate Domain
echo.
echo Lee RAILWAY_QUICKSTART.md para mas detalles
echo.
pause

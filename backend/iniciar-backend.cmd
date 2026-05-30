@echo off
echo ========================================
echo Iniciando Backend Spring Boot
echo ========================================
echo.
echo Verificando Maven...
mvn -version
if errorlevel 1 (
    echo.
    echo ERROR: Maven no esta instalado o no esta en el PATH
    echo.
    echo Soluciones:
    echo 1. Cierra esta ventana y abre una NUEVA ventana de PowerShell
    echo 2. O ejecuta: refreshenv
    echo 3. O reinicia tu computadora
    echo.
    pause
    exit /b 1
)

echo.
echo Maven encontrado! Iniciando aplicacion...
echo.
echo Conectando a Supabase:
echo - Host: db.izameyyymxdlosrdllbb.supabase.co
echo - Puerto: 5432
echo - Database: postgres
echo.

mvn spring-boot:run

pause

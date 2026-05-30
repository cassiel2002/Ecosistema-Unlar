@echo off
REM Script para ejecutar el backend de Ecosistema UNLAR
REM Configura JAVA_HOME y ejecuta Spring Boot

echo ========================================
echo  Ecosistema UNLAR - Backend API
echo ========================================
echo.

REM Configurar JAVA_HOME
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java configurado: %JAVA_HOME%
echo.

REM Verificar versión de Java
java -version
echo.

echo Iniciando Spring Boot...
echo La aplicacion estara disponible en: http://localhost:8080
echo Presiona Ctrl+C para detener el servidor
echo.

REM Ejecutar Spring Boot
.\mvnw.cmd spring-boot:run

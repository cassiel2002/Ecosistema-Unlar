package com.unlar.ecosistema;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación Spring Boot
 * 
 * @SpringBootApplication es una anotación que combina:
 * - @Configuration: Indica que esta clase tiene configuraciones
 * - @EnableAutoConfiguration: Activa la configuración automática de Spring Boot
 * - @ComponentScan: Escanea el paquete buscando componentes (@Controller, @Service, etc)
 */
@SpringBootApplication
public class EcosistemaApplication {

    /**
     * Método main - Punto de entrada de la aplicación
     * SpringApplication.run() inicia el servidor embebido (Tomcat por defecto)
     */
    public static void main(String[] args) {
        SpringApplication.run(EcosistemaApplication.class, args);
    }
}

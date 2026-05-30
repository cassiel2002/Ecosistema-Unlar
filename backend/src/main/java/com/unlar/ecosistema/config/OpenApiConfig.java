package com.unlar.ecosistema.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración de OpenAPI/Swagger
 * Similar al Swagger de FastAPI
 */
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI ecosistemaOpenAPI() {
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8080");
        localServer.setDescription("Servidor de desarrollo local");
        
        Contact contact = new Contact();
        contact.setName("Equipo Ecosistema UNLAR");
        contact.setEmail("ecosistema@unlar.edu.ar");
        
        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");
        
        Info info = new Info()
                .title("Ecosistema UNLAR API")
                .version("1.0.0")
                .description("API REST para el ecosistema universitario de la UNLAR. " +
                        "Incluye gestión de alquileres, eventos, marketplace, foros y más.")
                .contact(contact)
                .license(license);
        
        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}

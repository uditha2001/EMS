package com.example.examManagementBackend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    private static final String GET = "GET";
    private static final String POST = "POST";
    private static final String PUT = "PUT";
    private static final String DELETE = "DELETE";
    private static final String OPTIONS = "OPTIONS";
    private static final String PATCH = "PATCH";

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:80", "http://localhost:3000")
                        .allowedMethods(GET, POST, PUT, DELETE, OPTIONS,PATCH)
                        .allowedHeaders("*")
                        .allowCredentials(true); // Enable cookies and Authorization headers
            }
        };
    }
}

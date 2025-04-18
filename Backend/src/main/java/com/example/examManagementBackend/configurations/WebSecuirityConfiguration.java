package com.example.examManagementBackend.configurations;

import com.example.examManagementBackend.ExceptionHandle.JwtAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecuirityConfiguration{
    @Autowired
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @Autowired
    JwtRequestFilter jwtRequestFilter;
    //create authentication manger
    @Bean
    public AuthenticationManager authenticationManagerBean(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    //customize the default websecurity config
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf->csrf.disable())
                .authorizeHttpRequests(authorizeRequests ->authorizeRequests
                        .requestMatchers(
                                "/swagger-ui.html", "/v3/api-docs/**", "/swagger-ui/**",
                                "/actuator/health", "/actuator/info",
                                "/ws/**",
                                "/sockjs-node/**"
                        ).permitAll()
                        .requestMatchers(
                                 "/api/v1/login/authentication",
                                "/api/v1/login/refresh-token",
                                "/api/v1/login/logout",
                                "/api/v1/login/verifyuser",
                                "/api/v1/login/otpValidate",
                                "/api/v1/login/updatePassword").permitAll()
                        .anyRequest().authenticated()


                )

                .sessionManagement(sessionManagement ->sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(exceptionHandling ->exceptionHandling
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                );
                http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
                http.cors();
                return http.build();


    }
    //create a password encoder
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

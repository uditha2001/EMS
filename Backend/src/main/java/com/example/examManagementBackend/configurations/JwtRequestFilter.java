package com.example.examManagementBackend.configurations;
import com.example.examManagementBackend.userManagement.userManagementServices.JwtServiceIMPL;
import com.example.examManagementBackend.utill.JwtUtill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    JwtUtill jwtUtill;

    private String userName = null;
    private String token = null;

    @Autowired
    private JwtServiceIMPL jwtServiceIMPL;

    // Define excluded paths
    private static final List<String> EXCLUDED_PATHS = List.of(
            "/api/v1/login/authentication",
            "/api/v1/login/refresh-token",
            "/swagger-ui.html",
            "/v3/api-docs",
            "/swagger-ui",
            "/api/v1/login/verifyuser",
            "/api/v1/login/otpValidate",
            "/api/v1/login/updatePassword",
            "/ws/**"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        String requestURI = request.getRequestURI();

        // Skip excluded paths
        if (EXCLUDED_PATHS.stream().anyMatch(requestURI::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            userName = jwtUtill.extractUserName(token);
        }

        try {
            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = jwtServiceIMPL.loadUserByUsername(userName);

                // Validate the token
                if (jwtUtill.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userName, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    throw new RuntimeException("Invalid Token");
                }
            }
            filterChain.doFilter(request, response);

        } catch (RuntimeException ex) {
            // Handle invalid token
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: " + ex.getMessage());
            response.getWriter().flush();
        }
    }
}

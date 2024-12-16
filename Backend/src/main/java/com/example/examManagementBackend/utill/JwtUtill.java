package com.example.examManagementBackend.utill;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtill {
    private static final String Secret_Key="SPAxim1@";

    public String extractUserName(String token) {
            return getClaimFromToken(token, Claims::getSubject);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver){
            final Claims claims=getAllClaimsFromToken(token);
            return claimsResolver.apply(claims);
    }
    public Claims getAllClaimsFromToken(String token) {
         return Jwts.parser().setSigningKey(Secret_Key).parseClaimsJws(token).getBody();
    }
    public Boolean validateToken(String token, UserDetailsService userDetailsService) {
        String username = extractUserName(token);
        return (username.equals(userDetailsService.loadUserByUsername(username).getUsername()) && isTokenValid(token));
    }

    private boolean isTokenValid(String token) {
        final Date expiration=getClaimFromToken(token,Claims::getExpiration);
        return !expiration.before(new Date());
    }


}

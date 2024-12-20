package com.example.examManagementBackend.utill;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Component
public class JwtUtill {
    private static final String SECRET_KEY="12345678920010900FutureSpaxim1hsecretkeyforproject12345678912345667456HttpTestinglooow9993772828";

    public String extractUserName(String token) {
            return getClaimFromToken(token, Claims::getSubject);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver){
            final Claims claims=getAllClaimsFromToken(token);
            return claimsResolver.apply(claims);
    }
    public Claims getAllClaimsFromToken(String token) {
         return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }
    public Boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        final Date expiration=getClaimFromToken(token,Claims::getExpiration);
        return !expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Objects> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+24*60*60*1000))
                .signWith(SignatureAlgorithm.HS512,SECRET_KEY)
                .compact();
    }


}

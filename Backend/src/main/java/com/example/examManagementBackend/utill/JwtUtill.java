package com.example.examManagementBackend.utill;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

@Component
public class JwtUtill {
    @Value("${secretKey}")
    private String SECRET_KEY;
    @Value("${accessTokenExpiration}")
    private Long acessTokenExpiration;
    @Value("${expiration}")
    private Long refreshTokenExpiration;
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

    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Objects> claims = new HashMap<>();
        return tokenGenarate(userDetails,acessTokenExpiration,claims);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Objects> claims = new HashMap<>();
        return tokenGenarate(userDetails,refreshTokenExpiration,claims);
    }

    private String tokenGenarate(UserDetails user,Long time,Map<String,Objects> claims) {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(user.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis()+time))
                    .signWith(SignatureAlgorithm.HS512,SECRET_KEY)
                    .compact();
        }



}

package com.example.demo.config;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    private Set<String> blacklistedTokens = new HashSet<>();

    private static final long VALIDITY_IN_MS = 360000000; // 1 hour

    // JWT 토큰 생성
    public String createToken(String username) {
        Claims claims = Jwts.claims().setSubject(username);
        Date now = new Date();
        Date validity = new Date(now.getTime() + VALIDITY_IN_MS);
        
        System.out.println("Creating token for username: " + username);
        System.out.println("Current time: " + now.getTime());
        System.out.println("Expiration time: " + validity.getTime());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();
    }

    // JWT 토큰에서 Claims 추출
    public Claims getClaims(String token) {
        try {
            token = token.trim();
            
            if (token.startsWith("Bearer ")) {
                token = token.substring(7); // "Bearer " 접두어 제거
            }    
            System.out.println("Parsing token: " + token);
            if (isTokenBlacklisted(token)) {
                throw new JwtException("Token is blacklisted");
            }
            return Jwts.parser()
                    .setSigningKey(secretKey.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Error parsing JWT token: " + e.getMessage());
            throw new JwtException("Invalid JWT token", e);
        }
    }
    

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        System.out.println("스프링에서 현재시간:"+new Date());
        try {
            Claims claims = getClaims(token);
            boolean isExpired = claims.getExpiration().before(new Date());
            System.out.println("Token is expired: " + isExpired);
            return !isExpired;
        } catch (JwtException e) {
            System.err.println("Invalid token: " + e.getMessage());
            return false;
        }
    }

    // JWT 토큰을 블랙리스트에 추가
    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    // JWT 토큰이 블랙리스트에 있는지 확인
    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}

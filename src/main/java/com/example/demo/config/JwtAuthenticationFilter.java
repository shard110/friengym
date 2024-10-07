package com.example.demo.config;

import java.io.IOException;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        // 요청에서 토큰 추출
        String token = resolveToken(request);

        System.out.println("Token: " + token);  // 토큰이 제대로 들어오는지 확인

        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                Claims claims = jwtTokenProvider.getClaims(token);
                System.out.println("Claims: " + claims.getSubject());  // 클레임이 제대로 추출되는지 확인

                // 인증 객체를 생성하여 SecurityContext에 설정
                JwtAuthentication authentication = new JwtAuthentication(claims);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                System.out.println("Invalid token or token is null.");
            }
        } catch (Exception e) {
            System.out.println("JWT processing failed: " + e.getMessage());
        }

        // 체이닝 진행
        chain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        System.out.println("Invalid or missing Authorization header");
        return null;
    }
}

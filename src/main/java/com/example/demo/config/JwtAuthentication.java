package com.example.demo.config;

import java.util.Collections;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;

public class JwtAuthentication extends AbstractAuthenticationToken implements UserDetails  {

    private final Claims claims;

    public JwtAuthentication(Claims claims) {
        super(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))); // 기본 역할 할당
        this.claims = claims;
        setAuthenticated(true); // JWT 토큰이 유효하면 인증 상태로 설정
    }

    @Override
    public Object getCredentials() {
        return null; // 자격 증명은 JWT 자체이므로 별도로 필요 없음
    }

    @Override
    public Object getPrincipal() {
        return claims.getSubject(); // JWT의 subject를 사용자 식별자로 사용
    }

    @Override
    public String getUsername() {
        return claims.getSubject();  // JWT 토큰의 subject를 사용자 이름으로 사용
    }

    @Override
    public String getPassword() {
        return null;  // JWT 기반 인증에서는 비밀번호가 필요 없으므로 null 반환
    }
}

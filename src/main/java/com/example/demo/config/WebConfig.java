package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry
            .addMapping("/**")  // 모든 경로에 대해 CORS 허용
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")  // PATCH 메서드 추가
            .allowedHeaders("*")
            .allowCredentials(true);  // 쿠키 및 인증 정보 허용
    }

    @Value("${file.ask-upload-dir}")
    private String askUploadDir;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
       // 쇼핑몰 이미지 제공 설정
       registry.addResourceHandler("/images/**")
       .addResourceLocations("classpath:/static/images/");

         // 문의 파일에 대한 리소스 핸들러
         registry.addResourceHandler("/uploads/askuploads/**")
         .addResourceLocations("file:" + askUploadDir + "/");
        
          // 게시판 파일 시스템 경로에서 파일 제공 설정
        registry.addResourceHandler("/files/**")
        .addResourceLocations("file:files/");
    }
}
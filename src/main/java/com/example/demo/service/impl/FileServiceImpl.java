package com.example.demo.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.FileService;

@Service
public class FileServiceImpl implements FileService {

    @Value("${file.path}") // application.properties에서 file.path 값을 가져옴
    private String filePath;

    // 파일 저장 메서드 구현
    @Override
    public String save(MultipartFile file) throws IOException {
        // 저장할 파일 이름 설정 (타임스탬프 + 원래 파일 이름)
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path targetPath = Paths.get(filePath + File.separator + fileName).toAbsolutePath().normalize();

        // 디렉터리가 없으면 생성
        Files.createDirectories(targetPath.getParent());

        // 파일을 targetPath에 저장
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // 저장된 파일의 경로 반환 (프론트엔드에서 접근할 수 있도록 상대 경로)
        return fileName;
    }

    // 파일 가져오는 메서드 구현
    @Override
    public Path getFile(String fileName) {
        return Paths.get(filePath).resolve(fileName).normalize();
    }
}

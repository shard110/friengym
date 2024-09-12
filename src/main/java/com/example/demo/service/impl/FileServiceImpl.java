package com.example.demo.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.FileService;

@Service
public class FileServiceImpl implements FileService {

    
    @Value("${file.path:files}")
    private String filePath;

    @Override
    public String save(MultipartFile file) {
        Path destinationPath = Paths.get(System.getProperty("user.dir")).resolve(filePath).resolve(file.getOriginalFilename());
        File destinationFile = destinationPath.toFile();

        destinationFile.getParentFile().mkdirs();

        try {
            file.transferTo(destinationFile);
            return file.getOriginalFilename();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Resource getFile(String fileName) {
        Path path = Paths.get(System.getProperty("user.dir")).resolve(filePath).resolve(fileName);

        try {
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error while loading file", e);
        }
    }
}
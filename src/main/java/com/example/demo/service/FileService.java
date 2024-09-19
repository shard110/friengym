package com.example.demo.service;

import java.io.IOException;
import java.nio.file.Path;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String save(MultipartFile file) throws IOException;
    Path getFile(String fileName);
	
}

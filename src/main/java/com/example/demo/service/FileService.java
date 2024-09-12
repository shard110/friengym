package com.example.demo.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

	String save(MultipartFile file); //파일 저장
	
	Resource getFile(String fileName); //파일 불러오기
		
	}
	
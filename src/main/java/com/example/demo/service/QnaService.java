package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.QnA;
import com.example.demo.repository.QnaRepository;

@Service
public class QnaService {
  
    @Autowired
    private QnaRepository qnaRepository;

    public List<QnA> getAllQnAs() {
        return qnaRepository.findAll();
    }

    public QnA getQnAById(int qNum) {
        Optional<QnA> qna = qnaRepository.findById(qNum);
        return qna.orElse(null);  // QnA 객체가 존재하지 않으면 null을 반환
    }


    public QnA addQna(QnA qna) {
        return qnaRepository.save(qna);
    }

    public void deleteQna(int qNum) {
        qnaRepository.deleteById(qNum);
    }
}

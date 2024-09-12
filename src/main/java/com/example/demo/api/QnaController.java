package com.example.demo.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.QnA;
import com.example.demo.service.QnaService;

@RestController
@RequestMapping("/api/qna")
public class QnaController {

    @Autowired
    private QnaService qnaService;

    @GetMapping
    public List<QnA> getAllQnas() {
        return qnaService.getAllQnAs();
    }

    @GetMapping("/{qNum}")
    public QnA getQnaById(@PathVariable int qNum) {
        return qnaService.getQnAById(qNum);
    }

    @PostMapping
    public QnA addQna(@RequestBody QnA qna) {
        return qnaService.addQna(qna);
    }

    @DeleteMapping("/{qNum}")
    public void deleteQna(@PathVariable int qNum) {
        qnaService.deleteQna(qNum);
    }


}

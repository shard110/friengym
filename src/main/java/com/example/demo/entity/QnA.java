package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Table(name = "qna")
@Entity
public class QnA {
  @Id
    @Column(name = "qnum")
    @JsonProperty("qNum")
    private int qNum;

    @Column(name = "qcate")
    @JsonProperty("qCate")
    private String qCate;

    @Column(name = "question")
    @JsonProperty("Question")
    private String Question;

    @Column(name = "qanswer")
    @JsonProperty("qAnswer")
    private String qAnswer;
}

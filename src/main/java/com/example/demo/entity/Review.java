package com.example.demo.entity;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name="review")
@Entity
public class Review {
  
    @Id
    @JsonProperty("rvNum")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rvNum;

    @Column(name = "star")
    @JsonProperty("star")
    private int star;

    @Column(name = "rvDate")
    @JsonProperty("rvDate")
    private Timestamp rvDate;

    @Column(name = "rvContents")
    @JsonProperty("rvContents")
    private String rvContents;

    @Column(name = "rvWarning")
    @JsonProperty("rvWarning")
    private int rvWarning;

    @ManyToOne
    @JoinColumn(name = "pnum")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "id")
    private User user;


}

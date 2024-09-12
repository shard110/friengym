package com.example.demo.exception;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(Integer poNum) {
        super("Could not find post with poNum " + poNum);
    }
}
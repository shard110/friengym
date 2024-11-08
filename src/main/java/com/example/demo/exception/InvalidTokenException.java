package com.example.demo.exception;

public class InvalidTokenException extends RuntimeException {
  public InvalidTokenException() {
      super();
  }

  public InvalidTokenException(String message) {
      super(message);
  }

  public InvalidTokenException(String message, Throwable cause) {
      super(message, cause);
  }
}
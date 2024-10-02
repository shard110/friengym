package com.example.demo.exception;

public class CommentNotFoundException extends RuntimeException{

  public CommentNotFoundException(Integer commentId) {
    super("Comment not found with id: " + commentId);
}

}

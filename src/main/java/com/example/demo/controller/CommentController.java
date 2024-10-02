package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.CommentResponse;
import com.example.demo.entity.Comment;
import com.example.demo.service.CommentService;
import com.example.demo.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/posts/{poNum}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private PostService postService;

   // 댓글 추가
   @PostMapping
   public ResponseEntity<CommentResponse> addComment(
           @PathVariable Integer poNum,
           @RequestBody @Valid CommentRequest commentRequest,
           @RequestHeader("Authorization") String authHeader) {

       String userId = postService.getUserIdFromToken(authHeader);
       Comment comment = commentService.addComment(poNum, commentRequest, userId);
       CommentResponse commentResponse = new CommentResponse(comment);
       return ResponseEntity.ok(commentResponse);
   }

   // 최상위 댓글 조회
   @GetMapping
   public ResponseEntity<List<CommentResponse>> getTopLevelComments(@PathVariable Integer poNum) {
       List<CommentResponse> comments = commentService.getTopLevelComments(poNum);
       return ResponseEntity.ok(comments);
   }

   // 특정 댓글의 답글 조회
   @GetMapping("/{parentId}/replies")
   public ResponseEntity<List<CommentResponse>> getReplies(
           @PathVariable Integer poNum,
           @PathVariable Integer parentId) {
       List<CommentResponse> replies = commentService.getReplies(parentId);
       return ResponseEntity.ok(replies);
   }

   // 댓글 수정
   @PutMapping("/{commentId}")
   public ResponseEntity<CommentResponse> updateComment(
           @PathVariable Integer poNum,
           @PathVariable Integer commentId,
           @RequestBody @Valid CommentRequest commentRequest,
           @RequestHeader("Authorization") String authHeader) {

       String userId = postService.getUserIdFromToken(authHeader);
       Comment updatedComment = commentService.updateComment(commentId, commentRequest, userId);
       CommentResponse commentResponse = new CommentResponse(updatedComment);
       return ResponseEntity.ok(commentResponse);
   }

   // 댓글 삭제
   @DeleteMapping("/{commentId}")
   public ResponseEntity<Void> deleteComment(
           @PathVariable Integer poNum,
           @PathVariable Integer commentId,
           @RequestHeader("Authorization") String authHeader) {

       String userId = postService.getUserIdFromToken(authHeader);
       commentService.deleteComment(commentId, userId);
       return ResponseEntity.noContent().build();
   }
}
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.PostRequest;
import com.example.demo.dto.PostResponse;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;

import com.example.demo.service.FileService;
import com.example.demo.service.PostService;


import java.util.Map;

import java.util.List;
import com.example.demo.dto.CommentResponse;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private FileService fileService;

    // 게시글 작성
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @ModelAttribute PostRequest postRequest,
            @RequestHeader("Authorization") String authHeader,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        // 게시글 내용이 비어 있는지 검증
        if (postRequest.getPoContents() == null || postRequest.getPoContents().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userId = postService.getUserIdFromToken(authHeader);
            // 게시글 생성
            Post post = postService.createPost(postRequest, file, userId);
            PostResponse response = new PostResponse(post);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 예외 발생 시 서버 오류 응답
            e.printStackTrace(); // 로깅 프레임워크 사용 권장
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 게시글 조회 (조회수 증가)
    @GetMapping("/{poNum}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable("poNum") Integer poNum) {
        try {
            // 게시글 조회 및 조회수 증가
            Post post = postService.getPostById(poNum);
            PostResponse response = new PostResponse(post);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 게시글이 존재하지 않을 경우 응답
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 게시글 수정
    @PutMapping("/{poNum}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable("poNum") Integer poNum,
            @ModelAttribute PostRequest postRequest,
            @RequestHeader("Authorization") String authHeader,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userId = postService.getUserIdFromToken(authHeader);
            // 게시글 수정
            Post updatedPost = postService.updatePost(poNum, postRequest, file, userId);
            PostResponse response = new PostResponse(updatedPost);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 서버 오류 발생 시 응답
            e.printStackTrace(); // 로깅 프레임워크 사용 권장
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 게시글 삭제
    @DeleteMapping("/{poNum}")
    public ResponseEntity<String> deletePost(
            @PathVariable("poNum") Integer poNum,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userId = postService.getUserIdFromToken(authHeader);
            // 게시글 삭제
            postService.deletePost(poNum, userId);
            return ResponseEntity.ok("Post with ID " + poNum + " has been deleted successfully.");
        } catch (IllegalArgumentException e) {
            // 권한 오류 시 응답
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this post.");
        } catch (Exception e) {
            // 서버 오류 발생 시 응답
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the post.");
        }
    }

    // 파일 다운로드
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable("filename") String filename) {
        try {
            // 파일 다운로드 처리
            Resource file = fileService.getFile(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (Exception e) {
            // 파일이 존재하지 않을 경우 응답
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 게시글 목록 조회 (페이징 및 검색)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPosts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", defaultValue = "") String search) {

        // 게시글 목록 조회
        Map<String, Object> posts = postService.getPagedPosts(page, size, search);
        return ResponseEntity.ok(posts);
    }

    // 댓글 추가
    @PostMapping("/{poNum}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable("poNum") Integer poNum,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userId = postService.getUserIdFromToken(authHeader);
            // 댓글 추가
            Comment comment = postService.addComment(poNum, commentRequest, userId);
            return ResponseEntity.ok(new CommentResponse(comment));
        } catch (Exception e) {
            // 댓글 추가 실패 시 응답
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 댓글 조회
    @GetMapping("/{poNum}/comments")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable("poNum") Integer poNum) {
        try {
            // 게시글에 대한 댓글 조회
            List<CommentResponse> comments = postService.getCommentsByPostId(poNum);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            // 댓글 조회 실패 시 응답
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 댓글 수정
    @PutMapping("{poNum}/comments/{commentNo}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable("commentNo") Integer commentNo,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userId = postService.getUserIdFromToken(authHeader);
            // 댓글 수정
            Comment updatedComment = postService.updateComment(commentNo, commentRequest, userId);
            return ResponseEntity.ok(new CommentResponse(updatedComment));
        } catch (Exception e) {
            // 댓글 수정 실패 시 응답
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 댓글 삭제
    @DeleteMapping("{poNum}/comments/{commentNo}")
    public ResponseEntity<String> deleteComment(
            @PathVariable("commentNo") Integer commentNo,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userId = postService.getUserIdFromToken(authHeader);
            // 댓글 삭제
            postService.deleteComment(commentNo, userId);
            return ResponseEntity.ok("Comment has been deleted successfully.");
        } catch (Exception e) {
            // 댓글 삭제 실패 시 응답
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the comment.");
        }
    }
}
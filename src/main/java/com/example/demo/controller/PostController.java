package com.example.demo.controller;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.PostRequest;
import com.example.demo.dto.PostResponse;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;
import com.example.demo.repository.PostRepository;
import com.example.demo.service.FileService;
import com.example.demo.service.PostService;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private FileService fileService;

    // 모든 게시글 조회
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        try {
            // 모든 게시글 조회
            List<Post> posts = postService.getAllPosts();
            // PostResponse로 변환하여 응답
            List<PostResponse> response = posts.stream()
                                            .map(PostResponse::new)
                                            .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 서버 오류 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // 게시글 작성
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @ModelAttribute PostRequest postRequest,
            @RequestHeader("Authorization") String authHeader,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        // JWT 토큰에서 사용자 ID 추출
    String userId = postService.getUserIdFromToken(authHeader);

    try {
        // 파일과 함께 게시글을 생성
        Post post = postService.createPost(postRequest, file, userId);
        PostResponse response = new PostResponse(post);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
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

    // 파일 다운로드 및 미리보기 설정
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            // 파일 경로에서 파일 가져오기
            Path filePath = fileService.getFile(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // 파일을 성공적으로 찾았을 때
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("파일을 읽을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
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

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/{poNum}/like")
    public ResponseEntity<Post> likePost(@PathVariable Integer poNum) {
    // poNum을 사용하여 Post를 찾음
    Post post = postRepository.findById(poNum)
            .orElseThrow(() -> new RuntimeException("Post not found"));
    post.setLikes(post.getLikes() + 1);
    postRepository.save(post);
    return ResponseEntity.ok(post);
}
}
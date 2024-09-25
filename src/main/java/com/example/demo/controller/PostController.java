package com.example.demo.controller;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.config.JwtTokenProvider;
import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.PostRequest;
import com.example.demo.dto.PostResponse;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;
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

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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

    // 게시글 조회 (조회수 증가 없음)
@GetMapping("/{poNum}")
public ResponseEntity<PostResponse> getPostById(@PathVariable("poNum") Integer poNum) {
    try {
        // 게시글만 조회
        Post post = postService.getPostById(poNum); // 조회수 증가 포함
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

  // 특정 해시태그로 게시글 조회
    @GetMapping("/hashtag/{tag}")
    public ResponseEntity<List<PostResponse>> getPostsByHashtag(@PathVariable("tag") String tag) {
        try {
            List<Post> posts = postService.getPostsByHashtag(tag);
            List<PostResponse> response = posts.stream()
                    .map(PostResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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

    // 게시글 좋아요 기능
    @PostMapping("/{poNum}/like")
    public ResponseEntity<?> incrementLikes(@PathVariable Integer poNum, @RequestHeader("Authorization") String authHeader) {
        try {
            String userId = postService.getUserIdFromToken(authHeader);
            Post post = postService.incrementLikes(poNum, userId);
            return ResponseEntity.ok(new PostResponse(post));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

// 검색 API
@GetMapping("/search")
public ResponseEntity<?> searchPosts(
        @RequestParam(required = false) String userId,
        @RequestParam(required = false) String content,
        @RequestParam(required = false) String hashtag) {

    List<Post> posts = postService.searchPosts(userId, content, hashtag);
    List<PostResponse> response = posts.stream()
            .map(PostResponse::new)
            .collect(Collectors.toList());

    return ResponseEntity.ok(response);
}

    // 인기 검색 키워드 API 추가
    @GetMapping("/popular-search")
    public ResponseEntity<List<String>> getPopularSearchKeywords() {
        List<String> popularKeywords = postService.getPopularSearchKeywords();
        return ResponseEntity.ok(popularKeywords);
    }

     @GetMapping("/fetch-metadata")
    public ResponseEntity<?> fetchMetadata(@RequestParam String url) {
        try {
            // URL 유효성 검사 및 정규화
            if (!url.startsWith("http")) {
                url = "http://" + url;
            }

            // Jsoup을 사용하여 문서 파싱
            Document doc = Jsoup.connect(url).get();

            // Open Graph 메타데이터 추출
            String title = doc.select("meta[property=og:title]").attr("content");
            String description = doc.select("meta[property=og:description]").attr("content");
            String image = doc.select("meta[property=og:image]").attr("content");

            // 만약 Open Graph 메타데이터가 없다면 일반 메타데이터 사용
            if (title.isEmpty()) {
                title = doc.title();
            }
            if (description.isEmpty()) {
                description = doc.select("meta[name=description]").attr("content");
            }

            Map<String, String> metadata = new HashMap<>();
            metadata.put("title", title);
            metadata.put("description", description);
            metadata.put("image", image);
            metadata.put("url", url);

            return ResponseEntity.ok(metadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메타데이터를 가져오는 데 실패했습니다.");
        }
    }

}
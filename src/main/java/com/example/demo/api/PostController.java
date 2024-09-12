// package com.example.demo.api;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// import com.example.demo.entity.Post;
// import com.example.demo.service.PostService;

// /**
//  * PostController
//  */
// @RestController
// @RequestMapping(value = "/list")
// public class PostController {
//     @Autowired
//     private PostService postService;

//     @GetMapping(value = "/posts")
//     public Map<String, Object> getPosts(@RequestParam(name = "page", defaultValue = "1") int page,
//                                          @RequestParam(name = "size", defaultValue = "10") int size) {
//         // 게시글 목록 가져오기
//         List<Post> posts = postService.getPosts(page, size);

//         // 총 게시글 수 가져오기
//         long totalPosts = postService.getTotalPostsCount();

//         // 응답 데이터 구성
//         Map<String, Object> response = new HashMap<>();
//         response.put("content", posts);
//         response.put("totalPages", (totalPosts + size - 1) / size); // 총 페이지 수 계산
//         response.put("totalPosts", totalPosts); // 총 게시글 수

//         return response;
//     }

// //     @RestControllerAdvice
// // public class GlobalExceptionHandler {

// //     @ExceptionHandler(Exception.class)
// //     public ResponseEntity<String> handleException(Exception ex) {
// //         // 예외 로그 출력
// //         ex.printStackTrace();
// //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error: " + ex.getMessage());
// //     }
// // }

// }
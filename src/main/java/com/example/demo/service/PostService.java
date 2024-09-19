package com.example.demo.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.config.JwtTokenProvider;
import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.PostRequest;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.exception.PostNotFoundException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private CommentRepository commentRepository; // 댓글 리포지토리 추가

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 모든 게시글 조회 메서드
    public List<Post> getAllPosts() {
        return postRepository.findAll(); // 모든 게시글을 조회
    }

    // JWT 토큰에서 사용자 ID 추출
    public String getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Invalid token");
        }
        return jwtTokenProvider.getClaims(token).getSubject();
    }

    // 사용자 ID로 User 조회
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    public Post createPost(PostRequest postRequest, MultipartFile file, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    
        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                fileUrl = fileService.save(file);  // 파일을 저장하고 파일 URL을 생성
            } catch (IOException e) {
                e.printStackTrace();
                // 필요에 따라 로그 기록 및 예외 처리 로직 추가
                throw new RuntimeException("파일 저장에 실패했습니다.", e);  // 적절한 예외를 던져 처리
            }
        }
    
        // Post 객체 생성 및 저장
        Post post = new Post();
        post.setUserId(userId);
        post.setPoContents(postRequest.getPoContents());
        post.setFileUrl(fileUrl);  // 파일 URL을 저장
        postRepository.save(post);
    
        return post;
    }
    

    public Post getPostById(Integer poNum) {
        incrementViewCount(poNum);
        return postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));
    }

    public void incrementViewCount(Integer poNum) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));
        post.setViewCnt(post.getViewCnt() + 1);
        postRepository.save(post);
    }

    // 게시글 업데이트
    public Post updatePost(Integer poNum, PostRequest postRequest, MultipartFile file, String userId) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("User not authorized to update this post");
        }

        post.setPoTitle(postRequest.getPoTitle());
        post.setPoContents(postRequest.getPoContents());

        if (file != null && !file.isEmpty()) {
            try {
                String fileUrl = fileService.save(file);
                post.setFileUrl(fileUrl);
            } catch (Exception e) {
                throw new RuntimeException("File save failed", e);
            }
        }

        return postRepository.save(post);
    }

    // 삭제하기

    public void deletePost(Integer poNum, String userId) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("User not authorized to delete this post");
        }

        postRepository.deleteById(poNum);
    }





    //좋아요 기능
    public Post incrementLikes(Integer poNum) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    ////////////////////////////////////////////
    // 댓글 추가
    public Comment addComment(Integer poNum, CommentRequest commentRequest, String userId) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // CommentRequest에서 User와 Post를 사용하여 Comment 엔티티 생성
        Comment comment = commentRequest.toEntity(user, post);
        return commentRepository.save(comment);
    }

    // 댓글 조회
    public List<CommentResponse> getCommentsByPostId(Integer poNum) {
        List<Comment> comments = commentRepository.findByPost_PoNum(poNum);
        return comments.stream().map(CommentResponse::new).collect(Collectors.toList());
    }

    // 댓글 수정
    public Comment updateComment(Integer commentNo, CommentRequest commentRequest, String userId) {
        Comment comment = commentRepository.findById(commentNo)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 수정할 권한이 없습니다.");
        }

        comment.setComment(commentRequest.getComment());
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    public void deleteComment(Integer commentNo, String userId) {
        Comment comment = commentRepository.findById(commentNo)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 삭제할 권한이 없습니다.");
        }

        commentRepository.deleteById(commentNo);
    }
}
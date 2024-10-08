package com.example.demo.service;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.config.JwtTokenProvider;
import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.PostRequest;
import com.example.demo.dto.PostResponse;
import com.example.demo.entity.Hashtag;
import com.example.demo.entity.Notification;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.entity.Warning;
import com.example.demo.exception.PostNotFoundException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.HashtagRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WarningRepository;

import jakarta.transaction.Transactional;


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
    private HashtagRepository hashtagRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CommentService commentService;

    @Autowired
    private WarningRepository warningRepository;

    //유저 게시물 가져오기
    public List<Post> getPostsByUser(User user) {
        return postRepository.findByUser(user);
    }
    
    
    public Post savePost(Post post) {
        return postRepository.save(post);
    }


    // 모든 게시글 조회 메서드
    public List<Post> getAllPosts() {
        return postRepository.findAllWithUserOrderedByDateDesc();
    }

     // 조회수 증가 없는 게시글 조회 메서드 추가
     public Post getPostByIdWithoutIncrementingView(Integer poNum) {
        return postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum)); // 게시글이 없으면 예외 발생
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

    // 게시글 생성
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
        post.setUser(user);
        post.setUserId(userId);
        post.setPoContents(postRequest.getPoContents());
        post.setFileUrl(fileUrl);  // 파일 URL을 저장
        postRepository.save(post);
    
       // 해시태그 처리
       Set<Hashtag> hashtags = processHashtags(postRequest.getHashtags());
       post.setHashtags(hashtags);

       return  postRepository.save(post);

    }
    


    // 게시글 조회 메서드
    @Transactional
    public PostResponse getPostById(Integer poNum) {
    Post post = postRepository.findById(poNum)
            .orElseThrow(() -> new PostNotFoundException(poNum));
    post.setViewCnt(post.getViewCnt() + 1);
    postRepository.save(post);

    // 모든 댓글과 답글을 가져옵니다.
        List<CommentResponse> comments = commentService.getTopLevelComments(poNum);

        return new PostResponse(post, comments);
  
}


    // 게시글 수정
    public Post updatePost(Integer poNum, PostRequest postRequest, MultipartFile file, String userId) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("User not authorized to update this post");
        }

        post.setPoContents(postRequest.getPoContents());

        // 해시태그 처리
        Set<Hashtag> hashtags = processHashtags(postRequest.getHashtags());
        post.setHashtags(hashtags);

        if (file != null && !file.isEmpty()) {
            try {
                String fileUrl = fileService.save(file);
                post.setFileUrl(fileUrl);
            } catch (Exception e) {
                throw new RuntimeException("File save failed", e);
            }
        } else {
        // 파일이 없으면 기존 파일 유지
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

     // 해시태그 처리 메서드
     private Set<Hashtag> processHashtags(List<String> tagStrings) {
        return tagStrings.stream().map(tag -> {
            return hashtagRepository.findByTag(tag)
                    .orElseGet(() -> new Hashtag(tag));
        }).collect(Collectors.toSet());
    }

    // 특정 해시태그로 게시글 조회
    public List<Post> getPostsByHashtag(String tag) {
        return postRepository.findByHashtag(tag);
    }



    //좋아요 기능
    public Post incrementLikes(Integer poNum, String userId) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));

        User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException(userId));

         // 유저가 해당 게시글에 좋아요를 이미 눌렀는지 확인
         if (user.getLikedPosts().contains(post)) {
            throw new IllegalArgumentException("이미 이 게시글에 좋아요를 눌렀습니다.");
        }
         // 유저의 likedPosts에 추가
         user.getLikedPosts().add(post);
         userRepository.save(user);

        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);

        // 알림 생성 로직 추가
        if (!post.getUser().getId().equals(userId)) {
            User sender = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));
            Notification notification = new Notification();
            notification.setRecipient(post.getUser());
            notification.setSender(sender);
            notification.setType(Notification.NotificationType.LIKE);
            notification.setPost(post);
            notificationRepository.save(notification);
        }
        
        return post;
    }


    // 인기 검색 키워드 추적을 위한 맵 (간단한 예시)
    private ConcurrentHashMap<String, AtomicInteger> searchKeywordFrequency = new ConcurrentHashMap<>();

    // 검색 메서드
    public List<Post> searchPosts(String userId, String content, String hashtag) {
        Specification<Post> spec = Specification.where(null);

        if (userId != null && !userId.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("user").get("id"), userId));
            incrementKeywordFrequency(userId);
        }

        if (content != null && !content.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("poContents"), "%" + content + "%"));
            incrementKeywordFrequency(content);
        }

        if (hashtag != null && !hashtag.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.join("hashtags").get("tag"), hashtag));
            incrementKeywordFrequency(hashtag);
        }

        return postRepository.findAll(spec);
    }

    // 인기 검색 키워드 가져오기 (상위 5개)
    public List<String> getPopularSearchKeywords() {
        return searchKeywordFrequency.entrySet()
                .stream()
                .sorted((e1, e2) -> e2.getValue().get() - e1.getValue().get())
                .limit(5)
                .map(e -> e.getKey())
                .collect(Collectors.toList());
    }

    // 키워드 빈도 증가 메서드
    private void incrementKeywordFrequency(String keyword) {
        searchKeywordFrequency.computeIfAbsent(keyword, k -> new AtomicInteger(0)).incrementAndGet();
    }

    public List<CommentResponse> getCommentsByPostId(Integer poNum) {
        return commentService.getTopLevelComments(poNum);
    }


   // 게시글 신고 메서드
   public void reportPost(Integer poNum, String userId, String reason) throws PostNotFoundException {
    // 게시글 존재 여부 확인
    Post post = postRepository.findById(poNum)
            .orElseThrow(() -> new PostNotFoundException(poNum));

    // 유저 존재 여부 확인
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

    // 이미 해당 유저가 신고했는지 확인 (중복 신고 방지)
    boolean alreadyReported = hasUserAlreadyReported(poNum, userId);

    if (alreadyReported) {
        throw new IllegalArgumentException("이미 신고한 게시글입니다.");
    }

    // 신고 사유가 비어 있으면 예외 처리
    if (reason == null || reason.trim().isEmpty()) {
        throw new IllegalArgumentException("신고 사유를 입력해주세요.");
    }

    // 신고 정보 저장
    Warning warning = new Warning(post, user, reason);
    warningRepository.save(warning);
}

     // 유저가 해당 게시글을 이미 신고했는지 확인하는 메서드
     public boolean hasUserAlreadyReported(Integer poNum, String userId) {
        // Warning 테이블에서 특정 게시글에 대한 특정 유저의 신고가 있는지 확인
        List<Warning> warnings = warningRepository.findByPostPoNum(poNum);
        return warnings.stream()
            .anyMatch(warning -> warning.getUser().getId().equals(userId));
    }

}
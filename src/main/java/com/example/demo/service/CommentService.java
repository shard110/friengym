package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.CommentResponse;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Notification;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.exception.CommentNotFoundException;
import com.example.demo.exception.PostNotFoundException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;

@Service
public class CommentService {

@Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public Comment addComment(Integer poNum, CommentRequest commentRequest, String userId) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // 부모 댓글 설정
        Comment parentComment = null;
        if (commentRequest.getParentId() != null) {
            parentComment = commentRepository.findById(commentRequest.getParentId())
                    .orElseThrow(() -> new CommentNotFoundException(commentRequest.getParentId()));
        }

        // Comment 엔티티 생성
        Comment comment = commentRequest.toEntity(user, post, parentComment);

        commentRepository.save(comment);

        // 알림 생성 로직
        if (!post.getUser().getId().equals(userId)) {
            Notification notification = new Notification();
            notification.setRecipient(post.getUser());
            notification.setSender(user);
            notification.setType(Notification.NotificationType.COMMENT);
            notification.setPost(post);
            notificationRepository.save(notification);
        }

        return comment;
    }

    // 최상위 댓글(부모가 없는 댓글) 조회
    public List<CommentResponse> getTopLevelComments(Integer poNum) {
        List<Comment> comments = commentRepository.findByPostPoNumAndParentIsNull(poNum);
        return comments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 특정 댓글의 답글 조회
    public List<CommentResponse> getReplies(Integer parentId) {
        Comment parentComment = commentRepository.findById(parentId)
                .orElseThrow(() -> new CommentNotFoundException(parentId));
        List<Comment> replies = commentRepository.findByParent(parentComment);
        return replies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 댓글 수정
    @Transactional
    public Comment updateComment(Integer commentId, CommentRequest request, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 수정할 권한이 없습니다.");
        }

        comment.setComment(request.getComment());
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Integer commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 삭제할 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }

    // DTO 변환 메서드
    private CommentResponse convertToResponse(Comment comment) {
      return new CommentResponse(comment);
  }

}

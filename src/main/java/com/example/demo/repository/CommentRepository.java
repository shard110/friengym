package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPost_PoNum(Integer poNum);
        // Post에 대한 댓글 수를 반환하는 메서드 추가
        int countByPost(Post post);

        // 특정 게시글의 최상위 댓글 조회
        List<Comment> findByPostPoNumAndParentIsNull(Integer poNum);
    
        // 특정 댓글의 답글 조회
        List<Comment> findByParent(Comment parent);

}
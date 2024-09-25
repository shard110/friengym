package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    // 모든 게시글을 최신순으로 조회하는 메서드
    List<Post> findAllByOrderByPoDateDesc();

    // 좋아요 수가 많은 게시글 10개 가져오기
    List<Post> findTop10ByOrderByLikesDesc();
    
    // 내용으로 검색할 수 있는 메서드
    List<Post> findByPoContents(String poContents);

    // 특정 해시태그를 가진 게시글 조회
   @Query("SELECT p FROM Post p JOIN p.hashtags h WHERE h.tag = :tag")
    List<Post> findByHashtag(@Param("tag") String tag);

    // 여러 해시태그를 포함한 게시글을 찾기 위한 메서드
    @Query("SELECT DISTINCT p FROM Post p JOIN p.hashtags h WHERE h.tag IN :tags")
    List<Post> findByHashtagsIn(@Param("tags") List<String> tags);

    // 최신 게시글 10개 가져오기 (추가)
    List<Post> findTop10ByOrderByPoDateDesc();



}
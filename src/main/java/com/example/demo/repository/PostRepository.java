package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    // 최신 순으로 게시글 조회
    @Query("SELECT p FROM Post p ORDER BY p.poDate DESC")
    List<Post> findAllByOrderByPoDateDesc();
    
    // 내용으로 검색할 수 있는 메서드
    List<Post> findByPoContents(String poContents);

    @Query("SELECT p FROM Post p JOIN p.hashtags h WHERE h = :hashtag")
    List<Post> findByHashtag(String hashtag);

    // 여러 해시태그를 포함한 게시글을 찾기 위한 메서드
    List<Post> findByHashtagsIn(List<String> hashtags);


    // 특정 해시태그를 가진 게시글 조회
    List<Post> findByHashtags_Tag(String tag);

    // 여러 해시태그 중 하나라도 포함하는 게시글 조회
    List<Post> findByHashtags_TagIn(List<String> tags);

}
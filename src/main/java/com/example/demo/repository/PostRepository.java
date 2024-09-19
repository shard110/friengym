package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    
    // 내용으로 검색할 수 있는 메서드
    List<Post> findByPoContents(String poContents);

    // 단일 해시태그로 게시글 검색
    List<Post> findByHashtagsContaining(String hashtag);

    // 여러 해시태그를 포함한 게시글을 찾기 위한 메서드
    List<Post> findByHashtagsIn(List<String> hashtags);

}
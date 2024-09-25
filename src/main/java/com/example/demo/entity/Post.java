package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode(exclude = {"hashtags", "post"})
@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ponum") // 데이터베이스 컬럼 이름
    private Integer poNum; // 게시글 번호

    @Column(name = "poContents", nullable = false, length = 4000)
    private String poContents;

    @Column(name = "poDate", updatable = false)
    private LocalDateTime poDate;

    @Column(name = "updatedDate")
    private LocalDateTime updatedDate; // 수정 날짜 추가

    @Column(name = "viewcnt", nullable = false)
    private int viewCnt = 0; // 기본값 설정

    @Column(name = "replycnt", nullable = false)
    private int replyCnt = 0;

    @Column(name = "fileUrl", length = 500) // 파일 URL 컬럼 추가
    private String fileUrl;

    @Column(name = "likes", nullable = false)
    private int likes = 0;


    @ManyToOne // 다대일 관계를 설정합니다.
    @JoinColumn(name = "id", nullable = false) // 외래키 컬럼 이름
    private User user; // 작성자 (User 엔티티와 연결)

    @Transient
    private String userId; // 데이터베이스에 저장되지않음(DTO와 상호작용하는데 사용됨)

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference
    @OrderBy("createdDate desc") // 댓글 정렬 기준: 최근 날짜가 위로
    private List<Comment> comments;

    // 생성자
    public Post( String poContents, User user) {
   
        this.poContents = poContents;
        this.user = user; // User 객체 설정
        this.poDate = LocalDateTime.now();
        this.replyCnt = 0; // 기본값 설정
    }

    @PrePersist
    public void onCreate() {
        this.poDate = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "post_hashtags",
        joinColumns = @JoinColumn(name = "post_id", referencedColumnName = "ponum"),
        inverseJoinColumns = @JoinColumn(name = "hashtag_id", referencedColumnName = "hashid")
    )
    private Set<Hashtag> hashtags = new HashSet<>();
    


}
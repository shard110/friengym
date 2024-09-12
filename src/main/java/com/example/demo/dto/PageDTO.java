package com.example.demo.dto;

import lombok.Data;

@Data
public class PageDTO {
    // 페이징 기본값
    private static final int PAGE_NUM = 1; // 현재 페이지 번호 기본값
    private static final int ROWS = 10; // 페이지당 게시글 수 기본값
    private static final int COUNT = 10; // 노출 페이지 개수 기본값

    private int page; // 페이지 번호
    private int rows; // 페이지당 글 수
    private int count; // 노출 페이지 개수
    private int total; // 전체 데이터 개수

    private int start; // 시작 번호
    private int end; // 끝 번호
    private int first; // 첫 번호
    private int last; // 마지막 번호

    private int prev; // 이전 번호
    private int next; // 다음 번호

    private int index; // 데이터 순서 번호

    // 생성자
    public PageDTO() {
        this(0);
    }

    public PageDTO(int total) {
        this(PAGE_NUM, total);
    }

    public PageDTO(int page, int total) {
        this(page, ROWS, COUNT, total);
    }

    public PageDTO(int page, int rows, int count, int total) {
        this.page = page;
        this.rows = rows;
        this.count = count;
        this.total = total;
        calc();
    }
    public void calc() {
        // 첫 번호
        this.first = 1;

        // 마지막 번호
        this.last = (this.total - 1) / rows + 1;

        // 시작 번호
        this.start = ((page - 1) / count) * count + 1;

        // 끝 번호
        this.end = ((page - 1) / count + 1) * count;
        if (this.end > this.last) {
            this.end = this.last;
        }

        // 이전 번호
        this.prev = (this.page > 1) ? this.page - 1 : 1;

        // 다음 번호
        this.next = (this.page < this.last) ? this.page + 1 : this.last;

        // 데이터 순서 번호(index)
        this.index = (this.page - 1) * this.rows;
    }
}
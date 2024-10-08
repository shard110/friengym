package com.example.demo.appointmentscheduler.model;

import java.time.LocalTime;
import java.util.Objects;

public class TimePeroid implements Comparable<TimePeroid> {

    // 시간 기간의 시작 시간
    private LocalTime start;
    
    // 시간 기간의 종료 시간
    private LocalTime end;

    // 기본 생성자
    public TimePeroid() {
    }

    // 시작 시간과 종료 시간으로 시간 기간을 초기화하는 생성자
    public TimePeroid(LocalTime start, LocalTime end) {
        this.start = start;
        this.end = end;
    }

    // 시작 시간을 반환하는 getter
    public LocalTime getStart() {
        return start;
    }

    // 시작 시간을 설정하는 setter
    public void setStart(LocalTime start) {
        this.start = start;
    }

    // 종료 시간을 반환하는 getter
    public LocalTime getEnd() {
        return end;
    }

    // 종료 시간을 설정하는 setter
    public void setEnd(LocalTime end) {
        this.end = end;
    }

    // 이 TimePeroid 객체를 다른 객체와 비교하여 시작 시간에 따라 정렬
    @Override
    public int compareTo(TimePeroid o) {
        return this.getStart().compareTo(o.getStart());
    }

    // 두 TimePeroid 객체가 시작 시간과 종료 시간이 같은지 비교
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TimePeroid peroid = (TimePeroid) o;
        return this.start.equals(peroid.getStart()) &&
               this.end.equals(peroid.getEnd());
    }

    // 해시 코드를 생성
    @Override
    public int hashCode() {
        return Objects.hash(start, end);
    }

    // TimePeroid 객체의 문자열 표현
    @Override
    public String toString() {
        return "TimePeroid{" +
                "start=" + start +
                ", end=" + end +
                '}';
    }
}
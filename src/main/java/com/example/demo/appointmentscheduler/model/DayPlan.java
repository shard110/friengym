package com.example.appointmentscheduler.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// DayPlan 클래스는 하루의 근무 시간을 나타내며, 휴식 시간을 관리함.
public class DayPlan {

    private TimePeroid workingHours; // 근무 시간을 저장하는 필드
    private List<TimePeroid> breaks; // 휴식 시간을 저장하는 리스트

    // 기본 생성자
    public DayPlan() {
        breaks = new ArrayList<>(); // 휴식 시간 리스트 초기화
    }

    // 휴식 시간을 제외한 시간대를 반환하는 메소드
    public List<TimePeroid> timePeroidsWithBreaksExcluded() {
        ArrayList<TimePeroid> timePeroidsWithBreaksExcluded = new ArrayList<>();
        timePeroidsWithBreaksExcluded.add(getWorkingHours()); // 근무 시간을 추가

        List<TimePeroid> breaks = getBreaks(); // 휴식 시간 리스트 가져오기

        if (!breaks.isEmpty()) {
            ArrayList<TimePeroid> toAdd = new ArrayList<>(); // 추가할 시간대 리스트

            // 각 휴식 시간에 대해 처리
            for (TimePeroid break1 : breaks) {
                // 휴식 시작 시간이 근무 시작 시간보다 이전인 경우 조정
                if (break1.getStart().isBefore(workingHours.getStart())) {
                    break1.setStart(workingHours.getStart());
                }
                // 휴식 종료 시간이 근무 종료 시간보다 이후인 경우 조정
                if (break1.getEnd().isAfter(workingHours.getEnd())) {
                    break1.setEnd(workingHours.getEnd());
                }

                // 각 시간대에 대해 휴식 시간 조정
                for (TimePeroid peroid : timePeroidsWithBreaksExcluded) {
                    if (break1.getStart().equals(peroid.getStart()) && break1.getEnd().isAfter(peroid.getStart()) && break1.getEnd().isBefore(peroid.getEnd())) {
                        peroid.setStart(break1.getEnd()); // 휴식 후 시작 시간 조정
                    }
                    if (break1.getStart().isAfter(peroid.getStart()) && break1.getStart().isBefore(peroid.getEnd()) && break1.getEnd().equals(peroid.getEnd())) {
                        peroid.setEnd(break1.getStart()); // 휴식 전 종료 시간 조정
                    }
                    if (break1.getStart().isAfter(peroid.getStart()) && break1.getEnd().isBefore(peroid.getEnd())) {
                        toAdd.add(new TimePeroid(peroid.getStart(), break1.getStart())); // 새로운 시간대 추가
                        peroid.setStart(break1.getEnd()); // 기존 시간대 조정
                    }
                }
            }
            timePeroidsWithBreaksExcluded.addAll(toAdd); // 새로운 시간대 리스트 추가
            Collections.sort(timePeroidsWithBreaksExcluded); // 정렬
        }

        return timePeroidsWithBreaksExcluded; // 결과 반환
    }

    // 근무 시간을 반환하는 메소드
    public TimePeroid getWorkingHours() {
        return workingHours;
    }

    // 근무 시간을 설정하는 메소드
    public void setWorkingHours(TimePeroid workingHours) {
        this.workingHours = workingHours;
    }

    // 휴식 시간 리스트를 반환하는 메소드
    public List<TimePeroid> getBreaks() {
        return breaks;
    }

    // 휴식 시간 리스트를 설정하는 메소드
    public void setBreaks(List<TimePeroid> breaks) {
        this.breaks = breaks;
    }

    // 특정 휴식 시간을 제거하는 메소드
    public void removeBreak(TimePeroid breakToRemove) {
        breaks.remove(breakToRemove);
    }

    // 새로운 휴식 시간을 추가하는 메소드
    public void addBreak(TimePeroid breakToAdd) {
        breaks.add(breakToAdd);
    }
}
package com.example.demo.appointmentscheduler.entity;

import com.fasterxml.jackson.databind.introspect.AccessorNamingStrategy.Provider;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import java.time.LocalTime;

// 트레이너 작업 계획을 나타내는 엔티티
@TypeDefs(@TypeDef(name = "json", typeClass = JsonStringType.class))
@Entity
@Table(name = "working_plans") // 데이터베이스의 'working_plans' 테이블과 매핑
public class WorkingPlan {

    @Id
    @Column(name = "id_provider") // 트레이너 ID
    private int id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "id_provider") // 트레이너와의 관계를 매핑
    private Provider provider; // 트레이너

    // 요일별 작업 계획
    @Type(type = "json")
    @Column(columnDefinition = "json", name = "monday")
    private DayPlan monday;

    @Type(type = "json")
    @Column(columnDefinition = "json", name = "tuesday")
    private DayPlan tuesday;

    @Type(type = "json")
    @Column(columnDefinition = "json", name = "wednesday")
    private DayPlan wednesday;

    @Type(type = "json")
    @Column(columnDefinition = "json", name = "thursday")
    private DayPlan thursday;

    @Type(type = "json")
    @Column(columnDefinition = "json", name = "friday")
    private DayPlan friday;

    @Type(type = "json")
    @Column(columnDefinition = "json", name = "saturday")
    private DayPlan saturday;

    @Type(type = "json")
    @Column(columnDefinition = "json", name = "sunday")
    private DayPlan sunday;

    // 기본 생성자
    public WorkingPlan() {
    }

    // Getter 및 Setter 메소드
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Provider getProvider() { // Provider 객체를 반환
        return provider;
    }

    public void setProvider(Provider provider) {
        this.provider = provider;
    }

    // 특정 요일의 작업 계획을 반환하는 메소드
    public DayPlan getDay(String day) {
        switch (day) {
            case "monday":
                return monday;
            case "tuesday":
                return tuesday;
            case "wednesday":
                return wednesday;
            case "thursday":
                return thursday;
            case "friday":
                return friday;
            case "saturday":
                return saturday;
            case "sunday":
                return sunday;
            default:
                return null;
        }
    }

    // 요일별 작업 계획에 대한 Getter 및 Setter
    public DayPlan getMonday() {
        return monday;
    }

    public void setMonday(DayPlan monday) {
        this.monday = monday;
    }

    public DayPlan getTuesday() {
        return tuesday;
    }

    public void setTuesday(DayPlan tuesday) {
        this.tuesday = tuesday;
    }

    public DayPlan getWednesday() {
        return wednesday;
    }

    public void setWednesday(DayPlan wednesday) {
        this.wednesday = wednesday;
    }

    public DayPlan getThursday() {
        return thursday;
    }

    public void setThursday(DayPlan thursday) {
        this.thursday = thursday;
    }

    public DayPlan getFriday() {
        return friday;
    }

    public void setFriday(DayPlan friday) {
        this.friday = friday;
    }

    public DayPlan getSaturday() {
        return saturday;
    }

    public void setSaturday(DayPlan saturday) {
        this.saturday = saturday;
    }

    public DayPlan getSunday() {
        return sunday;
    }

    public void setSunday(DayPlan sunday) {
        this.sunday = sunday;
    }

    // 기본 작업 계획 생성 메소드
    public static WorkingPlan generateDefaultWorkingPlan() {
        WorkingPlan wp = new WorkingPlan();
        LocalTime defaultStartHour = LocalTime.parse("06:00");
        LocalTime defaultEndHour = LocalTime.parse("18:00");
        TimePeriod defaultWorkingPeriod = new TimePeriod(defaultStartHour, defaultEndHour); // 기본 근무 기간 설정
        DayPlan defaultDayPlan = new DayPlan();
        defaultDayPlan.setWorkingHours(defaultWorkingPeriod);
        wp.setMonday(defaultDayPlan);
        wp.setTuesday(defaultDayPlan);
        wp.setWednesday(defaultDayPlan);
        wp.setThursday(defaultDayPlan);
        wp.setFriday(defaultDayPlan);
        wp.setSaturday(defaultDayPlan);
        wp.setSunday(defaultDayPlan);
        return wp;
    }
}
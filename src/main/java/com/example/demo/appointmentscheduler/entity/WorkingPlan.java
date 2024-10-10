package com.example.demo.appointmentscheduler.entity;

import jakarta.persistence.*;
import com.example.demo.appointmentscheduler.model.DayPlan;
import com.example.demo.appointmentscheduler.model.TimePeriod;

import java.time.LocalTime;

@Entity
@Table(name = "working_plans")
public class WorkingPlan {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_trainer")
    private int id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "id_trainer")
    private Trainer trainer;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "workingHours.start", column = @Column(name = "monday_working_hours_start")),
        @AttributeOverride(name = "workingHours.end", column = @Column(name = "monday_working_hours_end"))
    })
    private DayPlan monday;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "workingHours.start", column = @Column(name = "tuesday_working_hours_start")),
        @AttributeOverride(name = "workingHours.end", column = @Column(name = "tuesday_working_hours_end"))
    })
    private DayPlan tuesday;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "workingHours.start", column = @Column(name = "wednesday_working_hours_start")),
        @AttributeOverride(name = "workingHours.end", column = @Column(name = "wednesday_working_hours_end"))
    })
    private DayPlan wednesday;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "workingHours.start", column = @Column(name = "thursday_working_hours_start")),
        @AttributeOverride(name = "workingHours.end", column = @Column(name = "thursday_working_hours_end"))
    })
    private DayPlan thursday;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "workingHours.start", column = @Column(name = "friday_working_hours_start")),
        @AttributeOverride(name = "workingHours.end", column = @Column(name = "friday_working_hours_end"))
    })
    private DayPlan friday;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "workingHours.start", column = @Column(name = "saturday_working_hours_start")),
        @AttributeOverride(name = "workingHours.end", column = @Column(name = "saturday_working_hours_end"))
    })
    private DayPlan saturday;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "workingHours.start", column = @Column(name = "sunday_working_hours_start")),
        @AttributeOverride(name = "workingHours.end", column = @Column(name = "sunday_working_hours_end"))
    })
    private DayPlan sunday;

    public WorkingPlan() {
        monday = new DayPlan();
        tuesday = new DayPlan();
        wednesday = new DayPlan();
        thursday = new DayPlan();
        friday = new DayPlan();
        saturday = new DayPlan();
        sunday = new DayPlan();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Trainer getTrainer() {
        return trainer;
    }

    public void setTrainer(Trainer trainer) {
        this.trainer = trainer;
    }

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

    public DayPlan getDay(String day) {
        return switch (day.toLowerCase()) {
            case "monday" -> monday;
            case "tuesday" -> tuesday;
            case "wednesday" -> wednesday;
            case "thursday" -> thursday;
            case "friday" -> friday;
            case "saturday" -> saturday;
            case "sunday" -> sunday;
            default -> null;
        };
    }

    public static WorkingPlan generateDefaultWorkingPlan() {
        WorkingPlan wp = new WorkingPlan();
        LocalTime defaultStartHour = LocalTime.parse("06:00");
        LocalTime defaultEndHour = LocalTime.parse("18:00");
        TimePeriod defaultWorkingPeriod = new TimePeriod(defaultStartHour, defaultEndHour);
        
        wp.getMonday().setWorkingHours(defaultWorkingPeriod);
        wp.getTuesday().setWorkingHours(defaultWorkingPeriod);
        wp.getWednesday().setWorkingHours(defaultWorkingPeriod);
        wp.getThursday().setWorkingHours(defaultWorkingPeriod);
        wp.getFriday().setWorkingHours(defaultWorkingPeriod);
        wp.getSaturday().setWorkingHours(defaultWorkingPeriod);
        wp.getSunday().setWorkingHours(defaultWorkingPeriod);
        
        return wp;
    }
}

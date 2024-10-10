package com.example.demo.appointmentscheduler.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Embeddable
@AttributeOverrides({
    @AttributeOverride(name = "start", column = @Column(name = "working_hours_start")),
    @AttributeOverride(name = "end", column = @Column(name = "working_hours_end"))
})
public class DayPlan {

    @Embedded
    private TimePeriod workingHours;

    @ElementCollection
    @CollectionTable(name = "break_times", joinColumns = @JoinColumn(name = "day_plan_id"))
    @AttributeOverrides({
        @AttributeOverride(name = "start", column = @Column(name = "break_start")),
        @AttributeOverride(name = "end", column = @Column(name = "break_end"))
    })
    private List<TimePeriod> breaks;

    public DayPlan() {
        breaks = new ArrayList<>();
    }

    public List<TimePeriod> timePeriodsWithBreaksExcluded() {
        List<TimePeriod> periodsWithBreaksExcluded = new ArrayList<>();
        periodsWithBreaksExcluded.add(getWorkingHours());

        if (!breaks.isEmpty()) {
            List<TimePeriod> toAdd = new ArrayList<>();

            for (TimePeriod breakPeriod : breaks) {
                adjustBreakPeriod(breakPeriod);
                adjustWorkingPeriods(periodsWithBreaksExcluded, breakPeriod, toAdd);
            }
            periodsWithBreaksExcluded.addAll(toAdd);
            Collections.sort(periodsWithBreaksExcluded);
        }

        return periodsWithBreaksExcluded;
    }

    private void adjustBreakPeriod(TimePeriod breakPeriod) {
        if (breakPeriod.getStart().isBefore(workingHours.getStart())) {
            breakPeriod.setStart(workingHours.getStart());
        }
        if (breakPeriod.getEnd().isAfter(workingHours.getEnd())) {
            breakPeriod.setEnd(workingHours.getEnd());
        }
    }

    private void adjustWorkingPeriods(List<TimePeriod> periods, TimePeriod breakPeriod, List<TimePeriod> toAdd) {
        for (TimePeriod period : periods) {
            if (breakPeriod.getStart().equals(period.getStart()) && 
                breakPeriod.getEnd().isAfter(period.getStart()) && 
                breakPeriod.getEnd().isBefore(period.getEnd())) {
                period.setStart(breakPeriod.getEnd());
            }
            if (breakPeriod.getStart().isAfter(period.getStart()) && 
                breakPeriod.getStart().isBefore(period.getEnd()) && 
                breakPeriod.getEnd().equals(period.getEnd())) {
                period.setEnd(breakPeriod.getStart());
            }
            if (breakPeriod.getStart().isAfter(period.getStart()) && 
                breakPeriod.getEnd().isBefore(period.getEnd())) {
                toAdd.add(new TimePeriod(period.getStart(), breakPeriod.getStart()));
                period.setStart(breakPeriod.getEnd());
            }
        }
    }

    @Embedded
    public TimePeriod getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(TimePeriod workingHours) {
        this.workingHours = workingHours;
    }

    public List<TimePeriod> getBreaks() {
        return breaks;
    }

    public void setBreaks(List<TimePeriod> breaks) {
        this.breaks = breaks;
    }

    public void removeBreak(TimePeriod breakToRemove) {
        breaks.remove(breakToRemove);
    }

    public void addBreak(TimePeriod breakToAdd) {
        breaks.add(breakToAdd);
    }
}

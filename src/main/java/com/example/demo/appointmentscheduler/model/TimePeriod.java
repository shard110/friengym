    package com.example.demo.appointmentscheduler.model;

    import jakarta.persistence.*;
    import java.time.LocalTime;
    import java.util.Objects;
    
    @Embeddable
    public class TimePeriod implements Comparable<TimePeriod> {
    
        @Column(name = "start_time")
        private LocalTime start;
    
        @Column(name = "end_time")
        private LocalTime end;
    
        public TimePeriod() {
        }
    
        public TimePeriod(LocalTime start, LocalTime end) {
            this.start = start;
            this.end = end;
        }
    
        public LocalTime getStart() {
            return start;
        }
    
        public void setStart(LocalTime start) {
            this.start = start;
        }
    
        public LocalTime getEnd() {
            return end;
        }
    
        public void setEnd(LocalTime end) {
            this.end = end;
        }
    
        @Override
        public int compareTo(TimePeriod o) {
            if (o == null) {
                throw new NullPointerException("Cannot compare to null");
            }
            return this.getStart().compareTo(o.getStart());
        }
    
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            TimePeriod period = (TimePeriod) o;
            return this.start.equals(period.getStart()) && this.end.equals(period.getEnd());
        }
    
        @Override
        public int hashCode() {
            return Objects.hash(start, end);
        }
    
        @Override
        public String toString() {
            return "TimePeriod{" +
                    "start=" + start +
                    ", end=" + end +
                    '}';
        }
    }
package com.example.demo.appointmentscheduler.model;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.entity.AppointmentStatus;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.time.ZoneOffset;

// Appointment 객체를 JSON 형식으로 직렬화하는 커스텀 직렬 변환기
public class AppointmentSerializer extends StdSerializer<Appointment> {

    // 기본 생성자
    public AppointmentSerializer() {
        this(null);
    }

    // 클래스 타입을 인자로 받는 생성자
    public AppointmentSerializer(Class<Appointment> t) {
        super(t);
    }

    // Appointment 객체를 JSON으로 직렬화하는 메소드
    @Override
    public void serialize(Appointment appointment, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject(); // JSON 객체 시작
        
        // 약속 ID를 JSON 필드로 추가
        gen.writeNumberField("id", appointment.getId());
        
        // 약속 제목을 JSON 필드로 추가
        gen.writeStringField("title", appointment.getWork().getName());
        
        // 약속 시작 시간을 UTC 밀리초로 변환하여 JSON 필드로 추가
        gen.writeNumberField("start", appointment.getStart().toInstant(ZoneOffset.UTC).toEpochMilli());
        
        // 약속 종료 시간을 UTC 밀리초로 변환하여 JSON 필드로 추가
        gen.writeNumberField("end", appointment.getEnd().toInstant(ZoneOffset.UTC).toEpochMilli());
        
        // 약속 URL을 JSON 필드로 추가
        gen.writeStringField("url", "/appointments/" + appointment.getId());
        
        // 약속 상태에 따라 색상을 결정하여 JSON 필드로 추가
        gen.writeStringField("color", appointment.getStatus().equals(AppointmentStatus.SCHEDULED) ? "#28a745" : "grey");
        
        gen.writeEndObject(); // JSON 객체 끝
    }
}
package com.example.demo.appointmentscheduler.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.appointmentscheduler.entity.Appointment;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    // 특정 고객의 모든 약속을 찾습니다.
    @Query("select a from Appointment a where a.customer.id = :customerId")
    List<Appointment> findByCustomerId(@Param("customerId") int customerId);

    // 특정 트레이너의 모든 약속을 찾습니다.
    @Query("select a from Appointment a where a.trainer.id = :trainerId") // provider를 trainer로 변경
    List<Appointment> findByTrainerId(@Param("trainerId") int trainerId); // 메서드 이름 변경

    // 특정 사용자가 취소한 모든 약속을 찾습니다.
    @Query("select a from Appointment a where a.canceler.id = :userId")
    List<Appointment> findCanceledByUser(@Param("userId") int userId);

    // 특정 사용자에 의해 예약된 모든 약속을 찾습니다.
    @Query("select a from Appointment a where a.status='SCHEDULED' and (a.customer.id = :userId or a.trainer.id = :userId)") // provider를 trainer로 변경
    List<Appointment> findScheduledByUserId(@Param("userId") int userId);

    // 특정 트레이너와 기간 내에 시작하는 약속을 찾습니다.
    @Query("select a from Appointment a where a.trainer.id = :trainerId and a.start >= :dayStart and a.start <= :dayEnd") // provider를 trainer로 변경
    List<Appointment> findByTrainerIdWithStartInPeriod(@Param("trainerId") int trainerId, 
                                                         @Param("dayStart") LocalDateTime startPeriod, 
                                                         @Param("dayEnd") LocalDateTime endPeriod); // 메서드 이름 변경

    // 특정 고객과 기간 내에 시작하는 약속을 찾습니다.
    @Query("select a from Appointment a where a.customer.id = :customerId and a.start >= :dayStart and a.start <= :dayEnd")
    List<Appointment> findByCustomerIdWithStartInPeriod(@Param("customerId") int customerId, 
                                                          @Param("dayStart") LocalDateTime startPeriod, 
                                                          @Param("dayEnd") LocalDateTime endPeriod);

    // 특정 고객이 지정된 날짜 이후에 취소한 약속을 찾습니다.
    @Query("select a from Appointment a where a.customer.id = :customerId and a.canceler.id = :customerId and a.canceledAt >= :date")
    List<Appointment> findByCustomerIdCanceledAfterDate(@Param("customerId") int customerId, 
                                                          @Param("date") LocalDateTime date);

    // 현재 시간 이전에 종료된 모든 예약된 약속을 찾습니다.
    @Query("select a from Appointment a where a.status = 'SCHEDULED' and :now >= a.end")
    List<Appointment> findScheduledWithEndBeforeDate(@Param("now") LocalDateTime now);

    // 특정 날짜 이전에 종료된 약속을 찾고, 해당 약속이 특정 사용자와 관련이 있는지 확인합니다.
    @Query("select a from Appointment a where a.status = 'SCHEDULED' and :date >= a.end and (a.customer.id = :userId or a.trainer.id = :userId)") // provider를 trainer로 변경
    List<Appointment> findScheduledByUserIdWithEndBeforeDate(@Param("date") LocalDateTime date, 
                                                                @Param("userId") int userId);

    // 현재 시간 이전에 종료된 모든 완료된 약속을 찾습니다.
    @Query("select a from Appointment a where a.status = 'FINISHED' and :date >= a.end")
    List<Appointment> findFinishedWithEndBeforeDate(@Param("date") LocalDateTime date);

    // 특정 날짜 이전에 종료된 완료된 약속을 찾고, 해당 약속이 특정 사용자와 관련이 있는지 확인합니다.
    @Query("select a from Appointment a where a.status = 'FINISHED' and :date >= a.end and (a.customer.id = :userId or a.trainer.id = :userId)") // provider를 trainer로 변경
    List<Appointment> findFinishedByUserIdWithEndBeforeDate(@Param("date") LocalDateTime date, 
                                                              @Param("userId") int userId);

    // 특정 고객의 모든 확인된 약속을 찾습니다.
    @Query("select a from Appointment a where a.status = 'CONFIRMED' and a.customer.id = :customerId")
    List<Appointment> findConfirmedByCustomerId(@Param("customerId") int customerId);

    // 교환 가능한 약속을 찾습니다.
    @Query("select a from Appointment a inner join a.work w where a.status = 'SCHEDULED' and a.customer.id <> :customerId and a.trainer.id = :trainerId and a.start >= :start and w.id = :workId") // provider를 trainer로 변경
    List<Appointment> getEligibleAppointmentsForExchange(@Param("start") LocalDateTime start, 
                                                          @Param("customerId") Integer customerId, 
                                                          @Param("trainerId") Integer trainerId, // provider를 trainer로 변경
                                                          @Param("workId") Integer workId);

    // 시작 시간이 특정 날짜 이전인 교환 요청 약속을 찾습니다.
    @Query("select a from Appointment a where a.status = 'EXCHANGE_REQUESTED' and a.start <= :start")
    List<Appointment> findExchangeRequestedWithStartBefore(@Param("start") LocalDateTime date);
}
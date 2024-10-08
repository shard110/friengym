package com.example.demo.appointmentscheduler.service;

import java.util.List;

import com.example.demo.appointmentscheduler.entity.Work;

public interface WorkService {
    void createNewWork(Work work);

    Work getWorkById(int workId);

    List<Work> getAllWorks();

    List<Work> getWorksByProviderId(int trainerId);

    List<Work> getRetailCustomerWorks();

    List<Work> getCorporateCustomerWorks();

    List<Work> getWorksForRetailCustomerByProviderId(int trainerId);

    List<Work> getWorksForCorporateCustomerByProviderId(int trainerId);

    void updateWork(Work work);

    void deleteWorkById(int workId);

    boolean isWorkForCustomer(int workId, int customerId);
}
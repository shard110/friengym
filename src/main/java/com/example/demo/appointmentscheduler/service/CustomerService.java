package com.example.demo.appointmentscheduler.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.appointmentscheduler.entity.Customer;
import com.example.demo.appointmentscheduler.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // ID로 고객을 찾는 메서드
    public Customer getCustomerById(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("고객 ID가 " + customerId + "인 고객을 찾을 수 없습니다."));
    }

    // 모든 고객을 가져오는 메서드
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // 새로운 고객을 저장하는 메서드
    public void saveNewCustomer(Customer customer) {
        customerRepository.save(customer);
    }

    // 고객 정보를 업데이트하는 메서드
    public void updateCustomer(Customer customer) {
        if (customerRepository.existsById(customer.getId())) {
            customerRepository.save(customer);
        } else {
            throw new RuntimeException("고객 ID가 " + customer.getId() + "인 고객을 찾을 수 없습니다.");
        }
    }

    // 고객을 삭제하는 메서드
    public void deleteCustomerById(String customerId) {
        if (customerRepository.existsById(customerId)) {
            customerRepository.deleteById(customerId);
        } else {
            throw new RuntimeException("고객 ID가 " + customerId + "인 고객을 찾을 수 없습니다.");
        }
    }
}
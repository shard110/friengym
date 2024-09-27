package com.example.demo.message;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Status;
import com.example.demo.entity.User;

public interface WebsocketUserRepository extends JpaRepository<User, String>{

	List<User> findAllByStatus(Status status);

}

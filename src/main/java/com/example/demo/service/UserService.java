package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // 비밀번호 암호화 없이 평문 비밀번호를 저장합니다.
        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String id, String pwd) {
        Optional<User> user = userRepository.findById(id);
        return user.isPresent() && pwd.equals(user.get().getPwd()) ? user : Optional.empty();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByNameAndEmail(String name, String email) {
        return userRepository.findByNameAndEmail(name, email); // UserRepository에서 적절한 메소드 구현 필요
    }
    
    
}

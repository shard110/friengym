package com.example.demo.mail;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserMailService {

  @Autowired
  private UserRepository userRepository;

  public boolean userEmailCheck(String userEmail, String userId) {
    Optional<User> optionalUser = userRepository.findUserByEmail(userEmail);
    return optionalUser.isPresent() && optionalUser.get().getId().equals(userId);
  }
}

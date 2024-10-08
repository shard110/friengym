package com.example.demo.mail;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

public class UserService {
  @Autowired
  private UserRepository userRepository;

  public boolean userEmailCheck(String userEmail, String userName) {

    User user = userRepository.findUserByUserId(userEmail);
    if(user!=null && user.getName().equals(userName)) {
        return true;
    }
    else {
        return false;
    }
  }
}

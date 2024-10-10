package com.example.demo.mail;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.EncryptionUtils;

@Service
public class SendEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    private static final String FROM_ADDRESS = "friengym@gmail.com";

    public MailDto createMailAndChangePassword(String userEmail, String userId) {
        String tempPassword = getTempPassword();
        MailDto dto = new MailDto();
        dto.setAddress(userEmail);
        dto.setTitle(userId + "님의 friengym 임시비밀번호 안내 이메일입니다.");
        dto.setMessage("안녕하세요. friengym 임시비밀번호 안내 관련 이메일입니다." +
                       "[" + userId + "]님의 임시 비밀번호는 " + tempPassword + "입니다.");
        updatePassword(tempPassword, userEmail);
        return dto;
    }

    @Transactional
    public void updatePassword(String tempPassword, String userEmail) {
        String encryptedPassword = EncryptionUtils.encryptMD5(tempPassword);
        Optional<User> optionalUser = userRepository.findUserByEmail(userEmail);
        
        if (optionalUser.isPresent()) {
            String id = optionalUser.get().getId();
            System.out.println("Updating password for user ID: " + id);
            System.out.println("Encrypted password: " + encryptedPassword);
            
            try {
                // 비밀번호 업데이트 전 로그
                System.out.println("Attempting to update password for user ID: " + id + " with encrypted password: " + encryptedPassword);
                
                userRepository.updateUserPassword(id, encryptedPassword);
                userRepository.flush(); // 추가된 부분
                System.out.println("Password updated successfully for user ID: " + id);
            } catch (Exception e) {
                System.err.println("Database update error: " + e.getMessage());
                throw new RuntimeException("비밀번호 업데이트 중 오류 발생: " + e.getMessage());
            }
        } else {
            System.err.println("User not found for email: " + userEmail);
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
    }
    
    public String getTempPassword() {
        char[] charSet = new char[] {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                                      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
                                      'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 
                                      'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};

        StringBuilder str = new StringBuilder();
        int idx;
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            str.append(charSet[idx]);
        }
        return str.toString();
    }

    public void mailSend(MailDto mailDto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailDto.getAddress());
        message.setFrom(FROM_ADDRESS);
        message.setSubject(mailDto.getTitle());
        message.setText(mailDto.getMessage());

        mailSender.send(message);
    }
}

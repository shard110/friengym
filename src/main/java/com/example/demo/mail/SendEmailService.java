package com.example.demo.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.demo.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SendEmailService {
    
    @Autowired
    private JavaMailSender mailSender; // JavaMailSender 주입

    @Autowired
    private UserRepository userRepository;

    private static final String FROM_ADDRESS = "friengym@gmail.com";

    public MailDto createMailAndChangePassword(String userEmail, String userName){
        String str = getTempPassword();
        MailDto dto = new MailDto();
        dto.setAddress(userEmail);
        dto.setTitle(userName + "님의 friengym 임시비밀번호 안내 이메일 입니다.");
        dto.setMessage("안녕하세요. friengym 임시비밀번호 안내 관련 이메일 입니다." + "[" + userName + "]" + "님의 임시 비밀번호는 " + str + " 입니다.");
        updatePassword(str, userEmail);
        return dto;
    }

    public void updatePassword(String str, String userEmail) {
        String pw = EncryptionUtils.encryptMD5(str);
        int id = userRepository.findUserByUserId(userEmail).getId();
        userRepository.updateUserPassword(id, pw);
    }

    public String getTempPassword() {
        char[] charSet = new char[] {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};

        StringBuilder str = new StringBuilder();

        int idx;
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            str.append(charSet[idx]);
        }
        return str.toString();
    }

    public void mailSend(MailDto mailDto) {
        System.out.println("이메일 전송 중...");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailDto.getAddress());
        message.setFrom(FROM_ADDRESS); // 발신자 주소 설정
        message.setSubject(mailDto.getTitle());
        message.setText(mailDto.getMessage());

        mailSender.send(message);
        System.out.println("이메일 전송 완료!");
    }
}

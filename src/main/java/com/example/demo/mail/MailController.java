package com.example.demo.mail;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    @Autowired
    private UserMailService userMailService;

    @Autowired
    private SendEmailService sendEmailService;

    @GetMapping("/check/findPw")
    public @ResponseBody Map<String, Boolean> pwFind(@RequestParam String userEmail, @RequestParam String userId) {
        Map<String, Boolean> json = new HashMap<>();
        boolean pwFindCheck = userMailService.userEmailCheck(userEmail, userId);
        json.put("check", pwFindCheck);
        return json;
    }

    @PostMapping("/check/findPw/sendEmail")
    public @ResponseBody ResponseEntity<String> sendEmail(@RequestParam String userEmail, @RequestParam String userId) {
        try {
            MailDto dto = sendEmailService.createMailAndChangePassword(userEmail, userId);
            sendEmailService.mailSend(dto);
            return ResponseEntity.ok("이메일이 발송되었습니다.");
        } catch (RuntimeException e) {
            System.err.println("Error occurred: " + e.getMessage()); // 에러 로그 추가
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Unknown error occurred: " + e.getMessage()); // 에러 로그 추가
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("알 수 없는 오류가 발생했습니다.");
        }
    }
}


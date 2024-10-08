package com.example.demo.mail;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
public class MailController {
  //Email과 name의 일치여부를 check하는 컨트롤러
  @GetMapping("/check/findPw")
  public @ResponseBody Map<String, Boolean> pw_find(String userEmail, String userName){
    Map<String,Boolean> json = new HashMap<>();
    boolean pwFindCheck = userService.userEmailCheck(userEmail,userName);

    System.out.println(pwFindCheck);
    json.put("check", pwFindCheck);
    return json;
  }

  //등록된 이메일로 임시비밀번호를 발송하고 발송된 임시비밀번호로 사용자의 pw를 변경하는 컨트롤러
  @PostMapping("/check/findPw/sendEmail")
  public @ResponseBody void sendEmail(String userEmail, String userName) {
    MailDto dto = sendEmailService.createMailAndChangePassword(userEmail, userName);
    sendEmailService.mailSend(dto); // 이메일 전송
  }
}

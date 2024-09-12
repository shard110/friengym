package com.example.demo.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping("/custom-error")
    public String handleCustomError() {
        // 커스텀 에러 페이지로 포워딩
        return "customError";
    }
}

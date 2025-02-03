package com.daelim.Callcenter;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.daelim.Callcenter.Login.LoginVO;

import lombok.RequiredArgsConstructor;

import jakarta.servlet.http.HttpSession; // HttpSession 사용을 위한 import

@ComponentScan
@RequestMapping("/callCenter")
@RequiredArgsConstructor
@Controller
public class MainController {

    @GetMapping("/")
    public String loginFirst(HttpSession session) {
    	// 세션에서 사용자 정보 확인
        LoginVO user = (LoginVO) session.getAttribute("user");
        if (user != null) {
            // 이미 로그인 상태라면 메인 페이지로 리다이렉트
            return "mainPage";
        }
        return "login"; 
    }

    @GetMapping("/mainPage")
    public String mainPage(HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/callCenter/"; 
        }
        return "mainPage"; 
    }

    @PostMapping("/exit")
    public String exit(@RequestParam("id") String id, HttpSession session) {
        LoginVO user = new LoginVO();
        user.setId(id);
        session.setAttribute("user", user); 
        return "mainPage"; 
    }

}

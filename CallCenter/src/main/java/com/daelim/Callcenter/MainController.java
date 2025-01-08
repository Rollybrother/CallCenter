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
        session.invalidate(); 
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

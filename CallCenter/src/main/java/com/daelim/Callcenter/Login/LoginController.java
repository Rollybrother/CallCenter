package com.daelim.Callcenter.Login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpSession; // 세션 사용을 위해 추가
import lombok.RequiredArgsConstructor;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@ComponentScan
@RequestMapping("/loginController")
@RequiredArgsConstructor
@Controller
public class LoginController {

    @Autowired
    private LoginRepository loginRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping("/login")
    public String loginPage(HttpSession session, Model model) {
        String error = (String) session.getAttribute("error");
        if (error != null) {
            model.addAttribute("error", error);
            session.removeAttribute("error"); // 한 번 사용 후 삭제
        }
        return "login"; // 로그인 페이지 호출
    }

    @PostMapping("/login")
    public String login(@RequestParam("id") String id, @RequestParam("password") String password, HttpSession session) {
        LoginVO user = loginRepository.findById(id);

        // 사용자 인증 처리
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            session.setAttribute("user", user); // 세션에 사용자 정보를 저장
            return "mainPage"; // 로그인 성공 후 메인 페이지로 이동
        } else {
            session.setAttribute("error", "아이디 또는 비밀번호가 잘못되었습니다."); // 세션에 에러 메시지 저장
            return "redirect:/loginController/login"; // 로그인 페이지로 다시 이동
        }
    }

    @GetMapping("/signup")
    public String signupPage(HttpSession session, Model model) {
        String error = (String) session.getAttribute("error");
        if (error != null) {
            model.addAttribute("error", error);
            session.removeAttribute("error"); 
        }
        return "signup"; 
    }

    @PostMapping("/signup")
    public String signup(@RequestParam("id") String id, @RequestParam("password") String password, HttpSession session) {
        if (loginRepository.findById(id) != null) {
            session.setAttribute("error", "이미 존재하는 아이디입니다."); // 세션에 에러 메시지 저장
            return "redirect:/loginController/signup";
        } else {
            LoginVO newUser = new LoginVO();
            newUser.setId(id);
            newUser.setPassword(passwordEncoder.encode(password)); // 비밀번호 암호화
            loginRepository.save(newUser);

            String message;
            try {
                message = URLEncoder.encode("사용자 등록이 완료되었습니다.", "UTF-8");
            } catch (UnsupportedEncodingException e) {
                message = "사용자 등록이 완료되었습니다."; // 인코딩 실패 시 기본 메시지 사용
            }

            session.setAttribute("message", message); // 세션에 메시지 저장
            return "redirect:/loginController/login";
        }
    }

    @GetMapping("/checkId")
    @ResponseBody
    public Map<String, Boolean> checkId(@RequestParam("id") String id) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", loginRepository.findById(id) != null);
        return response;
    }
}

package com.daelim.Callcenter.Stat;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daelim.Callcenter.Acpt.AcptRepository;

@RestController
@RequestMapping("/api/statistics")
public class StatController {

    private final StatRepository statRepository;
    private final AcptRepository acptRepository; 

    public StatController(StatRepository statRepository, AcptRepository acptRepository) {
        this.statRepository = statRepository;
        this.acptRepository = acptRepository;
    }

    @GetMapping("/daily")
    public List<StatVO> getDailyStatistics(
            @RequestParam("startDate") String startDate, 
            @RequestParam("endDate") String endDate) {
        return statRepository.findByDateBetween(startDate, endDate);
    }

    @GetMapping("/monthly")
    public List<StatVO> getMonthlyStatistics(
            @RequestParam("year") String year, 
            @RequestParam("month") String month) {
        String start = year + month + "01";
        String end = year + month + "31";
        return statRepository.findByDateBetween(start, end);
    }
    
    @GetMapping("/yearly")
    public List<MonthlyStat> getYearlyStatistics(@RequestParam("year") String year) {
        String start = year + "0101";
        String end = year + "1231";
        List<MonthlyStat> result = statRepository.findMonthlyStatsByYear(start, end);
        return result;
    }
    
    // 통계 등록
    @PostMapping
    public StatVO saveStatistics(@RequestBody StatVO statVO) {
        return statRepository.save(statVO);
    }
    
    @GetMapping("/reception")
    public ReceptionCounts getReceptionCounts(@RequestParam(name = "rcptDate") String rcptDate) {
        // 각 접수 데이터 카운트 계산
        int countMan = acptRepository.countMan(rcptDate);
        int countVoice = acptRepository.countVoice(rcptDate);
        int countChat = acptRepository.countChat(rcptDate);
        int countInternet = acptRepository.countInternet(rcptDate);

        // 계산된 결과를 반환
        return new ReceptionCounts(countMan, countVoice, countChat, countInternet);
    }
    
    @PostMapping("/checkAndSave")
    public String checkAndSaveStatistics(@RequestBody StatVO statVO) {
        // 동일한 날짜의 데이터가 존재하는지 확인
        String date = statVO.getDate();
        List<StatVO> existingRecords = statRepository.findByDate(date);

        // 데이터가 이미 존재하면 "EXISTS" 반환
        if (!existingRecords.isEmpty()) {
            return "EXISTS";
        }

        // 데이터가 존재하지 않으면 저장
        statRepository.save(statVO);
        return "SAVED";
    }
    
    @DeleteMapping("/deleteByDate")
    public void deleteByDate(@RequestParam("date") String date) {
    	
        statRepository.deleteByDate(date);
    }
    

    // 접수 카운트 결과를 담는 내부 클래스
    public static class ReceptionCounts {
        private int countMan;
        private int countVoice;
        private int countChat;
        private int countInternet;

        // 생성자
        public ReceptionCounts(int countMan, int countVoice, int countChat, int countInternet) {
            this.countMan = countMan;
            this.countVoice = countVoice;
            this.countChat = countChat;
            this.countInternet = countInternet;
        }

        // Getter 메서드
        public int getCountMan() {
            return countMan;
        }

        public int getCountVoice() {
            return countVoice;
        }

        public int getCountChat() {
            return countChat;
        }

        public int getCountInternet() {
            return countInternet;
        }
    }
    
}

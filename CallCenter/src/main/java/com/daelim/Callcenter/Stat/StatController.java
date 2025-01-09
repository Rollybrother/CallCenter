package com.daelim.Callcenter.Stat;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.daelim.Callcenter.Acpt.AcptRepository;
import org.apache.poi.ss.usermodel.Cell;
import jakarta.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.io.OutputStream;

@RestController
@RequestMapping("/api/statistics")
public class StatController {
	
    private final StatRepository statRepository;
    private final AcptRepository acptRepository; 
    
    public StatController(StatRepository statRepository, AcptRepository acptRepository) {
        this.statRepository = statRepository;
        this.acptRepository = acptRepository;
    }
    
    @PostMapping("/excelDownload")
    public void downloadExcel(@RequestBody List<Map<String, String>> tableData, HttpServletResponse response) throws IOException {
        // 첨부된 엑셀 파일 경로
        String templatePath = "src/main/resources/templates/조회결과.xlsx";

        // 엑셀 템플릿 읽기
        try (FileInputStream fis = new FileInputStream(templatePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);

            // 3행부터 데이터 삽입
            int rowNum = 2; // 엑셀에서 3행은 index 2
            for (Map<String, String> rowData : tableData) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(rowData.get("date"));
                row.createCell(1).setCellValue(Integer.parseInt(rowData.get("manInCall")));
                row.createCell(2).setCellValue(Integer.parseInt(rowData.get("manResCall")));
                row.createCell(3).setCellValue(rowData.get("manResRate"));
                row.createCell(4).setCellValue(Integer.parseInt(rowData.get("manAcptCall")));
                row.createCell(5).setCellValue(Integer.parseInt(rowData.get("voiceInCall")));
                row.createCell(6).setCellValue(Integer.parseInt(rowData.get("voiceAcptCall")));
                row.createCell(7).setCellValue(Integer.parseInt(rowData.get("chatInCall")));
                row.createCell(8).setCellValue(Integer.parseInt(rowData.get("chatAcptCall")));
                row.createCell(9).setCellValue(Integer.parseInt(rowData.get("onlineAcptCall")));
                row.createCell(10).setCellValue(Integer.parseInt(rowData.get("firmAcptCall")));
                row.createCell(11).setCellValue(Integer.parseInt(rowData.get("innerAcptCall")));
                row.createCell(12).setCellValue(Integer.parseInt(rowData.get("totalInCall")));
                row.createCell(13).setCellValue(Integer.parseInt(rowData.get("totalResCall")));
                row.createCell(14).setCellValue(rowData.get("totalResRate"));
                row.createCell(15).setCellValue(Integer.parseInt(rowData.get("totalAcptCall")));
                row.createCell(16).setCellValue(rowData.get("totalAcptRate"));
            }

            // 파일명 설정 및 응답 준비
            String fileName = "콜센터_통계.xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

            // 엑셀 파일을 클라이언트에 출력
            try (OutputStream os = response.getOutputStream()) {
                workbook.write(os);
                os.flush();
            }
        }
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

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
    public void downloadExcel(@RequestBody List<Map<String, String>> tableData, HttpServletResponse response) {
        // 템플릿 파일을 클래스패스에서 읽기
        try (InputStream templateStream = getClass().getClassLoader().getResourceAsStream("templates/조회결과.xlsx");
             Workbook workbook = new XSSFWorkbook(templateStream)) {

            // 첫 번째 시트 가져오기
            Sheet sheet = workbook.getSheetAt(0);

            // 데이터 삽입 시작 행 (3행, 인덱스 2)
            int rowNum = 2;

            for (Map<String, String> rowData : tableData) {
                // 기존 행 가져오기 (없으면 새로 생성)
                Row row = sheet.getRow(rowNum);
                if (row == null) {
                    row = sheet.createRow(rowNum);
                }
                rowNum++;

                // 기존 셀에 데이터 삽입
                setCellValue(row, 0, rowData.get("date")); // 날짜
                setCellValue(row, 1, rowData.get("manInCall")); // 상담원 인입
                setCellValue(row, 2, rowData.get("manResCall")); // 상담원 응답
                setCellValue(row, 3, rowData.get("manResRate")); // 상담원 응대율
                setCellValue(row, 4, rowData.get("manAcptCall")); // 상담원 접수
                setCellValue(row, 5, rowData.get("voiceInCall")); // 보이스봇 인입
                setCellValue(row, 6, rowData.get("voiceAcptCall")); // 보이스봇 접수
                setCellValue(row, 7, rowData.get("chatInCall")); // 챗봇 인입
                setCellValue(row, 8, rowData.get("chatAcptCall")); // 챗봇 접수
                setCellValue(row, 9, rowData.get("chattingIn")); // 채팅 인입
                setCellValue(row, 10, rowData.get("chattingAcpt")); // 채팅 접수
                setCellValue(row, 11, rowData.get("innerAcpt")); // 내선콜 접수
                setCellValue(row, 12, rowData.get("onlineAcptCall")); // 온라인 접수
                setCellValue(row, 13, rowData.get("faxAcpt")); // 팩스 접수
                setCellValue(row, 14, rowData.get("totalInCall")); // 총 인입
                setCellValue(row, 15, rowData.get("totalResCall")); // 총 응답
                setCellValue(row, 16, rowData.get("totalResRate")); // 총 응대율
                setCellValue(row, 17, rowData.get("totalAcptCall")); // 총 접수
                setCellValue(row, 18, rowData.get("totalAcptRate")); // 총 응대 접수율
            }
        	
            // 응답 설정
            String fileName = "조회결과.xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

            try (OutputStream os = response.getOutputStream()) {
                workbook.write(os);
            }
        } catch (IOException e) {
            throw new RuntimeException("엑셀 파일 생성 중 오류가 발생했습니다.", e);
        }
    }
    
    // 셀 값을 설정하는 메서드
    private void setCellValue(Row row, int cellIndex, String value) {
    	
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            cell = row.createCell(cellIndex);
        }
        cell.setCellValue(value);
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
    public List<MonthlyStat> getYearlyStatistics(
            @RequestParam("start") String start, 
            @RequestParam("end") String end) {
        return statRepository.findMonthlyStatsByYear(start, end);
    }
    
    // 통계 등록
    @PostMapping
    public StatVO saveStatistics(@RequestBody StatVO statVO) {
        return statRepository.save(statVO);
    }
    
    @GetMapping("/reception")
    public ReceptionCounts getReceptionCounts(@RequestParam(name = "rcptDate") String rcptDate) {
        int countMan = acptRepository.countMan(rcptDate);
        int countVoice = acptRepository.countVoice(rcptDate);
        int countChat = acptRepository.countChat(rcptDate);
        int countInternet = acptRepository.countInternet(rcptDate);
    	int countFax = acptRepository.countFax(rcptDate);
    	int countInnerAcpt = acptRepository.countInnerAcpt(rcptDate);
    	int countChatting = acptRepository.countChatting(rcptDate);
    	
        // 계산된 결과를 반환
        return new ReceptionCounts(countMan, countVoice, countChat, countInternet, countFax, countInnerAcpt, countChatting);
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
        
    	private int countMan=0;
        private int countVoice=0;
        private int countChat=0;
        private int countInternet=0;
        private int countFax=0;
        private int countInnerAcpt=0;
        private int countChatting=0;
        
        // 생성자
        public ReceptionCounts(int countMan, int countVoice, int countChat, int countInternet, int countFax, int countInnerAcpt, int countChatting) {
            this.countMan = countMan;
            this.countVoice = countVoice;
            this.countChat = countChat;
            this.countInternet = countInternet;
            this.countFax = countFax;
            this.countInnerAcpt = countInnerAcpt;
            this.countChatting = countChatting;
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
        
        public int getCountFax() {
        	return countFax;
        }
        
        public int getCountInnerAcpt() {
        	return countInnerAcpt;
        }
        
        public int getCountChatting() {
        	return countChatting;
        }
        
    }
    
}

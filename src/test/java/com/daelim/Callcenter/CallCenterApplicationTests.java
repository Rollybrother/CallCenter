package com.daelim.Callcenter;

import java.io.ByteArrayInputStream;
import javax.sql.DataSource;

import com.daelim.Callcenter.Acpt.AcptRepository;
import com.daelim.Callcenter.Acpt.AcptVO;
import com.daelim.Callcenter.Login.LoginRepository;
import com.daelim.Callcenter.Stat.StatRepository;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CallCenterApplicationTests {

    @Autowired MockMvc mvc;
    @Autowired LoginRepository users;
    @Autowired StatRepository statistics;
    @Autowired AcptRepository receptions;
    @Autowired @Qualifier("mariaDataSource") DataSource maria;
    @Autowired @Qualifier("acptDataSource") DataSource db2;

    @BeforeEach
    void clearTestData() {
        users.deleteAll();
        statistics.deleteAll();
        receptions.deleteAll();
    }

    @Test
    void databasesAreSeparatedAndExistingColumnNamesArePreserved() {
        assertThat(maria).isNotSameAs(db2);
        assertThat(new JdbcTemplate(maria).queryForObject("select count(userIndex) from user", Integer.class))
                .isZero();
        assertThat(new JdbcTemplate(maria).queryForObject("select count(indexNum) from stat", Integer.class))
                .isZero();
        assertThat(new JdbcTemplate(db2).queryForObject("select count(ASRCPTNO) from sat101", Integer.class))
                .isZero();
        assertThat(new JdbcTemplate(maria).queryForObject(
                "select count(*) from information_schema.tables where table_name = 'SAT101'", Integer.class))
                .isZero();
    }

    @Test
    void bootServesLoginAndStaticAssetsAtAllEntryUrls() throws Exception {
        for (String path : new String[]{"/", "/callCenter", "/callCenter/", "/loginController/login"}) {
            mvc.perform(get(path)).andExpect(status().isOk()).andExpect(view().name("login"))
                    .andExpect(content().string(org.hamcrest.Matchers.containsString("href=\"/login.css\"")));
        }
        mvc.perform(get("/login.css")).andExpect(status().isOk());
        mvc.perform(get("/signup.css")).andExpect(status().isOk());
        mvc.perform(get("/mainPage.js")).andExpect(status().isOk());
        mvc.perform(get("/callCenter/mainPage")).andExpect(status().is3xxRedirection());
    }

    @Test
    void signupGeneratesDistinctIdsAndLoginRetainsTheSession() throws Exception {
        for (String id : new String[]{"first-test-user", "second-test-user"}) {
            mvc.perform(post("/loginController/signup").param("id", id).param("password", "test-password"))
                    .andExpect(status().is3xxRedirection());
        }
        assertThat(users.count()).isEqualTo(2);
        assertThat(users.findById("first-test-user").getUserIndex())
                .isNotEqualTo(users.findById("second-test-user").getUserIndex());
        assertThat(new BCryptPasswordEncoder().matches("test-password", users.findById("first-test-user").getPassword()))
                .isTrue();
        MockHttpSession session = new MockHttpSession();
        mvc.perform(post("/loginController/login").session(session)
                        .param("id", "first-test-user").param("password", "test-password"))
                .andExpect(status().isOk()).andExpect(view().name("mainPage"));
        assertThat(session.getAttribute("user")).isNotNull();
        mvc.perform(get("/callCenter/mainPage").session(session))
                .andExpect(status().isOk()).andExpect(view().name("mainPage"));
        mvc.perform(post("/loginController/login").param("id", "first-test-user").param("password", "wrong"))
                .andExpect(redirectedUrl("/loginController/login"));
    }

    @Test
    void statisticsCanBeSavedAggregatedAndDeletedThroughTheirTransactionManager() throws Exception {
        for (String date : new String[]{"20260901", "20260902"}) {
            mvc.perform(post("/api/statistics/checkAndSave").contentType(MediaType.APPLICATION_JSON)
                            .content("{\"date\":\"" + date + "\",\"manInCall\":10,\"manResCall\":8}"))
                    .andExpect(status().isOk()).andExpect(content().string("SAVED"));
        }
        assertThat(statistics.count()).isEqualTo(2);
        mvc.perform(post("/api/statistics/checkAndSave").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"date\":\"20260901\"}"))
                .andExpect(content().string("EXISTS"));
        mvc.perform(get("/api/statistics/daily").param("startDate", "20260901").param("endDate", "20260930"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get("/api/statistics/monthly").param("year", "2026").param("month", "09"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get("/api/statistics/yearly").param("start", "20260101").param("end", "20261231"))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].month").value("202609"))
                .andExpect(jsonPath("$[0].manInCall").value(20))
                .andExpect(jsonPath("$[0].manResCall").value(16));
        mvc.perform(delete("/api/statistics/deleteByDate").param("date", "20260901"))
                .andExpect(status().isOk());
        assertThat(statistics.count()).isEqualTo(1);
    }

    @Test
    void receptionQueryUsesTheSecondDatabaseAndExistingChannelCodes() throws Exception {
        int index = 0;
        for (String code : new String[]{"22222", "33333", "55555", "66666", "77777", "88888", "12345"}) {
            receptions.save(new AcptVO("TEST" + ++index, "20260928", code));
        }
        receptions.save(new AcptVO("OTHERDATE", "20260927", "77777"));
        mvc.perform(get("/api/statistics/reception").param("rcptDate", "20260928"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.countMan").value(1)).andExpect(jsonPath("$.countVoice").value(1))
                .andExpect(jsonPath("$.countChat").value(1)).andExpect(jsonPath("$.countInternet").value(1))
                .andExpect(jsonPath("$.countFax").value(1)).andExpect(jsonPath("$.countInnerAcpt").value(1))
                .andExpect(jsonPath("$.countChatting").value(1));
    }

    @Test
    void excelTemplateIsLoadedFromTheClasspath() throws Exception {
        byte[] file = mvc.perform(post("/api/statistics/excelDownload").contentType(MediaType.APPLICATION_JSON)
                        .content("[{\"date\":\"2026-09-28\",\"manInCall\":\"12\"}]"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("filename*=UTF-8")))
                .andReturn().getResponse().getContentAsByteArray();
        try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(file))) {
            assertThat(workbook.getSheetAt(0).getRow(2).getCell(0).getStringCellValue()).isEqualTo("2026-09-28");
            assertThat(workbook.getSheetAt(0).getRow(2).getCell(1).getStringCellValue()).isEqualTo("12");
        }
    }
}

package com.daelim.Callcenter.Acpt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AcptRepository extends JpaRepository<AcptVO, String>{
	
	// RASMANCD 값이 "22222"이고 RCPTDATE가 주어진 날짜인 경우의 count 반환
    @Query("SELECT COUNT(a) FROM AcptVO a WHERE a.RASMANCD = '22222' AND a.RCPTDATE = :rcptDate")
    int countFax(@Param("rcptDate") String rcptDate);
	
	// RASMANCD 값이 "33333"이고 RCPTDATE가 주어진 날짜인 경우의 count 반환
    @Query("SELECT COUNT(a) FROM AcptVO a WHERE a.RASMANCD = '33333' AND a.RCPTDATE = :rcptDate")
    int countInternet(@Param("rcptDate") String rcptDate);
    
    // RASMANCD 값이 "55555"이고 RCPTDATE가 주어진 날짜인 경우의 count 반환
    @Query("SELECT COUNT(a) FROM AcptVO a WHERE a.RASMANCD = '55555' AND a.RCPTDATE = :rcptDate")
    int countChat(@Param("rcptDate") String rcptDate);
    
    // RASMANCD 값이 "66666"이고 RCPTDATE가 주어진 날짜인 경우의 count 반환
    @Query("SELECT COUNT(a) FROM AcptVO a WHERE a.RASMANCD = '66666' AND a.RCPTDATE = :rcptDate")
    int countInnerAcpt(@Param("rcptDate") String rcptDate);
    
    // RASMANCD 값이 "77777"이고 RCPTDATE가 주어진 날짜인 경우의 count 반환
    @Query("SELECT COUNT(a) FROM AcptVO a WHERE a.RASMANCD = '77777' AND a.RCPTDATE = :rcptDate")
    int countVoice(@Param("rcptDate") String rcptDate);
    
    // RASMANCD 값이 "88888"이고 RCPTDATE가 주어진 날짜인 경우의 count 반환
    @Query("SELECT COUNT(a) FROM AcptVO a WHERE a.RASMANCD = '88888' AND a.RCPTDATE = :rcptDate")
    int countChatting(@Param("rcptDate") String rcptDate);
    
    // RASMANCD 값이 위의 3가지 경우가 아니고 RCPTDATE가 주어진 날짜인 경우의 count 반환
    @Query("SELECT COUNT(a) FROM AcptVO a WHERE a.RASMANCD NOT IN ('22222','33333','55555','66666','77777','88888') AND a.RCPTDATE = :rcptDate")
    int countMan(@Param("rcptDate") String rcptDate);
    
}

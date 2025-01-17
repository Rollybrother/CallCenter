package com.daelim.Callcenter.Stat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface StatRepository extends JpaRepository<StatVO, Integer> {
	
	@Query("SELECT new com.daelim.Callcenter.Stat.MonthlyStat(" +
		       "SUBSTRING(s.date, 1, 6), " +
		       "SUM(s.manInCall), " +
		       "SUM(s.manResCall), " +
		       "SUM(s.manAcptCall), " +
		       "SUM(s.voiceInCall), " +
		       "SUM(s.voiceAcptCall), " +
		       "SUM(s.chatInCall), " +
		       "SUM(s.chatAcptCall), " +
		       "SUM(s.chattingIn), " +
		       "SUM(s.chattingAcpt), " +
		       "SUM(s.privateIn), " +
		       "SUM(s.onlineAcptCall), " +
		       "SUM(s.faxAcpt), " +
		       "SUM(s.innerAcpt)) " + 
		       "FROM StatVO s " +
		       "WHERE s.date BETWEEN :start AND :end " +
		       "GROUP BY SUBSTRING(s.date, 1, 6) " +
		       "ORDER BY SUBSTRING(s.date, 1, 6) ASC, s.date ASC")
	 List<MonthlyStat> findMonthlyStatsByYear(@Param("start") String start, @Param("end") String end);

	 
	 @Query("SELECT s FROM StatVO s WHERE s.date BETWEEN :startDate AND :endDate ORDER BY s.date ASC")
     List<StatVO> findByDateBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
	 
	 @Query("SELECT s FROM StatVO s WHERE s.date = :date ORDER BY s.date ASC")
	 List<StatVO> findByDate(@Param("date") String date);
	 
	 @Query("DELETE FROM StatVO s WHERE s.date = :date") 
	 @Modifying
	 @Transactional
	 void deleteByDate(@Param("date") String date);
	 
}

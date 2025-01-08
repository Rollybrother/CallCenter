package com.daelim.Callcenter.Stat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "stat")
@Data
@NoArgsConstructor @AllArgsConstructor
public class StatVO {
	
	@Id
	@Column(name = "indexNum")
	private int indexNum;
	// 자동으로 올라가는 인덱스
	
	@Column(name = "manInCall")
	private int manInCall;
	// 상담원 인입
	
	@Column(name = "manResCall")
	private int manResCall;
	//상담원 응답
	
	@Column(name = "manAcptCall")
	private int manAcptCall;
	//상담원 접수
	
	@Column(name = "voiceInCall")
	private int voiceInCall;
	//보이스봇 인입
	
	@Column(name = "voiceAcptCall")
	private int voiceAcptCall;
	//보이스봇 접수
	
	@Column(name = "chatInCall")
	private int chatInCall;
	//챗봇 인입
	
	@Column(name = "chatAcptCall")
	private int chatAcptCall;
	//챗봇 접수
	
	@Column(name = "onlineAcptCall")
	private int onlineAcptCall;
	//온라인 접수
	
	@Column(name = "firmAcptCall")
	private int firmAcptCall;
	//건설사 접수
	
	@Column(name = "innerAcptCall")
	private int innerAcptCall;
	//내선콜 접수
	
	@Column(name = "date")
	private String date;
	//날짜
	
}

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
	private int manInCall=0;
	// 상담원 인입
	
	@Column(name = "manResCall")
	private int manResCall=0;
	//상담원 응답
	
	@Column(name = "manAcptCall")
	private int manAcptCall=0;
	//상담원 접수
	
	@Column(name = "voiceInCall")
	private int voiceInCall=0;
	//보이스봇 인입
	
	@Column(name = "voiceAcptCall")
	private int voiceAcptCall=0;
	//보이스봇 접수
	
	@Column(name = "chatInCall")
	private int chatInCall=0;
	//챗봇 인입
	
	@Column(name = "chatAcptCall")
	private int chatAcptCall=0;
	//챗봇 접수
	
	@Column(name = "chattingIn")
	private int chattingIn=0;
	//채팅 인입
	
	@Column(name = "chattingAcpt")
	private int chattingAcpt=0;
	//채팅 접수
	
	@Column(name = "innerAcpt")
	private int innerAcpt=0;
	//내선 접수
	
	@Column(name = "onlineAcptCall")
	private int onlineAcptCall=0;
	//온라인 접수
	
	@Column(name = "faxAcpt")
	private int faxAcpt=0;
	//팩스 접수
	
	@Column(name = "date")
	private String date;
	//날짜
	
}

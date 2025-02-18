package com.daelim.Callcenter.Stat;

import jakarta.persistence.Column;

public class MonthlyStat {
    private String month;
    private Long manInCall;
    private Long manResCall;
    private Long manAcptCall;
    private Long voiceInCall;
    private Long voiceAcptCall;
    private Long chatInCall;
    private Long chatAcptCall;
	private Long chattingIn;
	private Long chattingAcpt;
	private Long innerAcpt;
    private Long onlineAcptCall;
	private Long faxAcpt;


    public MonthlyStat(String month, Long manInCall, Long manResCall, Long manAcptCall, Long voiceInCall, Long voiceAcptCall, Long chatInCall, Long chatAcptCall, 
    		Long chattingIn,Long chattingAcpt,Long innerAcpt,Long onlineAcptCall,Long faxAcpt) {
        this.month = month;
        this.manInCall = manInCall;
        this.manResCall = manResCall;
        this.manAcptCall = manAcptCall;
        this.voiceInCall = voiceInCall;
        this.voiceAcptCall = voiceAcptCall;
        this.chatInCall = chatInCall;
        this.chatAcptCall = chatAcptCall;
        this.chattingIn = chattingIn;
        this.chattingAcpt = chattingAcpt;
        this.onlineAcptCall = onlineAcptCall;
        this.faxAcpt = faxAcpt;
        this.innerAcpt = innerAcpt;
    }

	// Getter 및 Setter
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Long getManInCall() {
        return manInCall;
    }

    public void setManInCall(Long manInCall) {
        this.manInCall = manInCall;
    }

    public Long getManResCall() {
        return manResCall;
    }

    public void setManResCall(Long manResCall) {
        this.manResCall = manResCall;
    }

    public Long getManAcptCall() {
        return manAcptCall;
    }

    public void setManAcptCall(Long manAcptCall) {
        this.manAcptCall = manAcptCall;
    }

    public Long getVoiceInCall() {
        return voiceInCall;
    }

    public void setVoiceInCall(Long voiceInCall) {
        this.voiceInCall = voiceInCall;
    }

    public Long getVoiceAcptCall() {
        return voiceAcptCall;
    }

    public void setVoiceAcptCall(Long voiceAcptCall) {
        this.voiceAcptCall = voiceAcptCall;
    }

    public Long getChatInCall() {
        return chatInCall;
    }

    public void setChatInCall(Long chatInCall) {
        this.chatInCall = chatInCall;
    }

    public Long getChatAcptCall() {
        return chatAcptCall;
    }

    public void setChatAcptCall(Long chatAcptCall) {
        this.chatAcptCall = chatAcptCall;
    }

    public Long getOnlineAcptCall() {
        return onlineAcptCall;
    }

    public void setOnlineAcptCall(Long onlineAcptCall) {
        this.onlineAcptCall = onlineAcptCall;
    }

	public Long getChattingIn() {
		return chattingIn;
	}

	public void setChattingIn(Long chattingIn) {
		this.chattingIn = chattingIn;
	}

	public Long getChattingAcpt() {
		return chattingAcpt;
	}

	public void setChattingAcpt(Long chattingAcpt) {
		this.chattingAcpt = chattingAcpt;
	}

	public Long getFaxAcpt() {
		return faxAcpt;
	}

	public void setFaxAcpt(Long faxAcpt) {
		this.faxAcpt = faxAcpt;
	}

	public Long getInnerAcpt() {
		return innerAcpt;
	}

	public void setInnerAcpt(Long innerAcpt) {
		this.innerAcpt = innerAcpt;
	}
    
    

}

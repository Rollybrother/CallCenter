package com.daelim.Callcenter.Stat;

public class MonthlyStat {
    private String month;
    private Long manInCall;
    private Long manResCall;
    private Long manAcptCall;
    private Long voiceInCall;
    private Long voiceAcptCall;
    private Long chatInCall;
    private Long chatAcptCall;
    private Long onlineAcptCall;
    private Long firmAcptCall;
    private Long innerAcptCall;

    // 생성자
    public MonthlyStat(String month, Long manInCall, Long manResCall, Long manAcptCall, Long voiceInCall, Long voiceAcptCall, Long chatInCall, Long chatAcptCall, Long onlineAcptCall, Long firmAcptCall, Long innerAcptCall) {
        this.month = month;
        this.manInCall = manInCall;
        this.manResCall = manResCall;
        this.manAcptCall = manAcptCall;
        this.voiceInCall = voiceInCall;
        this.voiceAcptCall = voiceAcptCall;
        this.chatInCall = chatInCall;
        this.chatAcptCall = chatAcptCall;
        this.onlineAcptCall = onlineAcptCall;
        this.firmAcptCall = firmAcptCall;
        this.innerAcptCall = innerAcptCall;
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

    public Long getFirmAcptCall() {
        return firmAcptCall;
    }

    public void setFirmAcptCall(Long firmAcptCall) {
        this.firmAcptCall = firmAcptCall;
    }

    public Long getInnerAcptCall() {
        return innerAcptCall;
    }

    public void setInnerAcptCall(Long innerAcptCall) {
        this.innerAcptCall = innerAcptCall;
    }
}

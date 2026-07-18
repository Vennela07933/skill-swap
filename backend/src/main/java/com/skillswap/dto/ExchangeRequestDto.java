package com.skillswap.dto;

import com.skillswap.entity.ExchangeStatus;
import java.time.LocalDateTime;

public class ExchangeRequestDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private Long receiverId;
    private String receiverName;
    private String receiverEmail;
    private Long senderSkillId;
    private String senderSkillName;
    private Long receiverSkillId;
    private String receiverSkillName;
    private String message;
    private ExchangeStatus status;
    private LocalDateTime createdAt;

    public ExchangeRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverEmail() { return receiverEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }

    public Long getSenderSkillId() { return senderSkillId; }
    public void setSenderSkillId(Long senderSkillId) { this.senderSkillId = senderSkillId; }

    public String getSenderSkillName() { return senderSkillName; }
    public void setSenderSkillName(String senderSkillName) { this.senderSkillName = senderSkillName; }

    public Long getReceiverSkillId() { return receiverSkillId; }
    public void setReceiverSkillId(Long receiverSkillId) { this.receiverSkillId = receiverSkillId; }

    public String getReceiverSkillName() { return receiverSkillName; }
    public void setReceiverSkillName(String receiverSkillName) { this.receiverSkillName = receiverSkillName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ExchangeStatus getStatus() { return status; }
    public void setStatus(ExchangeStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

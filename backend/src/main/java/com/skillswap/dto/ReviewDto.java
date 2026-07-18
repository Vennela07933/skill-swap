package com.skillswap.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerProfilePicture;
    private Long revieweeId;
    private String revieweeName;
    private Long exchangeRequestId;
    private Integer rating;
    private String feedback;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerProfilePicture() { return reviewerProfilePicture; }
    public void setReviewerProfilePicture(String reviewerProfilePicture) { this.reviewerProfilePicture = reviewerProfilePicture; }

    public Long getRevieweeId() { return revieweeId; }
    public void setRevieweeId(Long revieweeId) { this.revieweeId = revieweeId; }

    public String getRevieweeName() { return revieweeName; }
    public void setRevieweeName(String revieweeName) { this.revieweeName = revieweeName; }

    public Long getExchangeRequestId() { return exchangeRequestId; }
    public void setExchangeRequestId(Long exchangeRequestId) { this.exchangeRequestId = exchangeRequestId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

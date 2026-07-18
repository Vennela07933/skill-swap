package com.skillswap.service;

import com.skillswap.dto.ReviewDto;
import org.springframework.data.domain.Page;

public interface ReviewService {
    ReviewDto createReview(Long reviewerId, ReviewDto reviewDto);
    Page<ReviewDto> getReviewsForUser(Long userId, int page, int size);
    Double getAverageRatingForUser(Long userId);
}

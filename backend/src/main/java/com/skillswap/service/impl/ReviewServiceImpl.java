package com.skillswap.service.impl;

import com.skillswap.dto.ReviewDto;
import com.skillswap.entity.ExchangeRequest;
import com.skillswap.entity.ExchangeStatus;
import com.skillswap.entity.Review;
import com.skillswap.entity.User;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.mapper.AppMapper;
import com.skillswap.repository.ExchangeRequestRepository;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ExchangeRequestRepository exchangeRequestRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             UserRepository userRepository,
                             ExchangeRequestRepository exchangeRequestRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.exchangeRequestRepository = exchangeRequestRepository;
    }

    @Override
    @Transactional
    public ReviewDto createReview(Long reviewerId, ReviewDto reviewDto) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
        User reviewee = userRepository.findById(reviewDto.getRevieweeId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewee not found"));

        if (reviewerId.equals(reviewee.getId())) {
            throw new BadRequestException("You cannot review yourself");
        }

        ExchangeRequest exchangeRequest = null;
        if (reviewDto.getExchangeRequestId() != null) {
            exchangeRequest = exchangeRequestRepository.findById(reviewDto.getExchangeRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found"));

            if (exchangeRequest.getStatus() != ExchangeStatus.COMPLETED) {
                throw new BadRequestException("You can only review after the exchange is completed");
            }

            // Verify both reviewer and reviewee were parts of the exchange
            boolean isParticipantReviewer = exchangeRequest.getSender().getId().equals(reviewerId) ||
                                            exchangeRequest.getReceiver().getId().equals(reviewerId);
            boolean isParticipantReviewee = exchangeRequest.getSender().getId().equals(reviewee.getId()) ||
                                            exchangeRequest.getReceiver().getId().equals(reviewee.getId());

            if (!isParticipantReviewer || !isParticipantReviewee) {
                throw new BadRequestException("Reviewer or Reviewee was not part of the specified exchange request");
            }
        }

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setExchangeRequest(exchangeRequest);
        review.setRating(reviewDto.getRating());
        review.setFeedback(reviewDto.getFeedback());

        Review savedReview = reviewRepository.save(review);
        return AppMapper.toReviewDto(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDto> getReviewsForUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.findByRevieweeId(userId, pageable).map(AppMapper::toReviewDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRatingForUser(Long userId) {
        Double avg = reviewRepository.getAverageRatingForUser(userId);
        return avg != null ? avg : 0.0;
    }
}

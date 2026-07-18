package com.skillswap.controller;

import com.skillswap.dto.ReviewDto;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ReviewDto reviewDto
    ) {
        ReviewDto created = reviewService.createReview(principal.getId(), reviewDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Page<ReviewDto>> getReviewsForUser(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ReviewDto> reviews = reviewService.getReviewsForUser(id, page, size);
        return ResponseEntity.ok(reviews);
    }
}

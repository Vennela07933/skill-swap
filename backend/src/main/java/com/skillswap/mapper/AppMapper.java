package com.skillswap.mapper;

import com.skillswap.dto.*;
import com.skillswap.entity.*;

import java.util.Collections;
//import java.util.List;
import java.util.stream.Collectors;

public class AppMapper {

    public static UserDto toUserDto(User user, Double avgRating) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setLocation(user.getLocation());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setRole(user.getRole());
        dto.setSkillsWanted(user.getSkillsWanted());
        dto.setAvailability(user.getAvailability());
        dto.setExperience(user.getExperience());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setAverageRating(avgRating != null ? avgRating : 0.0);
        dto.setBlocked(user.isBlocked());

        if (user.getSkills() != null) {
            dto.setSkills(user.getSkills().stream()
                    .map(AppMapper::toSkillDto)
                    .collect(Collectors.toList()));
        } else {
            dto.setSkills(Collections.emptyList());
        }

        return dto;
    }

    public static SkillDto toSkillDto(Skill skill) {
        if (skill == null) return null;

        SkillDto dto = new SkillDto();
        dto.setId(skill.getId());
        dto.setSkillName(skill.getSkillName());
        dto.setDescription(skill.getDescription());
        dto.setCategory(skill.getCategory());
        dto.setLevel(skill.getLevel());
        dto.setCreatedAt(skill.getCreatedAt());

        if (skill.getUser() != null) {
            dto.setUserId(skill.getUser().getId());
            dto.setUserName(skill.getUser().getName());
        }

        return dto;
    }

    public static ExchangeRequestDto toExchangeRequestDto(ExchangeRequest req) {
        if (req == null) return null;

        ExchangeRequestDto dto = new ExchangeRequestDto();
        dto.setId(req.getId());
        dto.setMessage(req.getMessage());
        dto.setStatus(req.getStatus());
        dto.setCreatedAt(req.getCreatedAt());

        if (req.getSender() != null) {
            dto.setSenderId(req.getSender().getId());
            dto.setSenderName(req.getSender().getName());
            dto.setSenderEmail(req.getSender().getEmail());
        }
        if (req.getReceiver() != null) {
            dto.setReceiverId(req.getReceiver().getId());
            dto.setReceiverName(req.getReceiver().getName());
            dto.setReceiverEmail(req.getReceiver().getEmail());
        }
        if (req.getSenderSkill() != null) {
            dto.setSenderSkillId(req.getSenderSkill().getId());
            dto.setSenderSkillName(req.getSenderSkill().getSkillName());
        }
        if (req.getReceiverSkill() != null) {
            dto.setReceiverSkillId(req.getReceiverSkill().getId());
            dto.setReceiverSkillName(req.getReceiverSkill().getSkillName());
        }

        return dto;
    }

    public static NotificationDto toNotificationDto(Notification notif) {
        if (notif == null) return null;

        NotificationDto dto = new NotificationDto();
        dto.setId(notif.getId());
        dto.setMessage(notif.getMessage());
        dto.setRead(notif.isRead());
        dto.setCreatedAt(notif.getCreatedAt());

        if (notif.getUser() != null) {
            dto.setUserId(notif.getUser().getId());
        }

        return dto;
    }

    public static ReviewDto toReviewDto(Review review) {
        if (review == null) return null;

        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setFeedback(review.getFeedback());
        dto.setCreatedAt(review.getCreatedAt());

        if (review.getReviewer() != null) {
            dto.setReviewerId(review.getReviewer().getId());
            dto.setReviewerName(review.getReviewer().getName());
            dto.setReviewerProfilePicture(review.getReviewer().getProfilePicture());
        }
        if (review.getReviewee() != null) {
            dto.setRevieweeId(review.getReviewee().getId());
            dto.setRevieweeName(review.getReviewee().getName());
        }
        if (review.getExchangeRequest() != null) {
            dto.setExchangeRequestId(review.getExchangeRequest().getId());
        }

        return dto;
    }
}

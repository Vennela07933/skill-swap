package com.skillswap.service.impl;

import com.skillswap.dto.ExchangeRequestDto;
import com.skillswap.entity.*;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.exception.UnauthorizedException;
import com.skillswap.mapper.AppMapper;
import com.skillswap.repository.ExchangeRequestRepository;
import com.skillswap.repository.NotificationRepository;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.ExchangeRequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExchangeRequestServiceImpl implements ExchangeRequestService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final NotificationRepository notificationRepository;

    public ExchangeRequestServiceImpl(ExchangeRequestRepository exchangeRequestRepository,
                                     UserRepository userRepository,
                                     SkillRepository skillRepository,
                                     NotificationRepository notificationRepository) {
        this.exchangeRequestRepository = exchangeRequestRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public ExchangeRequestDto createExchangeRequest(Long senderId, ExchangeRequestDto dto) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));
        Skill senderSkill = skillRepository.findById(dto.getSenderSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender skill not found"));
        Skill receiverSkill = skillRepository.findById(dto.getReceiverSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver skill not found"));

        if (senderId.equals(receiver.getId())) {
            throw new BadRequestException("You cannot request a skill exchange with yourself");
        }

        ExchangeRequest request = new ExchangeRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setSenderSkill(senderSkill);
        request.setReceiverSkill(receiverSkill);
        request.setMessage(dto.getMessage());
        request.setStatus(ExchangeStatus.PENDING);

        ExchangeRequest savedRequest = exchangeRequestRepository.save(request);

        // Notify Receiver
        Notification notification = new Notification();
        notification.setUser(receiver);
        notification.setMessage("New exchange request received from " + sender.getName() + " for skill: " + receiverSkill.getSkillName());
        notificationRepository.save(notification);

        return AppMapper.toExchangeRequestDto(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExchangeRequestDto> getReceivedRequests(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return exchangeRequestRepository.findByReceiverId(userId, pageable).map(AppMapper::toExchangeRequestDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExchangeRequestDto> getSentRequests(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return exchangeRequestRepository.findBySenderId(userId, pageable).map(AppMapper::toExchangeRequestDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExchangeRequestDto> getAllRequests(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return exchangeRequestRepository.findAll(pageable).map(AppMapper::toExchangeRequestDto);
    }

    @Override
    @Transactional
    public ExchangeRequestDto acceptRequest(Long requestId, Long userId) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found"));

        if (!request.getReceiver().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to accept this request");
        }

        if (request.getStatus() != ExchangeStatus.PENDING) {
            throw new BadRequestException("Request cannot be accepted from state: " + request.getStatus());
        }

        request.setStatus(ExchangeStatus.ACCEPTED);
        ExchangeRequest updated = exchangeRequestRepository.save(request);

        // Notify Sender
        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setMessage("Your request has been accepted by " + request.getReceiver().getName());
        notificationRepository.save(notification);

        return AppMapper.toExchangeRequestDto(updated);
    }

    @Override
    @Transactional
    public ExchangeRequestDto rejectRequest(Long requestId, Long userId) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found"));

        if (!request.getReceiver().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to reject this request");
        }

        if (request.getStatus() != ExchangeStatus.PENDING) {
            throw new BadRequestException("Request cannot be rejected from state: " + request.getStatus());
        }

        request.setStatus(ExchangeStatus.REJECTED);
        ExchangeRequest updated = exchangeRequestRepository.save(request);

        // Notify Sender
        Notification notification = new Notification();
        notification.setUser(request.getSender());
        notification.setMessage("Your request has been rejected by " + request.getReceiver().getName());
        notificationRepository.save(notification);

        return AppMapper.toExchangeRequestDto(updated);
    }

    @Override
    @Transactional
    public ExchangeRequestDto completeRequest(Long requestId, Long userId) {
        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found"));

        // Either participant can complete the exchange
        if (!request.getSender().getId().equals(userId) && !request.getReceiver().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to complete this request");
        }

        if (request.getStatus() != ExchangeStatus.ACCEPTED) {
            throw new BadRequestException("Request can only be completed after being accepted");
        }

        request.setStatus(ExchangeStatus.COMPLETED);
        ExchangeRequest updated = exchangeRequestRepository.save(request);

        // Notify both parties
        Notification notifSender = new Notification();
        notifSender.setUser(request.getSender());
        notifSender.setMessage("Exchange completed successfully with " + request.getReceiver().getName());
        notificationRepository.save(notifSender);

        Notification notifReceiver = new Notification();
        notifReceiver.setUser(request.getReceiver());
        notifReceiver.setMessage("Exchange completed successfully with " + request.getSender().getName());
        notificationRepository.save(notifReceiver);

        return AppMapper.toExchangeRequestDto(updated);
    }
}

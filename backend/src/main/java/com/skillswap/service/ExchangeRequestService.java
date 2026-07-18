package com.skillswap.service;

import com.skillswap.dto.ExchangeRequestDto;
import org.springframework.data.domain.Page;

public interface ExchangeRequestService {
    ExchangeRequestDto createExchangeRequest(Long senderId, ExchangeRequestDto dto);
    Page<ExchangeRequestDto> getReceivedRequests(Long userId, int page, int size);
    Page<ExchangeRequestDto> getSentRequests(Long userId, int page, int size);
    Page<ExchangeRequestDto> getAllRequests(int page, int size);
    ExchangeRequestDto acceptRequest(Long requestId, Long userId);
    ExchangeRequestDto rejectRequest(Long requestId, Long userId);
    ExchangeRequestDto completeRequest(Long requestId, Long userId);
}

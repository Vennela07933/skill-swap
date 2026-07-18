package com.skillswap.controller;

import com.skillswap.dto.ExchangeRequestDto;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ExchangeRequestService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exchanges")
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    public ExchangeRequestController(ExchangeRequestService exchangeRequestService) {
        this.exchangeRequestService = exchangeRequestService;
    }

    @PostMapping
    public ResponseEntity<ExchangeRequestDto> createExchangeRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ExchangeRequestDto dto
    ) {
        ExchangeRequestDto created = exchangeRequestService.createExchangeRequest(principal.getId(), dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<Page<ExchangeRequestDto>> getExchanges(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "all") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin && type.equalsIgnoreCase("all_admin")) {
            Page<ExchangeRequestDto> all = exchangeRequestService.getAllRequests(page, size);
            return ResponseEntity.ok(all);
        }

        if (type.equalsIgnoreCase("sent")) {
            Page<ExchangeRequestDto> sent = exchangeRequestService.getSentRequests(principal.getId(), page, size);
            return ResponseEntity.ok(sent);
        } else if (type.equalsIgnoreCase("received")) {
            Page<ExchangeRequestDto> received = exchangeRequestService.getReceivedRequests(principal.getId(), page, size);
            return ResponseEntity.ok(received);
        } else {
            // "all" - Let's default to received requests or combining them.
            // Since we want both, we can default to received for the user dashboard since that's what action is needed on.
            // Let's return received by default for "all", or we can create an endpoint mapping or separate search.
            Page<ExchangeRequestDto> received = exchangeRequestService.getReceivedRequests(principal.getId(), page, size);
            return ResponseEntity.ok(received);
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ExchangeRequestDto> acceptExchange(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ExchangeRequestDto accepted = exchangeRequestService.acceptRequest(id, principal.getId());
        return ResponseEntity.ok(accepted);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ExchangeRequestDto> rejectExchange(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ExchangeRequestDto rejected = exchangeRequestService.rejectRequest(id, principal.getId());
        return ResponseEntity.ok(rejected);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ExchangeRequestDto> completeExchange(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ExchangeRequestDto completed = exchangeRequestService.completeRequest(id, principal.getId());
        return ResponseEntity.ok(completed);
    }
}

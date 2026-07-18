package com.skillswap.repository;

import com.skillswap.entity.ExchangeRequest;
import com.skillswap.entity.ExchangeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {

    Page<ExchangeRequest> findBySenderId(Long senderId, Pageable pageable);

    Page<ExchangeRequest> findByReceiverId(Long receiverId, Pageable pageable);

    @Query("SELECT r FROM ExchangeRequest r WHERE r.sender.id = :userId OR r.receiver.id = :userId")
    Page<ExchangeRequest> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT r FROM ExchangeRequest r WHERE r.sender.id = :userId OR r.receiver.id = :userId")
    List<ExchangeRequest> findAllByUserId(@Param("userId") Long userId);

    long countByStatus(ExchangeStatus status);
}

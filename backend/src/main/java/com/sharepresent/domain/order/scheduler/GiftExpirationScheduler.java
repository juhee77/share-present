package com.sharepresent.domain.order.scheduler;

import com.sharepresent.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class GiftExpirationScheduler {

    private final OrderService orderService;

    /**
     * 매일 자정(00:00)에 7일간 미수락된 선물 박스를 자동으로 만료 처리하고
     * 가승인 예치금을 보내는 사람에게 전액 100% 자동 환불합니다.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void scheduleGiftExpirationAndRefund() {
        log.info("[GiftExpirationScheduler] Starting scheduled expiration check for unclaimed gift boxes...");
        LocalDateTime threshold = LocalDateTime.now().minusDays(7);
        int expiredCount = orderService.expireAndRefundUnclaimedGiftBoxes(threshold);
        log.info("[GiftExpirationScheduler] Completed expiration check. Total expired & refunded boxes: {}", expiredCount);
    }
}

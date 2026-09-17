package com.sharepresent.domain.order.scheduler;

import com.sharepresent.domain.order.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class GiftExpirationSchedulerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private GiftExpirationScheduler giftExpirationScheduler;

    @Test
    @DisplayName("자정 만료 스케줄러 실행 시 OrderService.expireAndRefundUnclaimedGiftBoxes가 7일 전 기준으로 호출되는지 검증")
    void scheduleGiftExpirationAndRefund_invokesOrderService() {
        // given
        given(orderService.expireAndRefundUnclaimedGiftBoxes(any(LocalDateTime.class))).willReturn(3);

        // when
        giftExpirationScheduler.scheduleGiftExpirationAndRefund();

        // then
        verify(orderService, times(1)).expireAndRefundUnclaimedGiftBoxes(any(LocalDateTime.class));
    }
}

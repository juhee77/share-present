package com.sharepresent.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalOrders;
    private long totalGrossAmount;       // 총 가승인/주문 금액
    private long totalSettledAmount;     // 실 결제/정산 완료 금액
    private long totalRefundAmount;      // 차액 및 취소 환불 총액
    private long preparingCount;         // 배송 준비중
    private long shippingCount;          // 배송중
    private long deliveredCount;         // 배송 완료
    private long waitingAcceptCount;     // 수령인 선택 대기중
    private double acceptanceRate;       // 선물 수락률 (%)
    private long pendingInquiriesCount;  // 미답변 문의 건수
    private long totalProductsCount;     // 전체 등록 상품 수
    private long soldOutProductsCount;   // 품절 상품 수
}

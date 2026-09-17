package com.sharepresent.domain.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentWebhookRequest {

    @NotBlank(message = "이벤트 타입은 필수입니다.")
    private String eventType;

    @NotBlank(message = "결제 키는 필수입니다.")
    private String paymentKey;

    @NotNull(message = "주문 식별자는 필수입니다.")
    private Long orderId;

    @NotNull(message = "결제 금액은 필수입니다.")
    private Integer amount;

    private String status;

    private String signature;
}

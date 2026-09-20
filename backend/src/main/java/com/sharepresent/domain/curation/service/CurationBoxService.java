package com.sharepresent.domain.curation.service;

import com.sharepresent.domain.curation.dto.AddRollingPaperRequest;
import com.sharepresent.domain.curation.dto.CreateCurationBoxRequest;
import com.sharepresent.domain.curation.dto.CurationBoxResponse;
import com.sharepresent.domain.curation.entity.CurationBox;
import com.sharepresent.domain.curation.entity.CurationBoxItem;
import com.sharepresent.domain.curation.entity.RollingPaperMessage;
import com.sharepresent.domain.curation.repository.CurationBoxRepository;
import com.sharepresent.domain.curation.repository.RollingPaperMessageRepository;
import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.product.repository.ProductRepository;
import com.sharepresent.domain.user.entity.User;
import com.sharepresent.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CurationBoxService {

    private final CurationBoxRepository curationBoxRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RollingPaperMessageRepository rollingPaperMessageRepository;

    @Transactional
    public CurationBoxResponse createCurationBox(CreateCurationBoxRequest request) {
        if (request.getMinBudget() != null && request.getMaxBudget() != null && request.getMinBudget() > request.getMaxBudget()) {
            throw new IllegalArgumentException("최소 예산이 최대 예산보다 클 수 없습니다.");
        }

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("보내는 사람을 찾을 수 없습니다. ID: " + request.getSenderId()));

        String token = UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        CurationBox curationBox = CurationBox.builder()
                .sender(sender)
                .minBudget(request.getMinBudget())
                .maxBudget(request.getMaxBudget())
                .messageCard(request.getMessageCard())
                .cardTheme(request.getCardTheme() != null ? request.getCardTheme() : "ivory")
                .fontStyle(request.getFontStyle() != null ? request.getFontStyle() : "serif")
                .packagingStyle(request.getPackagingStyle() != null ? request.getPackagingStyle() : "STANDARD")
                .claimPin(request.getClaimPin())
                .sealMonogram(request.getSealMonogram() != null && !request.getSealMonogram().isBlank() ? request.getSealMonogram().trim() : "SP")
                .sharingToken(token)
                .allowCustomInput(request.getAllowCustomInput() != null && request.getAllowCustomInput())
                .status("CREATED")
                .items(new ArrayList<>())
                .build();

        // 1. Link standard items
        if (request.getProductIds() != null) {
            for (Long prodId : request.getProductIds()) {
                Product standardProduct = productRepository.findById(prodId)
                        .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. ID: " + prodId));
                
                CurationBoxItem item = CurationBoxItem.builder()
                        .curationBox(curationBox)
                        .product(standardProduct)
                        .build();
                curationBox.getItems().add(item);
            }
        }

        // 2. Save and link custom products
        if (request.getCustomProducts() != null) {
            for (CreateCurationBoxRequest.CustomProductRequest customReq : request.getCustomProducts()) {
                Product customProduct = Product.builder()
                        .brand(customReq.getBrand())
                        .name(customReq.getName())
                        .price(0) // Custom items have price 0 by default or custom pricing
                        .description(customReq.getDescription())
                        .externalUrl(customReq.getExternalUrl())
                        .options(customReq.getOptions())
                        .icon(customReq.getIcon() != null ? customReq.getIcon() : "mug")
                        .isCustom(true)
                        .owner(sender)
                        .build();
                
                Product savedProduct = productRepository.save(customProduct);

                CurationBoxItem item = CurationBoxItem.builder()
                        .curationBox(curationBox)
                        .product(savedProduct)
                        .build();
                curationBox.getItems().add(item);
            }
        }

        CurationBox savedBox = curationBoxRepository.save(curationBox);
        return convertToResponse(savedBox);
    }

    public CurationBoxResponse getCurationBoxByToken(String sharingToken) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));
        
        return convertToResponse(box);
    }

    public boolean verifyClaimPin(String sharingToken, String pin) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));
        
        if (box.getClaimPin() == null || box.getClaimPin().trim().isEmpty()) {
            return true;
        }
        return box.getClaimPin().trim().equals(pin != null ? pin.trim() : "");
    }

    /**
     * 그룹 공동 선물 롤링페이퍼 축하 메시지 등록
     */
    @Transactional
    public CurationBoxResponse addRollingPaperMessage(String sharingToken, AddRollingPaperRequest request) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        RollingPaperMessage rpm = RollingPaperMessage.builder()
                .curationBox(box)
                .authorName(request.getAuthorName().trim())
                .message(request.getMessage().trim())
                .avatarEmoji(request.getAvatarEmoji() != null && !request.getAvatarEmoji().isBlank() ? request.getAvatarEmoji().trim() : "💌")
                .build();

        rollingPaperMessageRepository.save(rpm);
        box.getRollingPaperMessages().add(rpm);

        return convertToResponse(box);
    }

    private CurationBoxResponse convertToResponse(CurationBox box) {
        List<CurationBoxResponse.ProductDto> itemDtos = box.getItems().stream()
                .map(item -> {
                    Product prod = item.getProduct();
                    return CurationBoxResponse.ProductDto.builder()
                            .id(prod.getId())
                            .brand(prod.getBrand())
                            .name(prod.getName())
                            .price(prod.getPrice())
                            .description(prod.getDescription())
                            .imageUrl(prod.getImageUrl())
                            .externalUrl(prod.getExternalUrl())
                            .options(prod.getOptions())
                            .isCustom(prod.getIsCustom())
                            .icon(prod.getIcon())
                            .isSoldOut(prod.getIsSoldOut() != null ? prod.getIsSoldOut() : false)
                            .stockQuantity(prod.getStockQuantity() != null ? prod.getStockQuantity() : 999)
                            .build();
                })
                .toList();

        List<CurationBoxResponse.RollingPaperMessageDto> rpmDtos = box.getRollingPaperMessages() != null
                ? box.getRollingPaperMessages().stream()
                .map(rpm -> CurationBoxResponse.RollingPaperMessageDto.builder()
                        .id(rpm.getId())
                        .authorName(rpm.getAuthorName())
                        .message(rpm.getMessage())
                        .avatarEmoji(rpm.getAvatarEmoji())
                        .createdAt(rpm.getCreatedAt() != null ? rpm.getCreatedAt().toString() : null)
                        .build())
                .toList()
                : java.util.Collections.emptyList();

        return CurationBoxResponse.builder()
                .id(box.getId())
                .senderName(box.getSender() != null ? box.getSender().getNickname() : "주희")
                .messageCard(box.getMessageCard())
                .cardTheme(box.getCardTheme())
                .fontStyle(box.getFontStyle())
                .packagingStyle(box.getPackagingStyle())
                .sealMonogram(box.getSealMonogram() != null ? box.getSealMonogram() : "SP")
                .hasPinSecurity(box.getClaimPin() != null && !box.getClaimPin().trim().isEmpty())
                .minBudget(box.getMinBudget())
                .maxBudget(box.getMaxBudget())
                .sharingToken(box.getSharingToken())
                .allowCustomInput(box.getAllowCustomInput())
                .expiredAt(box.getExpiredAt() != null ? box.getExpiredAt().toString() : null)
                .items(itemDtos)
                .rollingPaperMessages(rpmDtos)
                .build();
    }
}

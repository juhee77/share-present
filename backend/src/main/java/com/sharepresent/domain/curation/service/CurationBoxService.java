package com.sharepresent.domain.curation.service;

import com.sharepresent.domain.curation.dto.CreateCurationBoxRequest;
import com.sharepresent.domain.curation.dto.CurationBoxResponse;
import com.sharepresent.domain.curation.entity.CurationBox;
import com.sharepresent.domain.curation.entity.CurationBoxItem;
import com.sharepresent.domain.curation.repository.CurationBoxRepository;
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

    @Transactional
    public CurationBoxResponse createCurationBox(CreateCurationBoxRequest request) {
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("보내는 사람을 찾을 수 없습니다. ID: " + request.getSenderId()));

        String token = UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        CurationBox curationBox = CurationBox.builder()
                .sender(sender)
                .minBudget(request.getMinBudget())
                .maxBudget(request.getMaxBudget())
                .messageCard(request.getMessageCard())
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
                            .build();
                })
                .toList();

        return CurationBoxResponse.builder()
                .id(box.getId())
                .senderName(box.getSender().getNickname())
                .messageCard(box.getMessageCard())
                .minBudget(box.getMinBudget())
                .maxBudget(box.getMaxBudget())
                .sharingToken(box.getSharingToken())
                .allowCustomInput(box.getAllowCustomInput())
                .items(itemDtos)
                .build();
    }
}

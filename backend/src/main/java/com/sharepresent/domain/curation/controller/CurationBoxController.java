package com.sharepresent.domain.curation.controller;

import com.sharepresent.domain.curation.dto.CreateCurationBoxRequest;
import com.sharepresent.domain.curation.dto.CurationBoxResponse;
import com.sharepresent.domain.curation.service.CurationBoxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/curation-boxes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend dev server CORS
@Tag(name = "Curation Box API", description = "선물 상자 생성 및 조회 API")
public class CurationBoxController {

    private final CurationBoxService curationBoxService;
    private final com.sharepresent.domain.curation.service.AiMessageAssistantService aiMessageAssistantService;

    @PostMapping
    @Operation(summary = "선물 상자 생성", description = "보내는 사람이 메시지와 추천 상품들을 골라 선물 상자를 생성합니다.")
    public ResponseEntity<CurationBoxResponse> createCurationBox(@Valid @RequestBody CreateCurationBoxRequest request) {
        CurationBoxResponse response = curationBoxService.createCurationBox(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{token}")
    @Operation(summary = "선물 상자 단건 조회", description = "받는 사람이 공유받은 토큰(Hash)을 통해 선물 상자 정보를 조회합니다.")
    public ResponseEntity<CurationBoxResponse> getCurationBox(@PathVariable("token") String token) {
        CurationBoxResponse response = curationBoxService.getCurationBoxByToken(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-pin/{token}")
    @Operation(summary = "선물 수령 PIN 번호 검증", description = "수령인이 선물 상자 개봉을 위해 입력한 4자리 PIN 번호의 일치 여부를 검증합니다.")
    public ResponseEntity<java.util.Map<String, Object>> verifyPin(
            @PathVariable("token") String token,
            @Valid @RequestBody com.sharepresent.domain.curation.dto.VerifyPinRequest request) {
        boolean isValid = curationBoxService.verifyClaimPin(token, request.getPin());
        return ResponseEntity.ok(java.util.Map.of(
                "valid", isValid,
                "message", isValid ? "PIN 번호가 일치합니다." : "PIN 번호가 일치하지 않습니다."
        ));
    }

    @PostMapping("/ai-message")
    @Operation(summary = "AI 감성 카드 문구 추천", description = "상황, 어조, 수령인/송신자 이름에 맞춘 에디토리얼 선물 카드 문구와 테마/모노그램 인장을 추천합니다.")
    public ResponseEntity<com.sharepresent.domain.curation.dto.AiMessageResponse> generateAiMessage(
            @Valid @RequestBody com.sharepresent.domain.curation.dto.GenerateAiMessageRequest request) {
        com.sharepresent.domain.curation.dto.AiMessageResponse response = aiMessageAssistantService.generateMessage(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{token}/rolling-paper")
    @Operation(summary = "그룹 공동 선물 롤링페이퍼 메시지 등록", description = "동료, 친구 등 공동 발신자가 해당 선물 상자에 축하 메시지와 아바타 스티커를 롤링페이퍼 형태로 등록합니다.")
    public ResponseEntity<CurationBoxResponse> addRollingPaperMessage(
            @PathVariable("token") String token,
            @Valid @RequestBody com.sharepresent.domain.curation.dto.AddRollingPaperRequest request) {
        CurationBoxResponse response = curationBoxService.addRollingPaperMessage(token, request);
        return ResponseEntity.ok(response);
    }
}

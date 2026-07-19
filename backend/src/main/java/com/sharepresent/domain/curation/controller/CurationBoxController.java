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
}

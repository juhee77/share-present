# SharePresent - 세션 인수인계 및 개발 핸드오버 문서 (Handover & Continuity Guide)

> **문서 목적**: 본 세션에서 진행된 풀스택 개발 내역, 핵심 제품 기획 의사결정, 기술 아키텍처 변경점, 로컬 실행 방법 및 후속 동료/AI 개발자를 위한 넥스트 로드맵을 완벽하게 정리한 핸드오버 문서입니다.

---

## 1. 프로젝트 현황 요약 (Session Summary)

본 세션에서는 **SharePresent (선물 제안형 프리미엄 큐레이션 플랫폼)** 프로젝트의 프론트엔드 및 백엔드 보일러플레이트를 구축하고, 사용자 요청에 따른 **제품 디자인 개편(Instagram Look ➔ Luxury Editorial Lookbook)**, **이중 예산 범위(Min~Max) 연동**, **수령인/송신자 권한 및 보안 분리**, **실시간 배송 조회 및 송신자 대시보드 개발**을 완료하였습니다.

---

## 2. 주요 제품 및 UX 의사결정 (Key Product Decisions)

### 1) 이중 예산 범위 설정 (Double-Bound Budget Control)
- **개념**: 보내는 사람이 단일 예산 상한선 외에 최소 예산(Min)과 최대 예산(Max)을 모두 지정하여 정교하게 예산 큐레이션을 통제합니다.
- **구현**: 백엔드 JPA `CurationBox` 엔티티 및 DTO에 `min_budget` 필드 추가, 프론트엔드에 이중 드롭다운 셀렉터 연동.

### 2) 수령인 금액 100% 비노출 (Zero Price Recipient Privacy)
- **개념**: 선물 받는 사람에게는 최소/최대 예산, 제품 가격, 차액 환불액 등 '돈'에 관한 정보가 단 1자도 노출되지 않습니다.
- **수정사항**: 수령인 완료 페이지에서 보낸 이 전용 정산서(`app/result/[token]/page.tsx`)로 연결되던 링크를 전면 제거하고, 수령인 전용 `내 선물 배송 상태 조회하기` 및 `감사 카드 보내기` 기능으로 대체.

### 3) 럭셔리 에디토리얼 룩북 UI (Editorial Lookbook UI)
- 기존 인스타그램 소셜 미디어 피드 느낌(좋아요 수, 하트 아이콘, Verified 인증 마크 등)을 전면 삭제.
- 20년 차 마케팅 디렉터 및 디자이너 회의 콘셉트 기반의 **모노톤 라이프스타일 룩북 및 파이빗 살롱 인비테이션 스타일**로 디자인 전면 개편.

### 4) 수령인 실시간 배송 현황 조회 (`/gift/track/[token]`)
- 수령인이 주소지 입력 후 자신의 선물이 어느 단계에 있는지 4단계 타임라인(`선물 수락 완료` ➔ `상품 준비중` ➔ `배송 시작` ➔ `배송 완료`) 및 운송장 정보(CJ대한통운 등)로 실시간 조회 가능.

### 5) 보낸 사람 & 받은 사람 통합 대시보드 (`/dashboard`)
- **🎁 내가 받은 선물함 (NEW)**: 내가 선물 받은 아이템 리스트 관리. 수령인 가격 비노출 보안을 준수하며 `실시간 배송 조회 📦` 4단계 타임라인 바로가기 제공.
- **💌 내가 보낸 선물함**: `🟡 선택 대기 중` 카톡 링크 복사 및 `🟢 선택 완료` 건의 정산 명세서 상세 조회 지원.
- **🔥 주간 인기 큐레이션 랭킹**: 수령인 선택률 데이터를 기반으로 인기 아이템 조합 선물 상자 원클릭 생성 지원.

### 7) 상황별 프리셋, D-Day 만료 타이머 & 감사 답장 카드 (NEW)
- **상황별 1초 큐레이션 프리셋**: 생일, 집들이, 이직/퇴사, 신혼/출산, 힐링 5개 칩 버튼으로 1초 만에 예산과 선물 추천 자동 세팅.
- **선물 수락 기한 D-Day 타이머**: `⏳ 선물 수락 기한: D-7 (미수락 시 자동 환불)` 상단 안내 뱃지 제공.
- **수령인의 감성 감사 답장 카드**: 수령인이 선물 수락 후 스티커와 답장 메시지를 전송하는 대화형 모달 (`orders` DB 테이블 연동).

---

## 3. 주요 파일 및 코드 엔트리 포인트 (Key Code Surfaces)

### 백엔드 & DB 마이그레이션 (Java 25 / Spring Boot 3.3 / Flyway)
- `backend/src/main/resources/db/migration/V1__initial_schema.sql`: Flyway V1 DDL 테이블 및 B-Tree 인덱스
- `backend/src/main/resources/db/migration/V2__seed_initial_products.sql`: Flyway V2 초기 럭셔리 상품 시드 데이터
- `backend/src/main/resources/db/migration/V3__expand_popular_gifts_catalog.sql`: Flyway V3 16종 명품 브랜드 카탈로그 확장 시드 데이터
- `backend/src/main/resources/db/migration/V4__add_thank_you_reply_card.sql`: Flyway V4 수령인 감사 답장 카드 DB 컬럼 확장 DDL
- `docker-compose.yml`: PostgreSQL 16 DB 컨테이너 1방 구동 Docker 환경 파일
- `backend/src/main/java/com/sharepresent/domain/curation/entity/CurationBox.java`: `minBudget` 컬럼 포함 JPA 엔티티
- `backend/src/main/java/com/sharepresent/domain/curation/service/CurationBoxService.java`: 큐레이션 생성 및 토큰 조회 비즈니스 로직
- `backend/src/main/java/com/sharepresent/domain/order/entity/Order.java`: `carrierName`, `trackingNumber`, `shippingStatus` 포함 주문/정산 엔티티
- `backend/src/main/java/com/sharepresent/domain/order/service/OrderService.java`: 수락 처리 및 자동 샌드박스 폴백 주문 생성, 차액 부분 환불 로직

### 프론트엔드 (Next.js 16 / TypeScript / Tailwind CSS)
- `frontend/src/app/page.tsx`: 이중 예산 셀렉터 및 선물 큐레이션 설계 페이지 (보내는 이)
- `frontend/src/app/dashboard/page.tsx`: 내가 보낸 선물함 목록 및 주간 인기 큐레이션 랭킹 대시보드
- `frontend/src/app/gift/[token]/page.tsx`: 수령인 선물 선택 및 배송지 입력 페이지 (가격 100% 비노출)
- `frontend/src/app/gift/track/[token]/page.tsx`: 수령인 4단계 배송 조회 타임라인 페이지
- `frontend/src/app/result/[token]/page.tsx`: 보내는 사람 전용 최종 정산 명세서 및 차액 환불 리포트
- `frontend/src/components/Header.tsx`: 네비게이션 헤더 컴포넌트
- `frontend/src/lib/api.ts`: 백엔드 REST API 연동 클라이언트 모듈

---

## 4. 환경 설정 및 로컬 구동 방법 (How to Run)

### 1) 백엔드 실행 (H2 메모리 DB 기본 모드)
```bash
cd backend
./gradlew bootRun
```
- **포트**: `8081`
- **Swagger 문서**: `http://localhost:8081/swagger-ui/index.html`
- **테스트 수행**: `./gradlew test` (Java 25 호환 Gradle 9.5 적용됨)

### 2) 프로덕션 PostgreSQL DB 실행 (Docker Compose)
```bash
docker-compose up -d
```
- PostgreSQL 16 컨테이너(포트 5432)가 구동되며 `schema.sql` 및 `data.sql`이 자동 적용됩니다.

### 2) 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```
- **포트**: `3000`
- **메인 접속 주소**: `http://localhost:3000`
- **대시보드 접속 주소**: `http://localhost:3000/dashboard`

---

## 5. 다음 개발자를 위한 후속 로드맵 (Roadmap for Next Developer)

1. **실제 PG 결제 모듈 연동 (Sprint 2)**:
   - 토스페이먼츠(Toss Payments) 또는 포트원(PortOne) SDK를 결합하여 보내는 이의 상한 예산 실제 카드 결제 팝업 연동.
2. **카카오 알림톡(Notification Talk) API 연동**:
   - 수령인 배송지 입력 시 송신자에게 카톡 알림 발송 및 택배 출고 시 수령인에게 운송장 알림톡 자동 발송.
3. **프로덕션 PostgreSQL DB 환경 구축**:
   - `application-prod.yml` 환경 설정 및 AWS RDS/Supabase 연결.

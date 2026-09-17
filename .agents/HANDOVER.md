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

### 8) 3D 왁스 씰 개봉 경험 & 럭셔리 레터 테마
- **3D 왁스 씰 인비테이션 개봉 (`UnwrappingRibbon.tsx`)**: 수령인이 선물 링크를 열었을 때 중앙 `SP` 모노그램 인장 씰을 눌러 봉투를 개봉하는 럭셔리 인터랙션.
- **인비테이션 레터 테마 4종**: 클래식 아이보리 린넨, 포레스트 에메랄드, 미드나잇 노아르, 더스티 로즈.
- **원클릭 카카오톡 & SNS 공유 모달 (`ShareModal.tsx`)**: Web Share API, 카카오톡 초대 문구 복사, 인스타 DM 복사.
- **에스크로 카드 결제 모달 (`CheckoutModal.tsx`)**: 최대 예산 한도 가승인 및 차액 자동 환불 시뮬레이션.
- **도로명 주소 검색 & 인터랙티브 옵션 선택 드로어 (`DeliveryDrawer.tsx`)**: 색상/향/사이즈 옵션 실시간 선택 칩, 도로명 주소 추천 검색, 배송 요청 칩, 전화번호 자동 하이픈, 수령인 안심 보안 배지.
- **동적 배송 추적 & 타임라인 히스토리 (`/gift/track/[token]`)**: 실시간 배송 상태 매핑, 택배사 물류센터 이벤트 로그, 1-Click 운송장 복사.
- **플로팅 럭셔리 토스트 시스템 (`ToastContext.tsx`)**: 브라우저 블로킹 `alert()` 전면 제거 및 반응형 럭셔리 알림창 통일.
- **카테고리 칩 필터링 (`page.tsx`)**: 테마별 카테고리(`전체`, `향수/디퓨저`, `핸드/바디`, `홈/테이블웨어`, `테크/라이프`) 필터 칩 연동.
- **카카오 알림톡 실시간 미리보기 시뮬레이터 (`AlimtalkPreviewModal.tsx`)**: 선물 도착/수락/배송 출발 카카오 비즈메시지 템플릿 실시간 모바일 프리뷰 지원.
- **선물 수락 D-7 만료 자동 환불 배치 (`GiftExpirationScheduler.java`)**: 7일간 미수락된 선물 자동 EXPIRED 처리 및 가승인 100% 전액 환불 배치 스케줄러.
- **수령인 포토 감사 카드 & 폴라로이드 뷰 (`Order.java`, `dashboard/page.tsx`)**: 수령인 언박싱/인증 포토 첨부 및 보낸 사람 대시보드 폴라로이드 감성 렌더링.
- **PG사 결제 웹훅 & HMAC-SHA256 무결성 검증 (`PaymentWebhookController.java`)**: 토스/카카오페이 비동기 상태 전이(`PAID`, `COMPLETED`, `CANCELLED`) 웹훅 처리.

---

## 3. 주요 파일 및 코드 엔트리 포인트 (Key Code Surfaces)

### 백엔드 & DB 마이그레이션 (Java 25 / Spring Boot 3.3 / Flyway)
- `backend/src/main/resources/db/migration/V1__initial_schema.sql`: Flyway V1 DDL 테이블 및 B-Tree 인덱스
- `backend/src/main/resources/db/migration/V2__seed_initial_products.sql`: Flyway V2 초기 럭셔리 상품 시드 데이터
- `backend/src/main/resources/db/migration/V3__expand_popular_gifts_catalog.sql`: Flyway V3 16종 명품 브랜드 카탈로그 확장 시드 데이터
- `backend/src/main/resources/db/migration/V4__add_thank_you_reply_card.sql`: Flyway V4 수령인 감사 답장 카드 DB 컬럼 확장 DDL
- `backend/src/main/resources/db/migration/V5__add_thank_you_photo_url.sql`: Flyway V5 수령인 포토 감사 카드 DB 컬럼 확장 DDL
- `docker-compose.yml`: PostgreSQL 16 DB 컨테이너 1방 구동 Docker 환경 파일
- `backend/src/main/java/com/sharepresent/domain/curation/entity/CurationBox.java`: `minBudget` 컬럼 포함 JPA 엔티티
- `backend/src/main/java/com/sharepresent/domain/order/scheduler/GiftExpirationScheduler.java`: 7일 만료 자동 환불 스케줄러
- `backend/src/main/java/com/sharepresent/domain/payment/controller/PaymentWebhookController.java`: PG사 결제 웹훅 엔드포인트
- `backend/src/main/java/com/sharepresent/domain/order/service/OrderService.java`: 선물 수락, 정산, 차액 부분 환불 및 만료 전액 환불 계산
- `backend/src/test/java/com/sharepresent/domain/`: MockMvc 컨트롤러 테스트 및 JPA 단위 테스트 스위트 (100% 통과)

### 프론트엔드 (Next.js 16 / TypeScript / Tailwind CSS)
- `frontend/src/app/page.tsx`: 이중 예산 셀렉터, 레터 테마, 상품 큐레이션 설계 및 결제 모달 연동
- `frontend/src/app/dashboard/page.tsx`: 보낸 선물함 / 받은 선물함 대시보드 및 공유 모달 연동
- `frontend/src/app/gift/[token]/page.tsx`: 수령인 3D 왁스 씰 개봉 및 주소지 입력 (가격 100% 비노출)
- `frontend/src/app/gift/track/[token]/page.tsx`: 수령인 동적 4단계 배송 타임라인 & 운송장 조회
- `frontend/src/app/result/[token]/page.tsx`: 보내는 사람 전용 최종 정산 명세서 및 영수증 이미지 다운로드
- `frontend/src/components/CheckoutModal.tsx`: 에스크로 가승인 결제 샌드박스 모달
- `frontend/src/components/ShareModal.tsx`: 카카오톡 / 인스타 DM / Web Share API 공유 모달
- `frontend/src/components/DeliveryDrawer.tsx`: 도로명 주소 검색 및 배송 메모 드로어
- `frontend/src/components/UnwrappingRibbon.tsx`: 3D 왁스 씰 개봉 애니메이션 컴포넌트
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

### 3) 프론트엔드 실행
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

1. **카카오 알림톡(Notification Talk) API 연동**:
   - 수령인 배송지 입력 시 송신자에게 카톡 알림 발송 및 택배 출고 시 수령인에게 운송장 알림톡 자동 발송.
2. **프로덕션 PostgreSQL DB 환경 구축**:
   - `application-prod.yml` 환경 설정 및 AWS RDS/Supabase 연결.


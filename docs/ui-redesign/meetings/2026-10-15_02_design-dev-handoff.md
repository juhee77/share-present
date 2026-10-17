# 회의록 #2: 디자인 → 개발팀 핸드오프

| 항목 | 내용 |
|---|---|
| 일시 | 2026-10-15 (목) 23:50 ~ 00:10 |
| 안건 | 개편 디자인 전달, 기술 설계 합의, 작업 티켓 분해, 수용 기준(AC) 확정 |
| 선행 회의 | [#1 디자인팀 리뷰](./2026-10-15_01_design-team-review.md) |

## 참석자
| 역할 | 소속 |
|---|---|
| 디자인 리드 | 디자인팀 |
| 프로덕트 디자이너 | 디자인팀 |
| **테크 리드 (FE)** | 개발팀 |
| **프론트엔드 개발자** | 개발팀 |
| **QA 엔지니어** | 개발팀 |
| PM | 프로덕트 |

---

## 1. 디자인 전달 (디자인 리드)
- 제안서 `ui-redesign-proposal.html`의 Before/After 목업과 결정 사항 D1~D9를 설명했다.

## 2. 기술 토의

### Q1. 1,037줄짜리 `page.tsx`를 어떻게 나눌까? (테크 리드)
- **결정**:
  - 상수(상품 룩북, 상황 프리셋, 카테고리, 예산 옵션)는 `lib/catalog.ts`로 옮긴다.
  - 단계 검증 로직은 순수 함수 `lib/createFlow.ts`로 분리하고 **테스트를 먼저 작성**한다(TDD).
  - 화면은 `components/create/*`의 단계별 컴포넌트로 나눈다. `page.tsx`는 상태 오케스트레이터만 맡는다.
  - 상태는 단일 `GiftDraft` 객체로 두고, `updateDraft(draft, patch)`로 **불변 업데이트**한다(팀 코딩 규칙).

### Q2. 단계는 URL 라우트로 할까, 로컬 상태로 할까?
- **FE 개발자**: 라우트로 분리하면 새로고침 시 draft가 사라지고, 전역 스토어가 필요해진다.
- **결정**: 이번 스프린트는 **같은 페이지 안의 로컬 상태**로 구현한다. 단계 전환 시 스크롤을 맨 위로 올리고 포커스를 이동한다. URL 동기화는 백로그로 둔다.

### Q3. 헤더와 탭바의 노출 규칙은 어디서 관리할까?
- **결정**: 순수 함수 `lib/navigation.ts`의 `getNavMode(pathname)`으로 한 곳에서 관리한다.
  - `/gift/*`: `header: "minimal"`, `showTabBar: false`
  - `/admin*`: `header: "admin"`, `showTabBar: false`
  - `/result/*`: `header: "full"`, `showTabBar: false`(정산서는 단독 문서 성격)
  - 그 외: `header: "full"`, `showTabBar: true`

### Q4. 테스트 도구
- **QA**: 프론트 테스트 러너가 없다. Next 16 공식 가이드에 Vitest 구성이 있다.
- **결정**: `vitest + jsdom + @testing-library/react`를 도입하고 `npm test` 스크립트를 추가한다.
  - 필수 테스트: `createFlow`, `navigation`, `ConfirmSheet`, **`ProductCard` 가격 비노출 회귀**.

### Q5. 백엔드 영향
- **테크 리드**: `createCurationBox` 페이로드는 기존 필드를 그대로 쓴다(`minBudget`, `maxBudget`, `cardTheme`, `fontStyle`, `packagingStyle`, `sealMonogram`, `claimPin`, `allowCustomInput`, `productIds`, `customProducts`). **변경 없음.**

## 3. 작업 티켓
| ID | 티켓 | 담당 | 선행 |
|---|---|---|---|
| FE-1 | Vitest 도입과 설정 | FE | - |
| FE-2 | `createFlow.ts` 테스트와 구현 | FE | FE-1 |
| FE-3 | `navigation.ts` 테스트와 구현, Header·AppTabBar·layout 적용 | FE | FE-1 |
| FE-4 | `catalog.ts` 상수 분리 | FE | - |
| FE-5 | StepProgress, StickyActionBar | FE | FE-2 |
| FE-6 | OccasionBudgetStep | FE | FE-4 |
| FE-7 | GiftPickerStep과 CompactProductCard | FE | FE-4 |
| FE-8 | CardDesignStep과 CardPreview | FE | - |
| FE-9 | ReviewStep, page.tsx 오케스트레이션 | FE | FE-5~8 |
| FE-10 | ConfirmSheet 테스트와 구현, 대시보드 적용 | FE | FE-1 |
| FE-11 | globals.css 디자인 토큰과 접근성 | FE | - |
| QA-1 | 가격 비노출 회귀 테스트, 브라우저 E2E 시나리오 점검 | QA | 전체 |

## 4. 수용 기준 (Acceptance Criteria)
1. **AC-1**: `/`에서 4단계 진행 바가 보이고, CTA는 하단에 고정되어 항상 보인다.
2. **AC-2**: min > max이거나 선물 0개이거나 PIN이 4자리 미만(사용 시)이거나 이름이 공백이면 '다음'·'결제' 버튼이 비활성화되고 사유 문구가 표시된다.
3. **AC-3**: 1단계에서 상황을 선택하면 예산·추천 상품·메시지가 자동으로 적용된다.
4. **AC-4**: 3단계 미리보기가 테마·폰트·씰·메시지 변경을 즉시 반영한다.
5. **AC-5**: 4단계 요약에서 [수정]을 누르면 해당 단계로 이동한다. 결제 시 기존 CheckoutModal과 ShareModal이 동작한다.
6. **AC-6**: `/gift/*`에 내비 링크·탭바·Admin·가격 텍스트가 없다.
7. **AC-7**: 대시보드 선물 취소가 ConfirmSheet로 확인된다(`confirm()` 제거).
8. **AC-8**: `npm test`, `tsc --noEmit`, `npm run lint`(신규 에러 없음), `npm run build`를 모두 통과한다.

## 5. 리스크
| 리스크 | 대응 |
|---|---|
| 기존 lint 경고·에러가 많아 lint 게이트가 실패할 수 있음 | 신규·수정 파일 기준으로 에러 0을 목표로 하고, 기존 이슈는 리포트에 기록 |
| 하단 고정 CTA와 탭바가 겹침 | 생성 화면은 CTA를 탭바 위에 쌓고 safe-area를 반영 |
| 탭바가 모달 위에 올라옴 | 모달 z-index(50 이상) 대비 탭바는 z-30 |

## 6. Action Items
- 개발팀: FE-1 ~ FE-11 진행 후 QA 리뷰 회의(#3)를 소집한다.
- 디자인팀: 구현 결과 스크린샷으로 디자인 QA를 진행한다.

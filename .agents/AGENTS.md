# SharePresent AI Agent Guidelines & Session Handover Rule

## 🚨 MANDATORY INSTRUCTION FOR ALL AI AGENTS
When starting a new session, taking over work, or modifying any code in this repository:

1. **READ HANDOVER DOCUMENTATION FIRST**:
   - You MUST read [.agents/HANDOVER.md](file:///Users/juhee/IdeaProjects/sharepresent/.agents/HANDOVER.md) before making any code modifications or designing features.
   - It contains the latest architecture decisions, zero-price recipient privacy rules, editorial UI guidelines, REST API specs, and local running instructions.

2. **CORE BUSINESS RULES TO OBEY STRICTLY**:
   - **Zero Price Exposure for Recipient**: NEVER expose prices, budget limits, or refund amounts on recipient pages (`/gift/[token]` or `/gift/track/[token]`).
   - **Double-Bound Budgeting**: Always preserve both `minBudget` and `maxBudget` fields across backend JPA entities, DTOs, and frontend components.
   - **Backend Server Port**: Spring Boot backend runs on port `8081` (`./gradlew bootRun`).
   - **Frontend Dev Server**: Next.js App Router runs on port `3000` (`npm run dev`).

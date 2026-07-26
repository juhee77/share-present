-- Flyway Migration V2: Seed Initial Luxury Products Data (ANSI SQL Standard)

-- Initial User
INSERT INTO users (id, email, nickname, phone_number) 
VALUES (1, 'juhee@sharepresent.com', '주희', '010-1234-5678');

-- Initial Products
INSERT INTO products (id, brand, name, price, description, options, image_url, is_custom)
VALUES 
(1, 'OIMU', '소락사 샌디 도자기 머그', 38000, '설악산의 모래 질감을 담아낸 아늑하고 미니멀한 핸드메이드 도자기 컵 세트입니다.', '샌드 화이트,클레이 브라운', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', false),
(2, 'GRANHAND', '마린 오크모스 사쉐 퍼퓸', 45000, '차분하고 내추럴한 나무와 풀 향으로 방 안을 가득 채우는 섬세한 패브릭 사쉐 퍼퓸입니다.', '규장,마린,수지발삼', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80', false),
(3, 'NONFICTION', '젠틀나잇 핸드워시 (300ml)', 32000, '달콤한 스웨이드와 시더우드 향이 어우러져 매일의 일상을 특별하게 해주는 핸드케어.', NULL, 'https://images.unsplash.com/photo-1608248597309-45da1e028896?w=600&auto=format&fit=crop&q=80', false),
(4, 'CROWCANYON', '머그 & 플레이트 세트', 48000, '마블 패턴으로 주방의 감도를 한 단계 올려주는 빈티지 테이블웨어 세트입니다.', '블랙 마블,핑크 마블,베이비 블루 마블', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80', false),
(5, 'HUXLEY', '바디 케어 워시 & 로션 듀오', 52000, '선인장 시드 오일이 선사하는 깊은 보습과 시그니처 모로칸 정원 향의 바디 세트.', NULL, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80', false),
(6, 'SOHPE', '아로마 오일 센티드 홈 캔들', 41000, '천연 에센셜 오일 블렌딩으로 심신을 안정시키고 평온한 무드를 제안하는 홈 캔들.', '유칼립투스 라벤더,패츌리 샌달우드', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80', false);

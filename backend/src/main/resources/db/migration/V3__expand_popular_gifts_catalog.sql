-- Flyway Migration V3: Expand Popular Luxury Gifting Catalog Data (ANSI SQL Standard)

INSERT INTO products (id, brand, name, price, description, options, image_url, is_custom)
VALUES 
(7, 'TAMBURINS', '퍼퓸 핸드크림 CHAMO (30ml)', 32000, '진득한 카모마일의 약초 향과 따스한 우디 가드의 부드러움이 감도는 탬버린즈 시그니처 핸드크림.', 'CHAMO,BERGA SANDAL,LALE', 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80', false),
(8, 'AESOP', '레저렉션 아로마틱 핸드 밤 (75ml)', 39000, '지친 손에 유분기 없는 풍부한 수분감을 공급하는 이솝의 아이코닉 시트러스 우디 핸드밤.', NULL, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', false),
(9, 'DIPTYQUE', '미니 센티드 캔들 베이 (70g)', 68000, '장미 꽃다발의 향과 블랙커런트 잎의 싱그러운 도회적 노트가 조화로운 딥티크 시그니처 캔들.', '베이(Baies),장미(Roses),피기에(Figuier)', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80', false),
(10, 'SABRE', '비스트로 디너 카트러리 2인 세트', 46000, '파리 카페의 감성을 담아낸 컬러풀하고 세련된 프랑스 프리미엄 카트러리 세트.', '아이보리,티크,타코이즈', 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600&auto=format&fit=crop&q=80', false),
(11, 'KINTO', '데이오프 텀블러 (500ml)', 42000, '부드러운 손잡이와 은은한 파스텔 톤 코팅으로 일상 속 휴식을 선사하는 킨토 스테인리스 텀블러.', '무스타치 화이트,페일 블루,카키', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80', false),
(12, 'LE LABO', '상탈 33 바디 로션 (237ml)', 98000, '스모키한 피망과 카드멈, 바이올렛 향이 아우러져 개성을 완성하는 르라보의 클래식 로션.', NULL, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80', false),
(13, 'MAISON MARGIELA', '레이지 선데이 모닝 디퓨저 (185ml)', 118000, '깨끗하게 세탁된 갓 다린 리넨 이불에서 느껴지는 포근하고 부드러운 화이트 머스크 향.', NULL, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80', false),
(14, 'HAY', '클리어 그래픽 유리컵 & 트레이 세트', 54000, '덴마크 북유럽 감성의 덴마크 HAY 그래픽 기하학 패턴 테이블웨어 세트.', '옐로우 트레이,그린 트레이', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', false),
(15, 'SANTA MARIA NOVELLA', '프리지아 고체 향수 왁스 태블릿', 58000, '피렌체 전통 제조법으로 꽃잎을 굳혀 옷장과 드레스룸을 고급스러운 프리지아 향으로 채워주는 왁스.', NULL, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80', false),
(16, 'BANG & OLUFSEN', '베오사운드 A1 2nd Gen 포터블 스피커', 145000, '덴마크 뱅앤올룹슨의 명품 방수 블루투스 스피커. 아노다이징 알루미늄 돔 케이싱.', '블랙 앤트러사이트,샤방 핑크,골드 톤', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80', false);

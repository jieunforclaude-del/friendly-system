# 인수인계 (새 채팅에서 이어가기용)

마지막 업데이트: 2026-11-08
새 채팅에서 "HANDOFF.md랑 CLAUDE.md 읽고 이어서 하자"라고 하면 됩니다.

## 사용자 / 블로그
- 네이버 블로그: https://blog.naver.com/pothun0504 (여행 블로그, 2026년 10월 개설)
- 수익화: 세시간전(3ha.in) 경유 제휴 링크 — 트립닷컴, 클룩, 아고다, 여기어때, 마이리얼트립, 줌줌투어 등
- 작성 규칙은 CLAUDE.md (전달 방식: 코드블록 X, 채팅 본문에 모바일 가독성 형식으로 바로 출력)
- 말투: 반말 섞인 편한 해요체, 직접 겪은 내용은 사용자가 알려준 것만 쓰고 지어내지 않기

## 작업 방식 (리서치)
- 네이버 검색: `search.naver.com/search.naver?ssc=tab.blog.all&query=...` 를 curl로 받아 상위 글 URL 추출
- 자동완성: `ac.search.naver.com/nx/ac?q=...&st=100&r_format=json&q_enc=UTF-8&r_enc=UTF-8`
- 글 본문: `m.blog.naver.com/PostView.naver?blogId=...&logNo=...` (모바일 UA)
- tools/research/facts.py : 블로그 글에서 키워드 포함 문장 뽑기 (KW 정규식을 주제별로 바꿔 씀)
  사용: `python3 -I tools/research/facts.py <저장폴더> blogId/logNo ...`
- tools/research/render.js : JS로 그려지는 페이지(노랑풍선, 트립닷컴, 공식 사이트) 헤드리스 크롬으로 텍스트 추출
  사용: `NODE_PATH=$(npm root -g) node tools/research/render.js <url> <out.txt>`
- 사실 확인은 공식 페이지 우선, 블로그 1곳만 근거면 "후기 기준"으로 표시

## 글 목록과 상태 (posts/)
| 파일 | 주제 | 수익화 | 상태 |
|---|---|---|---|
| osaka-usj-express-pass.md | USJ 익스프레스 패스 후기 | O (클룩·트립닷컴) | 발행됨 |
| osaka-forz-hotel-namba.md | 포즈호텔 긴테쓰 오사카 난바 후기 | O (트립닷컴·아고다) | 발행됨 (224468351075). 남은 것: 네이버 지도 장소 카드 추가, 아고다 링크를 호텔 페이지로 교체 |
| hongkong-flights.md | 홍콩 항공권 (할인코드 3HAFLT3) | O (트립닷컴·클룩) | 발행됨 (224467813897), 11/7 보강판(가기 좋은 시기·2027 피할 시기) 제공 |
| goesan-mungwang-ginkgo.md | 괴산 문광저수지 은행나무 | X | 발행 여부 미확인 |
| goesan-pinkmuhly.md | 괴산 핑크힐 글라스정원 핑크뮬리 | X | 초안 제공 (방문일 11/1로 가정) |
| gyeonggi-chonkangs-best10.md | 경기도 촌캉스 숙소 BEST 10 (겨울판) | O (여기어때) | 초안 제공 |
| yellowballoon-tours.md | 노랑풍선 당일 버스투어 + 시티투어 | X (제휴 경로 없음) | 11/6 기준 초안 제공 |
| incheon-jeil-fishing.md | 인천제일바다낚시 | X | 초안 제공 (쭈갑 시즌 11/30까지) |
| korea-grand-festival-travel.md | 코리아 그랜드 페스티벌 여행 혜택 | X | 발행됨 (224468399778). 남은 것: "내일" → 날짜로, 기준일 문구, 네이버 항공 조건 보강 |
| zoomzoomtour-promo.md | 줌줌투어 감사절 프로모션 | O (줌줌투어) | 보류 — 11/7 개인정보 유출 주장 글 있음, 공식 확인 후 발행 결정 |
| kakao-travel-insurance.md | 카카오 여행자보험 후기 (태국 폰 침수 20만원 보상) | X (보험은 제휴 불가) | 초안 제공 |
| gangnam-women-only-sauna.md | 강남 여성전용 사우나 5곳 | X | 모바일 형식 최신판 제공 |
| seoul-women-only-sauna.md | 서울 15곳 버전 (2편 소재) | X | 보관용 |

## 사용자 실제 경험 메모
- 2026-08 오사카 (여자 둘): USJ 입장권 트립닷컴, 익스프레스 패스 4 ~마인카트&죠스~ 클룩(¥22,800). 동키콩 최고, 해리포터 좋음, 마리오카트 쏘쏘, 죠스 아이용
- 포즈호텔 긴테쓰 오사카 난바 2박 385,703원(트립닷컴), 대욕장은 못 감
- 괴산 문광저수지(10/25 추정)·핑크힐(11/1 추정) 방문
- 카카오 여행자보험 매번 가입, 인당 1만원대(일주일), 2024 태국 폰 침수 22만 → 20만 보상, 이후 DIY로 휴대품 최대
- 홍콩익스프레스 심야편 시간 직접 확인함

## 다음에 할 일 후보
- 줌줌투어 유출 건 뉴스·공지 재확인
- 발행된 글 노출 순위 체크 (포즈호텔, 홍콩 항공권, 코그페)
- 이전 초안들을 새 전달 형식(모바일 가독성)으로 다시 제공
- 서울 여성전용 사우나 2편 (강북·동남권 + 근교)

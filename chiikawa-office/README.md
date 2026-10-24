# 🐹 치이카와 오피스

Claude Code가 일하는 모습을 치이카와·하치와레·우사기·시사·랏코·쿠리만쥬가 사무실에서 일하는 장면으로 보여주는 개인용 대시보드.

- Claude Code 세션 하나 = 캐릭터 하나 (문으로 출근 → 책상에 앉음)
- 파일 읽기/검색 📖 → 책 읽기 · 파일 수정 ✏️ → 타자 · 터미널 💻 → 땀 흘리며 타자
- 권한 허락 대기 🙋 → 손 들고 "허락해줘!" (노란 말풍선)
- 작업 끝 ✨ → 점프 후 소파에서 낮잠 · 세션 종료 → 퇴근

필요한 것: Node.js 18 이상 (외부 패키지 없음)

## 사용법

```bash
cd chiikawa-office
node setup.js     # 1) ~/.claude/settings.json 에 훅 추가 (기존 설정은 .bak-chiikawa-office 로 백업)
node server.js    # 2) 서버 실행 → 브라우저에서 http://localhost:3141 열기
```

그다음 **새 터미널에서 Claude Code를 실행**하면 캐릭터가 출근해요.
(이미 켜져 있던 세션은 재시작해야 훅이 적용돼요.)

- 서버 없이 구경만: `index.html`을 브라우저로 열고 **데모 모드** 클릭
- 훅 제거: `node setup.js --remove`
- 포트 변경: `CHIIKAWA_PORT=4000 node server.js` (훅 쪽도 같은 환경변수 필요)
- 폴더를 옮기면 `node setup.js`를 다시 실행해 주세요 (훅이 hook.js 경로를 기억함).

서버가 꺼져 있어도 훅은 조용히 넘어가므로 Claude Code 사용에는 영향이 없어요.
서버는 `127.0.0.1`에서만 열려서 내 컴퓨터 밖에서는 접근할 수 없어요.

## 캐릭터 그림 바꾸기 (ChatGPT 등)

### 자동으로 (OpenAI API)

[OpenAI API 키](https://platform.openai.com/api-keys)가 있으면 그림을 자동으로 만들어서 `sprites/`에 넣어줘요.

```bash
OPENAI_API_KEY=sk-... node generate.js            # 기본 그림 6장
OPENAI_API_KEY=sk-... node generate.js --poses    # 자세별 그림까지 (총 48장)
OPENAI_API_KEY=sk-... node generate.js usagi --force   # 마음에 안 드는 캐릭터만 다시
```

- Windows PowerShell: `$env:OPENAI_API_KEY="sk-..."; node generate.js`
- 그림 1장마다 요금이 나가요. `--quality=low` 로 싸게, `--quality=high` 로 예쁘게.
- 이미 있는 그림은 건너뛰니까, 몇 번 실행해도 새로 필요한 것만 그려요.

### 직접 넣기

`sprites/` 폴더에 `chiikawa.png`, `hachiware.png`, `usagi.png`, `shisa.png`, `rakko.png`, `kurimanju.png` 를 넣으면 손그림 대신 그 그림이 나와요.
자세별 그림, 파일 이름 규칙은 [sprites/README.md](sprites/README.md) 참고.

> 치이카와 캐릭터의 저작권은 나가노(ナガノ)에게 있습니다. 개인 감상용으로만 사용하세요.

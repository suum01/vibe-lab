# 게임 프로젝트

바이브 코딩으로 제작하거나 팀 프로젝트로 참여한 게임을 모았습니다. 기획, 제작, 피드백 반영과 테스트 경험은 각 게임의 README에서 확인할 수 있습니다.

| 게임 | 소개 및 파일 | 플레이 | 소스 상태 |
| --- | --- | --- | --- |
| 내 차에서 나 좀 꺼내줘! | [자동차 방탈출](locked-car-escape/) | [실행](elaborate-cassata-f398fd.netlify.app) | 단일 HTML 포함 |
| HYUNDAI MERGE | [현대자동차 수박게임](hyundai-merge/) | [실행](https://steady-meerkat-333e61.netlify.app/) | HTML 및 차량 이미지 포함 |
| 인제 카트레이싱 | [3D 레이싱 · 팀 프로젝트](inje-kart-racing/) | [실행](https://inje-kart-racing-20261103.headyart1.chatgpt.site/) | 소개만 포함 · 소스 추가 예정 |

## 로컬 실행

저장소 루트에서 Python 3으로 서버를 실행합니다.

```sh
python3 -m http.server 8000
```

- 자동차 방탈출: [elaborate-cassata-f398fd.netlify.app](https://elaborate-cassata-f398fd.netlify.app/)
- HYUNDAI MERGE: [https://steady-meerkat-333e61.netlify.app/](https://steady-meerkat-333e61.netlify.app/)

자동차 방탈출은 HTML 파일을 직접 열어도 실행됩니다. HYUNDAI MERGE는 온라인에서 Matter.js 0.20.0을 CDN으로 불러오며, 연결할 수 없으면 내장 물리 엔진을 사용합니다.

## 경험과 직무 역량

| 경험 | 연결 가능한 역량 | 근거 |
| --- | --- | --- |
| 자동차 방탈출 | 사용자 요구 분석 및 UI/UX 개선 | 피드백에 따라 사물 강조, 시점 전환, 힌트 방식 개선 |
| HYUNDAI MERGE | 시스템 설계 및 SW 로직 검토 | 합성 조건, 점수, 등장 확률과 아이템 예외 조건 정의 |
| 인제 카트레이싱 | SW 테스트 및 검증 | 충돌 반응과 AI 주행 문제를 발견하고 개선 의견 전달 |

## 소스 및 에셋

자동차 방탈출과 HYUNDAI MERGE는 제공된 원본에서 가져왔으며 게임 코드는 변경하지 않았습니다. 카트레이싱 소스는 원본 확보 후 추가할 예정입니다. 외부 차량 이미지와 효과음은 각 원저작자의 권리를 따르며, 별도의 오픈소스 라이선스는 지정하지 않았습니다.

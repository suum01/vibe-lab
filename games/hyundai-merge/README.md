# HYUNDAI MERGE — 현대자동차 수박게임

현대자동차 차량 사진을 사용한 팬메이드 합성 웹게임입니다.

## 바로 실행하기

저장소 루트에서 Python 3으로 정적 서버를 실행합니다. 별도 패키지 설치는 필요하지 않습니다.

```sh
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000/games/hyundai-merge/`에 접속합니다.
`index.html`과 `assets/`를 함께 유지해야 합니다. `assets/` PNG 파일을 같은 이름으로 바꾸면 이미지가 교체됩니다.
원본 안내에 언급된 이미지 내장형 `HYUNDAI_MERGE_바로실행.html`은 제공된 ZIP에 없어 이 저장소에는 포함되어 있지 않습니다.

## 게임 방법

- PC: 마우스로 낙하 위치 이동 → 클릭하여 낙하 / 방향키, A·D 이동 / Space 또는 ↓ 낙하 / P 일시정지 / R 재시작(확인)
- 모바일: 게임판에서 손가락을 옆으로 이동 → 떼면 낙하 / ◀, ▶, DROP 버튼도 사용 가능
- 같은 모델 2대를 합치면 1단계 성장하고 점수가 오릅니다. 합성 점수만 인정됩니다.
- 자동차가 위험선 위로 쌓인 상태가 2초 이상 이어지면 게임 오버입니다.
- 1~4단계 차량만 직접 등장하며, 5~9단계는 합성으로 완성합니다.
- 특수 아이템(말 2%, 폭탄 2%, 다운그레이드 2%)은 낮은 확률로 일반 차량 대기열에 포함됩니다.

## 사진 파일 매핑

| 단계 | 파일 | 차량 | 상태 |
|---|---|---|---|
| 1 | assets/casper.png | 캐스퍼 | 제공 사진 |
| 2 | assets/avante.png | 아반떼 | 제공 사진 |
| 3 | assets/sonata.png | 쏘나타 | 제공 사진 |
| 4 | assets/santafe.png | 싼타페 | 제공 사진 |
| 5 | assets/staria.png | 스타리아 | 제공 사진 |
| 6 | assets/porter2.png | 포터 II | 제공 사진 |
| 7 | assets/mighty.png | 마이티 | **제공되지 않음 → Canvas 트럭 일러스트로 대체** |
| 8 | assets/xcient.png | 엑시언트 | 제공 사진 |
| 9 | assets/universe.png | 유니버스 | 제공 사진 |

**참고:** 사용자가 제공한 `카운티` 사진은 `assets/county.png`로 보존되어 있지만, 최종 지정 성장 순서가 `마이티`를 포함하므로 게임에는 사용하지 않습니다. `assets/mighty.png`를 넣으면 자동으로 실제 사진이 표시됩니다.

원본 사진의 색상을 강제 필터로 바꾸지 않았습니다. 지정 HEX 색상은 각 모델의 게임 물리 충돌체 주위 색상과 보조 강조 색상에 반영했습니다.

## 기술

- HTML5 Canvas, JavaScript ES6, CSS3, requestAnimationFrame, Web Audio API, localStorage.
- **Matter.js v0.20.0**을 CDN에서 읽을 수 있을 때 실제 Matter.js 물리 엔진을 사용합니다.
- 브라우저가 오프라인이거나 CDN이 차단되면 게임 내 포함된 경량 원형 물리 엔진이 자동으로 실행됩니다. 오프라인 시 물리 반응은 Matter.js와 다소 다를 수 있습니다.
- 서버 인증, 유료 API, 계정이 필요 없습니다. 정적 호스팅으로 배포할 수 있습니다.

## 무료 URL 공유

GitHub Pages: 저장소 Settings → Pages → Deploy from a branch에서 `main` 브랜치와 `/ (root)`를 선택합니다. 게시 후 사이트 주소의 `/games/hyundai-merge/` 경로에서 플레이할 수 있습니다. 이 설정은 저장소 소유자가 별도로 적용해야 합니다.

Cloudflare Pages: ZIP을 풀고 `hyundai-merge` 폴더의 내용을 정적 사이트 파일로 업로드합니다.

이 소스는 사용자가 제공한 차량 이미지를 기반으로 제작한 비공식 팬 게임이며 현대자동차의 공식 게임이 아닙니다.

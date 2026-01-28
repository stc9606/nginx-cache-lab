# Nginx Cache Lab

Nginx를 활용한 웹 캐시 서버 학습 프로젝트

## 아키텍처

```
┌──────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Client  │─────▶│  Nginx Cache    │─────▶│  Origin Server  │
│  (curl)  │:8080 │  (프록시/캐시)    │:3000 │  (Node.js)      │
└──────────┘      └─────────────────┘      └─────────────────┘
                         │
                  ┌──────┴──────┐
                  │ Cache Store │
                  └─────────────┘
```

## 빠른 시작

```bash
# 환경 시작
docker-compose up --build

# 캐시 테스트 (새 터미널)
curl -I http://localhost:8080/api/data  # MISS
curl -I http://localhost:8080/api/data  # HIT
```

## 커리큘럼

### Week 1-2: 기초

| Lab | 주제 | 배우는 것 |
|-----|------|----------|
| [Lab 1](./labs/lab1-setup/) | 환경 구성 | Docker Compose, 프록시 기본 동작 |
| Lab 2 | 캐시 HIT/MISS | proxy_cache, 캐시 저장소 구조 |
| Lab 3 | TTL과 만료 정책 | proxy_cache_valid, Cache-Control |

### Week 3-4: 실전 패턴

| Lab | 주제 | 배우는 것 |
|-----|------|----------|
| Lab 4 | 캐시 키 설계 | proxy_cache_key, 적중률 최적화 |
| Lab 5 | 조건부 요청 | ETag, Last-Modified, 304 응답 |
| Lab 6 | 캐시 우회/무효화 | bypass, no_cache, PURGE |

### Week 5-6: 심화

| Lab | 주제 | 배우는 것 |
|-----|------|----------|
| Lab 7 | 성능 측정 | Apache Bench, wrk, 병목 분석 |
| Lab 8 | OpenResty + Lua | 커스텀 캐시 로직, Redis 연동 |

## 프로젝트 구조

```
nginx-cache-lab/
├── docker-compose.yml      # 컨테이너 오케스트레이션
├── nginx/
│   ├── nginx.conf          # Nginx 메인 설정
│   └── conf.d/
│       └── default.conf    # 프록시/캐시 규칙
├── origin/
│   ├── Dockerfile
│   ├── package.json
│   └── app.js              # Origin API 서버
└── labs/
    └── lab1-setup/         # 실습 가이드
```

## 주요 엔드포인트

| 경로 | 설명 | 캐시 |
|------|------|------|
| `GET /api/data` | 기본 API | O (10분) |
| `GET /api/users/:id` | 사용자 조회 | O (10분) |
| `GET /api/slow` | 느린 응답 (2초) | O (10분) |
| `GET /health` | 헬스체크 | X |
| `GET /stats` | Origin 통계 | X |

## 유용한 명령어

```bash
# 캐시 상태 확인
curl -I http://localhost:8080/api/data | grep X-Cache

# 응답 시간 비교
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:8080/api/data

# Origin 로그 확인
docker-compose logs -f origin

# Nginx 로그 확인
docker-compose logs -f cache

# 환경 재시작 (캐시 초기화)
docker-compose down -v && docker-compose up --build
```

## 학습 목표

이 프로젝트를 완료하면:

- HTTP 캐싱 메커니즘 (Cache-Control, ETag, Expires) 이해
- Nginx 리버스 프록시 및 캐시 설정 능력
- 캐시 키 설계와 적중률 최적화 방법
- 실무에서 캐시 관련 이슈 디버깅 능력

## 참고 자료

- [Nginx Caching Guide](https://docs.nginx.com/nginx/admin-guide/content-cache/content-caching/)
- [HTTP Caching - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Cache-Control Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)

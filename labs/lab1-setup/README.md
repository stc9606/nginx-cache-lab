# Lab 1: 환경 구성

## 목표
- Docker Compose로 Nginx Cache + Origin Server 환경 구성
- 첫 번째 프록시 요청 성공시키기
- 캐시 HIT/MISS 직접 확인하기

## 아키텍처

```
┌──────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Client  │─────▶│  Nginx Cache    │─────▶│  Origin Server  │
│  (curl)  │:8080 │  (port 80)      │:3000 │  (Node.js)      │
└──────────┘      └─────────────────┘      └─────────────────┘
                         │
                  ┌──────┴──────┐
                  │ Cache Store │
                  │(/var/cache) │
                  └─────────────┘
```

## 실습

### 1. 환경 시작

```bash
# 프로젝트 루트에서
docker-compose up --build
```

### 2. Origin 서버 직접 호출 (캐시 없이)

```bash
# Origin 직접 호출 - 항상 500ms 지연
curl -w "\nTime: %{time_total}s\n" http://localhost:3000/api/data
```

매번 `timestamp`와 `requestNumber`가 바뀌는 것을 확인하세요.

### 3. Cache 프록시를 통한 호출

```bash
# 첫 번째 요청 - MISS (Origin에서 가져옴)
curl -I http://localhost:8080/api/data
```

응답 헤더에서 확인:
- `X-Cache-Status: MISS` - 캐시에 없어서 Origin에서 가져옴

```bash
# 두 번째 요청 - HIT (캐시에서 반환)
curl -I http://localhost:8080/api/data
```

응답 헤더에서 확인:
- `X-Cache-Status: HIT` - 캐시에서 바로 반환

### 4. 응답 시간 비교

```bash
# Origin 직접 (느림 - 500ms)
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:3000/api/data

# Cache HIT (빠름 - 수 ms)
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:8080/api/data
```

### 5. Origin 로그 확인

```bash
# 새 터미널에서
docker-compose logs -f origin
```

Cache HIT일 때는 Origin에 요청이 가지 않는 것을 확인하세요.

## 핵심 설정 파일

### nginx/conf.d/default.conf

```nginx
proxy_cache my_cache;              # 캐시 존 사용
proxy_cache_valid 200 302 10m;     # 200/302 응답은 10분간 캐시
add_header X-Cache-Status $upstream_cache_status;  # 캐시 상태 헤더
```

## 체크포인트

- [ ] `docker-compose up` 성공
- [ ] Origin 직접 호출 시 매번 다른 timestamp 확인
- [ ] Cache 경유 시 X-Cache-Status: MISS → HIT 전환 확인
- [ ] Cache HIT 시 응답 시간이 훨씬 빠른 것 확인
- [ ] Origin 로그에서 HIT일 때 요청이 안 오는 것 확인

## 다음 Lab

[Lab 2: 캐시 저장소 구조](../lab2-cache-basics/README.md)에서 캐시가 실제로 어떻게 저장되는지 확인합니다.

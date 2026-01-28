const express = require('express');
const app = express();

const DELAY_MS = parseInt(process.env.DELAY_MS) || 500;
let requestCount = 0;

// 응답 지연 미들웨어 (캐시 효과 체감용)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API 엔드포인트들
app.get('/api/data', async (req, res) => {
    requestCount++;
    console.log(`[Origin] /api/data 요청 #${requestCount}`);

    await delay(DELAY_MS);

    res.json({
        message: 'Hello from Origin Server!',
        timestamp: new Date().toISOString(),
        requestNumber: requestCount,
        processedBy: 'origin'
    });
});

app.get('/api/users/:id', async (req, res) => {
    requestCount++;
    console.log(`[Origin] /api/users/${req.params.id} 요청 #${requestCount}`);

    await delay(DELAY_MS);

    res.json({
        id: req.params.id,
        name: `User ${req.params.id}`,
        timestamp: new Date().toISOString(),
        requestNumber: requestCount
    });
});

app.get('/api/slow', async (req, res) => {
    requestCount++;
    console.log(`[Origin] /api/slow 요청 #${requestCount} (2초 지연)`);

    await delay(2000);  // 의도적으로 느린 응답

    res.json({
        message: 'This was a slow response',
        timestamp: new Date().toISOString(),
        requestNumber: requestCount
    });
});

// 헬스체크
app.get('/health', (req, res) => {
    res.json({ status: 'ok', requestCount });
});

// 통계
app.get('/stats', (req, res) => {
    res.json({
        totalRequests: requestCount,
        uptime: process.uptime()
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Origin server running on port ${PORT}`);
    console.log(`Response delay: ${DELAY_MS}ms`);
});

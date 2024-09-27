
const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 5555;

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// PostgreSQL 클라이언트 설정
const client = new Client({
  user: 'gutest',
  host: 'localhost',
  database: 'test_database',
  password: '1234',
  port: 5555,
});

// 클라이언트 연결
client.connect().catch(err => console.error('Connection error', err.stack));

// SQL 쿼리 실행 API
app.post('/execute-sql', async (req, res) => {
  const sql = req.body.sql;
  console.log('Start time:', new Date());

  try {
    const result = await client.query(sql);
    console.log('Query result:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing SQL:', err);
    res.status(500).send('Error executing SQL query');
  } finally {
    console.log('End time:', new Date());
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});

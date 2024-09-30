// 서치파라미터 받기
// 시간차이 테이블 저장
// 파라미터/시작타임/끝타임/걸린시간
const express = require('express');
const { Client } = require('pg');

const app = express();
const server_port = 3000;
const db_port = 5555;

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// PostgreSQL 클라이언트 설정
const client = new Client({
  user: 'gutest',
  host: 'localhost',
  database: 'test_database',
  password: '1234',
  port: db_port,
});

// 클라이언트 연결
client.connect().catch(err => console.error('Connection error', err.stack));

// SQL 쿼리 실행 API
app.post('/execute-sql', async (req, res) => {
  const sql = req.body.sql;
  

  try {
    const start_time = new Date();
    console.log('Start time:', start_time);
    const result = await client.query(sql);
    console.log('Query result:', result.rows);
    res.json(result.rows);
    const end_time = new Date();
    console.log('End time:', end_time);
    console.log('Execution time:', (end_time - start_time)/1000);
  } catch (err) {
    console.error('Error executing SQL:', err);
    res.status(500).send('Error executing SQL query');
  } 
});

// 서버 시작
app.listen(server_port, () => {
  console.log(`API server running at http://localhost:${server_port}`);
});

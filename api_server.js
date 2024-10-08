const express = require('express');
const { Pool } = require('pg');

const app = express();
const server_port = 3000;
const db_port = 5555;

const date_to_str=(date) => {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// PostgreSQL 클라이언트 설정
const client = new Pool({
  user: 'gutest',
  host: 'localhost',
  database: 'test_database',
  password: '1234',
  port: db_port,
 
});

// 클라이언트 연결
// client.connect().catch(err => console.error('Connection error', err.stack));

// SQL 쿼리 실행 API
app.post('/execute-sql', async (req, res) => {
  const test_title=req.query.title ||null;
  const test_seq=req.query.seq || null;
  const sql = req.body.sql;
  

  try {
    //시작
    const start_time = new Date();
    console.log('Start time:', start_time);

    //쿼리
    const result = await client.query(sql);
    console.log('Query result:', result.rows);
    res.json(result.rows);

    //종료
    const end_time = new Date();
    console.log('End time:', end_time);

    console.log('Execution time:', (end_time - start_time)/1000);

    const logsql=`INSERT INTO api_testtable (test_title, start_time, end_time, execution_time) VALUES ('${test_title}_${test_seq}', '${date_to_str(start_time)}', '${date_to_str(end_time)}', ${(end_time - start_time)/1000});`
    await client.query(logsql);
  } catch (err) {
    console.error('Error executing SQL:', err);
    res.status(500).send('Error executing SQL query');
  } 
});

// 서버 시작
app.listen(server_port, () => {
  console.log(`API server running at http://localhost:${server_port}`);
});
//PostgreSql데이터베이스에 저장된 데이터를 쿼리하고 결과 출력
const { Client } = require('pg');

// PostgreSQL 클라이언트 설정
const client = new Client({
  user: 'gutest',
  host: 'localhost',
  database: 'test_database',
  password: '1234',
  port: 5555,
});

async function testSQL() {
  console.log('Start time:', new Date());

  try {
    await client.connect();

    //pgadmin작성한 sql문 그대로 출력->1초 이상 테스트
     const res = await client.query(`
     SELECT 
       t2.ad,
       COUNT(*) AS count_per_ad,  -- 각 ad에 대한 개수
       SUM(t1.id) AS total_odd_id,  -- 홀수 id의 총합
       AVG(t1.id) AS avg_odd_id,  -- 홀수 id의 평균
       MAX(t1.id) AS max_odd_id,  -- 홀수 id의 최대값
       MIN(t1.id) AS min_odd_id,   -- 홀수 id의 최소값
       SUM(CASE WHEN t1.id > 5 THEN t1.id ELSE 0 END) AS sum_odd_above_5,  -- 5 이상인 홀수 id의 총합
       ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS ad_rank  -- 각 광고의 순위
     FROM 
       payment.test_table AS t1
     JOIN 
       payment.doubletest_table AS t2 
     ON 
       t1.id % 2 = 1  -- test_table에서 홀수인 경우
     AND 
       t2.id % 2 = 0  -- doubletest_table에서 짝수인 경우
     GROUP BY 
       t2.ad  -- ad 컬럼을 기준으로 그룹화
     HAVING 
       COUNT(*) > 1  -- 개수가 1보다 큰 그룹만 포함
     ORDER BY 
       count_per_ad DESC;  -- 개수에 따라 내림차순 정렬
   `);
   
   // 쿼리 결과 출력
   console.log('Query result:');
   console.table(res.rows);  // 콘솔에 테이블 형식으로 출력
 } catch (err) {
   console.error('Error executing SQL:', err);
 } finally {
   await client.end();
   console.log('End time:', new Date());
 }
}

testSQL();

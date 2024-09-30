const query_counter = process.argv[2] ? parseInt(process.argv[2], 10) || null : null
if (query_counter === null) {
  console.log('\nUsage: node request_test.js <number of queries>\n')
  process.exit(1)
}
const data = {
  sql: `
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
  `,
}
const options = {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  },
}

for (let i = 0; i < query_counter; i++) {
  // try {
    const searchParams = `q=sec${i}`
    const url = encodeURI(`http://localhost:3000/execute-sql?${searchParams}`)
    fetch(url, options).catch(err => console.error(`Error: sequence ${i+1}`))
    console.log(`request send : seq no ${i+1}`)
  // } catch (err) {
  //   console.error(`Error: sequence ${i+1}`)
  //   break
  // }
}

console.log(`All ${query_counter} requests are sent`)

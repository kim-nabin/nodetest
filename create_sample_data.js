//샘플테이블 생성 후 샘플 데이터 삽입
const { Client } = require('pg');

// PostgreSQL 클라이언트 설정
const client = new Client({
    user: 'gutest',
    host: 'localhost',
    database: 'test_database',
    password: '1234',
    port: 5555,
  });

async function createSampleData() {
  console.log('Start time:', new Date());

  try {
    await client.connect();
    //public스키마의 sample_table안에 생성
    // 샘플 테이블 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS sample_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 샘플 데이터 삽입
    await client.query(`
      INSERT INTO sample_table (name) 
      VALUES ('Sample Name 1'), ('Sample Name 2'), ('Sample Name 3');
    `);
    console.log('Data inserted successfully.');
  } catch (err) {
    console.error('Error creating sample data:', err);
  } finally {
    await client.end();
    console.log('End time:', new Date());
  }
}

createSampleData();

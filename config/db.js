import mysql from 'mysql2'

export const db = mysql.createConnection({
  host: 'bt5wddo0deumybqpjfur-mysql.services.clever-cloud.com',
  user: 'u0y5ltp8dcnln3gx',
  password: 'FoDb4xj5Pd9THzTKnjXj',
  database: 'bt5wddo0deumybqpjfur'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database');
    return;
  }
  console.log('Connected to the database');

  const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL
      );
    `;

  const createSellersTableQuery = `
      CREATE TABLE IF NOT EXISTS sellers (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL
      );
    `;

  const createBooksTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        publishedDate DATE,
        price DECIMAL(10,2),
        seller_id VARCHAR(255) NOT NULL,
        CONSTRAINT fk_seller_id FOREIGN KEY (seller_id) REFERENCES sellers(id)
      );
    `;

  db.query(createUserTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating users table');
    }
  });

  db.query(createSellersTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating Sellers table');
    }
  });

  db.query(createBooksTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating Books table',err);
    }
  });
});


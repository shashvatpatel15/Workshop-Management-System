const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function initDB() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    const sql = fs.readFileSync('database.sql', 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

    for (let stmt of statements) {
        try {
            await conn.query(stmt);
            console.log("Executed:", stmt.substring(0, 50) + '...');
        } catch (e) {
            console.error("Failed to execute:", stmt.substring(0, 50) + '...', e.message);
        }
    }
    await conn.end();
    console.log("Database initialized.");
}

initDB();

const mysql = require('mysql2/promise');

async function probe() {
    const passwords = ['', 'root', 'mysql', 'admin', 'password', '123456'];
    for (const p of passwords) {
        try {
            const conn = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: p
            });
            console.log("Success with password: '" + p + "'");
            await conn.end();
            return;
        } catch (e) {
            console.log("Failed with password: '" + p + "': " + e.message);
        }
    }
    console.log("All probe attempts failed.");
}

probe();

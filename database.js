const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./routes.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the routes database.');
});

// Создание таблицы "cargo" с новым столбцом "comment", если она еще не существует
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS cargo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cargo_name TEXT,
        weight REAL,
        volume REAL,
        load_date TEXT,
        unload_date TEXT,
        origin TEXT,
        destination TEXT,
        payment_method TEXT,
        status TEXT DEFAULT 'online',
        comment TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating table: ", err.message);
        } else {
            console.log('Table "cargo" is ready.');
        }
    });
});

module.exports = db;
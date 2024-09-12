const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./routes.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the routes database.');
});

// Создание таблицы для грузов
db.run(`CREATE TABLE IF NOT EXISTS cargo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cargo_name TEXT,
    origin TEXT,
    destination TEXT,
    load_date TEXT,
    unload_date TEXT,
    weight REAL,
    volume REAL,
    payment_method TEXT,
    phone TEXT,
    telegram TEXT,
    comment TEXT,
    status TEXT,
    body_type TEXT
)`);

// Главная страница для добавления груза
app.get('/', (req, res) => {
    res.render('index');
});

// Добавление груза
app.post('/add-cargo', (req, res) => {
    const { cargo_name, origin, destination, phone, telegram, comment } = req.body;
    const payment_method = req.body.payment_method || '';
    const body_type = req.body.body_type || '';
    const sql = `INSERT INTO cargo (cargo_name, origin, destination, payment_method, phone, telegram, comment, body_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [cargo_name, origin, destination, payment_method, phone, telegram, comment, body_type];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.redirect('/my-cargos');
    });
});

// Страница "Мои грузы"
app.get('/my-cargos', (req, res) => {
    const sql = `SELECT * FROM cargo ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.render('my-cargos', { cargos: rows });
    });
});

// Удаление груза
app.post('/delete-cargo/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM cargo WHERE id = ?`;

    db.run(sql, id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.redirect('/my-cargos');
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
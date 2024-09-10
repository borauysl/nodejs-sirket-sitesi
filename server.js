const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// uygulamanın ana ayarları
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// sql bağlantısı
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'sirket'
});

const promisePool = pool.promise();

// dosya yükleme
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// token işlemleri
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'Token bulunamadı' });

    jwt.verify(token, 'SECRET_KEY', (err, user) => {
        if (err) return res.status(403).json({ message: 'Geçersiz token' });
        req.user = user;
        next();
    });
};

// api yönleri
app.post('/register', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM users WHERE email = ?',
            [req.body.email]
        );
        if (rows.length > 0) return res.status(400).json({ message: 'Bu e-posta ile zaten bir hesap mevcut' });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await promisePool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [req.body.name, req.body.email, hashedPassword]
        );
        res.status(201).json({ message: 'Kayıt başarılı' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM users WHERE email = ?',
            [req.body.email]
        );
        if (rows.length === 0) return res.status(400).json({ message: 'Kullanıcı bulunamadı' });

        const user = rows[0];
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ email: user.email }, 'SECRET_KEY', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: false });
            res.json({ message: 'Giriş başarılı. Yönlendiriliyor...', redirectUrl: '/index.html' }); // anasayfaya bb
        } else {
            res.status(400).json({ message: 'Şifre yanlış' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/user', authenticateToken, async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT name FROM users WHERE email = ?',
            [req.user.email]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

        res.json({ name: rows[0].name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token'); // tokeni sil direkt
    res.redirect('/index.html');
});

// İletişim formu işlemi
app.post('/contact', express.json(), async (req, res) => {
    try {
        const { subject, message, token } = req.body;

        // verilerin kontrol edilmesi
        if (!subject || !message || !token) {
            return res.status(400).json({ message: 'Konu, mesaj ve token alanları gereklidir' });
        }

        // token doğrulama
        jwt.verify(token, 'SECRET_KEY', async (err, user) => {
            if (err) return res.status(403).json({ message: 'Geçersiz token' });

            // Kullanıcı bilgilerini al
            const [userRows] = await promisePool.query(
                'SELECT name, email FROM users WHERE email = ?',
                [user.email]
            );

            if (userRows.length === 0) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

            const { name, email } = userRows[0];

            await promisePool.query(
                'INSERT INTO messages (subject, message, username, usermail) VALUES (?, ?, ?, ?)',
                [subject, message, name, email]
            );

           
            res.status(201).json({ message: 'Mesaj gönderildi' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

app.post('/apply', upload.fields([{ name: 'cv' }, { name: 'photo' }]), async (req, res) => {
    try {
        const cv = req.files['cv'] ? req.files['cv'][0].buffer : null;
        const photo = req.files['photo'] ? req.files['photo'][0].buffer : null;

        await promisePool.query(
            'INSERT INTO applications (name, surname, email, phone, address, position, cv, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                req.body.name,
                req.body.surname,
                req.body.email,
                req.body.phone,
                req.body.address,
                req.body.position,
                cv,
                photo
            ]
        );
        res.status(201).json({ message: 'Başvuru alındı' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.use(express.static(path.join(__dirname)));

// sunucuyu başlatma
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} portunda çalışıyor`);
});

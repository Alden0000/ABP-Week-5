const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Path database JSON
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'members.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// --- INISIALISASI DATABASE ---
// Membuat folder 'data' jika belum ada
if (!fs.existsSync(DATA_DIR)) { 
    fs.mkdirSync(DATA_DIR); 
}
// Membuat file 'members.json' dengan array kosong jika belum ada
if (!fs.existsSync(DB_FILE)) { 
    fs.writeFileSync(DB_FILE, JSON.stringify([])); 
}

// Helper: Membaca data dari file JSON
const readDB = () => {
    try {
        const rawData = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(rawData);
    } catch (e) {
        console.error("Error membaca database:", e);
        return [];
    }
};

// Helper: Menulis data ke file JSON
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error menulis ke database:", e);
    }
};

// --- ROUTES ---

// Halaman Utama
app.get('/', (req, res) => { 
    // Mengambil data terbaru setiap kali halaman diakses (opsional)
    const members = readDB();
    res.render('index', { members }); 
});

// API: Ambil semua data member
app.get('/api/member', (req, res) => { 
    res.json({ data: readDB() }); 
});

// API: Ambil statistik
app.get('/api/statistik', (req, res) => {
    const data = readDB();
    res.json({ 
        total: data.length, 
        aktif: data.filter(m => m.status === 'Aktif').length 
    });
});

// API: Tambah member baru
app.post('/api/member', (req, res) => {
    const data = readDB();
    const newMember = { 
        id: uuidv4(), 
        nama: req.body.nama, // Pastikan field ini sesuai dengan input form kamu
        status: req.body.status || 'Aktif',
        joined_at: new Date().toISOString().split('T')[0] 
    };
    
    data.push(newMember);
    writeDB(data);
    
    // Kirim response sukses
    res.json({ success: true, member: newMember });
});

// API: Update data member
app.put('/api/member/:id', (req, res) => {
    const data = readDB();
    const index = data.findIndex(m => m.id === req.params.id);
    
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        writeDB(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ message: "Member tidak ditemukan" });
    }
});

// API: Hapus member
app.delete('/api/member/:id', (req, res) => {
    let data = readDB();
    const initialLength = data.length;
    data = data.filter(m => m.id !== req.params.id);
    
    if (data.length < initialLength) {
        writeDB(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ message: "Member tidak ditemukan" });
    }
});

app.listen(PORT, () => {
    console.log(`\n\x1b[33m%s\x1b[0m`, ` 🛡️  Whiteknight Membership System is Live!`);
    console.log(`\x1b[36m%s\x1b[0m`, ` 🔗 Access Terminal: http://localhost:${PORT}\n`);
});
\<div align="center"\>

# LAPORAN PRAKTIKUM

# APLIKASI BERBASIS PLATFORM[cite: 3]

## COTS 2[cite: 3]

\<img src="Assets/logotelu.jpeg" alt ="logo" width = "300"\>[cite: 3]

### Disusun Oleh

**Alden Audy Akbar**[cite: 3]  
**2311102309**[cite: 3]  
**IF-11-04**[cite: 3]

### Dosen Pengampu

**Cahyo Prihantoro, S.Kom., M.Eng.**[cite: 3]

### LABORATORIUM HIGH PERFORMANCE[cite: 3]

FAKULTAS INFORMATIKA[cite: 3]  
UNIVERSITAS TELKOM PURWOKERTO[cite: 3]  
2026[cite: 3]

\</div\>

-----

## 1\. Dasar Teori

### Aplikasi Web

Aplikasi web adalah perangkat lunak yang diakses melalui browser tanpa perlu instalasi lokal, berjalan di atas protokol HTTP/HTTPS dengan sisi *client-side* dan *server-side*[cite: 3].

### Framework Node.js + Express

Node.js adalah *runtime* JavaScript di sisi server yang menggunakan model *event-driven*[cite: 3]. Express.js adalah framework minimalis untuk mempermudah pengelolaan routing dan middleware[cite: 3].

### CRUD (Create, Read, Update, Delete)

Operasi dasar pengelolaan data yang dipetakan ke metode HTTP seperti POST, GET, PUT, dan DELETE[cite: 3].

### DataTables & jQuery Validation

DataTables digunakan untuk menampilkan tabel interaktif dengan fitur pencarian dan paginasi[cite: 3]. jQuery Validation digunakan untuk memastikan validasi form di sisi klien berjalan otomatis[cite: 3].

-----

## 2\. Struktur Folder Proyek

````bash
SIMAHASISWA/
├── index.ejs          ← Frontend UI (Bootstrap + jQuery)
├── server.js           ← Backend REST API (Node.js + Express)
├── package.json        ← Konfigurasi dependencies
├── data/
│   └── members.json  ← Database JSON (Auto-generated)
└── README.md
```[cite: 3]

---

## 3. Kode Program

### A. `package.json`
Mendefinisikan metadata proyek dan daftar *dependencies* seperti `express`, `cors`, dan `uuid`[cite: 3].

```json
{
  "name": "whiteknight-system",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "body-parser": "^1.20.0",
    "cors": "^2.8.5",
    "ejs": "^3.1.8",
    "express": "^4.18.2",
    "uuid": "^9.0.0"
  }
}
```[cite: 3]

### B. `server.js` (Backend)
Mengatur endpoint REST API untuk menangani operasi data pada file `members.json`[cite: 3].

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'members.json');

app.use(express.json());
app.set('view engine', 'ejs');

// Inisialisasi Database
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));

// Routes API
app.get('/api/member', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json({ data });
});

app.post('/api/member', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const newMember = { id: uuidv4(), ...req.body, joined_at: new Date().toISOString().split('T')[0] };
    data.push(newMember);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, member: newMember });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```[cite: 3]

### C. `index.ejs` (Frontend - Script & UI)
Menggunakan DataTables untuk menampilkan data dan jQuery Validation untuk form[cite: 3].

```javascript
// Inisialisasi DataTables
function refreshTable() {
    const data = loadData(); // Load dari localStorage atau API
    $('#dataMahasiswa').DataTable({
        data: data,
        columns: [
            { data: 'nim' },
            { data: 'nama' },
            { data: 'status' },
            {
                data: 'id',
                render: (id) => `<button onclick="editMahasiswa('${id}')">Edit</button>`
            }
        ]
    });
}

// Validasi Form
$('#mahasiswaForm').validate({
    rules: { nim: { required: true }, nama: { required: true } },
    submitHandler: function() {
        // Logika simpan data
    }
});
```[cite: 3]

---

## 4. Cara Menjalankan Aplikasi
1. Ekstrak file proyek dan buka di VS Code[cite: 3].
2. Buka terminal dan jalankan `npm install`[cite: 3].
3. Jalankan server dengan perintah `node server.js`[cite: 3].
4. Akses di browser melalui `http://localhost:3000`[cite: 3].

---

## 5. Kesimpulan
Aplikasi **SiMahasiswa** berhasil mengimplementasikan fitur CRUD secara lengkap menggunakan integrasi Node.js, Express, dan jQuery[cite: 3]. Penggunaan DataTables mempermudah manajemen data dalam jumlah besar, sementara localStorage/JSON file memastikan persistensi data yang ringan[cite: 3].

---

## 6. Referensi & Link Gdrive
* **Referensi**: Node.js Docs, Expressjs.com, Bootstrap Docs[cite: 3].
* **Link Gdrive**: [Klik di sini untuk mengakses file](https://drive.google.com/drive/folders/1oOSQffoSW49_lcFSTZ1C25vm2YYmrc4Z?usp=sharing)[cite: 3].
````
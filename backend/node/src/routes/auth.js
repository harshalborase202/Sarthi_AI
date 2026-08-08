'use strict';
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../../sarthiai.db');
let db = null;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(dbPath);
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email_or_phone TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          aadhaar_number TEXT,
          age TEXT,
          gender TEXT,
          state TEXT,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const columnsToAdd = ['aadhaar_number', 'age', 'gender', 'state', 'address'];
      columnsToAdd.forEach((col) => {
        db.run(`ALTER TABLE users ADD COLUMN ${col} TEXT`, (err) => {
          // Ignore duplicate column errors if column already exists
        });
      });
    });
  }
  return db;
}

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { name, email_or_phone, password, aadhaar_number, age, gender, state, address } = req.body || {};
  if (!name || !email_or_phone || !password) {
    return res.status(400).json({ success: false, error: 'Name, Email/Phone, and Password are required.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO users (name, email_or_phone, password_hash, aadhaar_number, age, gender, state, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    name.trim(),
    email_or_phone.trim().toLowerCase(),
    passwordHash,
    aadhaar_number || null,
    age || null,
    gender || null,
    state || null,
    address || null
  ], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ success: false, error: 'An account with this Email or Phone number already exists.' });
      }
      return res.status(500).json({ success: false, error: err.message });
    }

    return res.json({
      success: true,
      user: {
        id: this.lastID,
        name: name.trim(),
        email_or_phone: email_or_phone.trim().toLowerCase(),
        aadhaar_number: aadhaar_number || null,
        age: age || null,
        gender: gender || null,
        state: state || null,
        address: address || null
      }
    });
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email_or_phone, password } = req.body || {};
  if (!email_or_phone || !password) {
    return res.status(400).json({ success: false, error: 'Email/Phone and Password are required.' });
  }

  const database = getDb();
  database.get(`SELECT * FROM users WHERE email_or_phone = ?`, [email_or_phone.trim().toLowerCase()], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(401).json({ success: false, error: 'Invalid email/phone or password.' });

    const isMatch = bcrypt.compareSync(password, row.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email/phone or password.' });
    }

    return res.json({
      success: true,
      user: {
        id: row.id,
        name: row.name,
        email_or_phone: row.email_or_phone,
        aadhaar_number: row.aadhaar_number,
        age: row.age,
        gender: row.gender,
        state: row.state,
        address: row.address
      }
    });
  });
});

module.exports = router;

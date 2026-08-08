import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'sarthiai.db');
let db = null;

export function getDb() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('[SQLite Auth] Error opening database:', err);
      } else {
        console.log('[SQLite Auth] Connected to sarthiai.db at', dbPath);
      }
    });

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
      `, (err) => {
        if (err) console.error('[SQLite Auth] Table creation error:', err);
        else console.log('[SQLite Auth] ✓ Users table initialized in sarthiai.db');
      });

      // Safely add missing columns if table existed prior to schema update
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

export function signupUser({ name, email_or_phone, password, aadhaar_number, age, gender, state, address }) {
  return new Promise((resolve, reject) => {
    if (!name || !email_or_phone || !password) {
      return reject(new Error('Name, Email/Phone, and Password are required.'));
    }

    const database = getDb();
    
    // Hash password with bcrypt (10 rounds) - never store plain text
    const passwordHash = bcrypt.hashSync(password, 10);

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
          return reject(new Error('An account with this Email or Phone number already exists.'));
        }
        return reject(err);
      }

      resolve({
        id: this.lastID,
        name: name.trim(),
        email_or_phone: email_or_phone.trim().toLowerCase(),
        aadhaar_number: aadhaar_number || null,
        age: age || null,
        gender: gender || null,
        state: state || null,
        address: address || null
      });
    });
  });
}

export function loginUser({ email_or_phone, password }) {
  return new Promise((resolve, reject) => {
    if (!email_or_phone || !password) {
      return reject(new Error('Email/Phone and Password are required.'));
    }

    const database = getDb();
    const query = `SELECT * FROM users WHERE email_or_phone = ?`;

    database.get(query, [email_or_phone.trim().toLowerCase()], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        return reject(new Error('Invalid email/phone or password.'));
      }

      // Verify bcrypt password hash
      const isMatch = bcrypt.compareSync(password, row.password_hash);
      if (!isMatch) {
        return reject(new Error('Invalid email/phone or password.'));
      }

      // Return user info (NO password returned)
      resolve({
        id: row.id,
        name: row.name,
        email_or_phone: row.email_or_phone,
        aadhaar_number: row.aadhaar_number,
        age: row.age,
        gender: row.gender,
        state: row.state,
        address: row.address
      });
    });
  });
}

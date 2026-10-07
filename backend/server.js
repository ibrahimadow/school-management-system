require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to MySQL database:', process.env.DB_NAME);
});

app.get('/', (req, res) => {
  res.send('ADOW School backend is running');
});

// ---------- STUDENTS ----------
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ---------- ATTENDANCE ----------
app.post('/api/attendance', (req, res) => {
  const { student_id, date, status } = req.body;
  if (!student_id || !date || !status) {
    return res.status(400).json({ error: 'student_id, date, and status are required' });
  }
  db.query(
    'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
    [student_id, date, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, student_id, date, status });
    }
  );
});

app.get('/api/attendance', (req, res) => {
  const sql = `
    SELECT attendance.id, attendance.date, attendance.status, students.name, students.id AS student_id
    FROM attendance
    JOIN students ON attendance.student_id = students.id
    ORDER BY attendance.date DESC, attendance.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ---------- FEE PAYMENTS ----------
app.post('/api/fee-payments', (req, res) => {
  const { student_id, amount } = req.body;
  if (!student_id || !amount) {
    return res.status(400).json({ error: 'student_id and amount are required' });
  }

  const receiptNo = 'RCT-' + Math.floor(1000 + Math.random() * 9000);

  db.query(
    'INSERT INTO fee_payments (student_id, amount, receipt_no) VALUES (?, ?, ?)',
    [student_id, amount, receiptNo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        'UPDATE students SET fee_balance = fee_balance - ? WHERE id = ?',
        [amount, student_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          db.query('SELECT * FROM students WHERE id = ?', [student_id], (err3, rows) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res.json({
              id: result.insertId,
              receipt_no: receiptNo,
              student_id,
              amount,
              new_balance: rows[0].fee_balance,
            });
          });
        }
      );
    }
  );
});

app.get('/api/fee-payments/:studentId', (req, res) => {
  db.query(
    'SELECT * FROM fee_payments WHERE student_id = ? ORDER BY paid_on DESC',
    [req.params.studentId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ---------- GRADES ----------
app.post('/api/grades', (req, res) => {
  const { student_id, subjects } = req.body; // subjects = [{ subject, score }, ...]
  if (!student_id || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ error: 'student_id and subjects[] are required' });
  }

  const values = subjects.map(s => [student_id, s.subject, s.score]);

  db.query(
    'INSERT INTO grades (student_id, subject, score) VALUES ?',
    [values],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ inserted: result.affectedRows });
    }
  );
});

app.get('/api/grades/:studentId', (req, res) => {
  db.query(
    'SELECT * FROM grades WHERE student_id = ? ORDER BY recorded_on DESC',
    [req.params.studentId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// routes/data.js
require('dotenv').config();
const express = require('express');
const mysql   = require('mysql2/promise');

const router = express.Router();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     parseInt(process.env.DB_PORT, 10) || 3306,
  charset:  'utf8mb4'
});

router.get('/:txid', async (req, res) => {
  const { txid } = req.params;
  try {
    const [[row]] = await pool.query(
      'SELECT data FROM light_model_data WHERE tx_id = ? LIMIT 1',
      [txid]
    );
    if (!row) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.json({ data: row.data });
  } catch (err) {
    console.error('❌ Error al recuperar data:', err.message);
    res.status(500).json({ error: 'Error al recuperar data' });
  }
});

module.exports = router;

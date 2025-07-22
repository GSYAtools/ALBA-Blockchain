require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const path       = require('path');
const mysql      = require('mysql2/promise');

const guardarRouter = require('./routes/guardar');
const leerRouter   = require('./routes/leer');
const metricsRouter = require('./routes/metrics');

const app  = express();
const PORT = process.env.PORT || 3460;

app.use(bodyParser.json());
app.use('/guardar-json', guardarRouter);
app.use('/leer-json',   leerRouter);
app.use('/metrics',     metricsRouter);

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     parseInt(process.env.DB_PORT,10) || 3306,
  charset:  'utf8mb4'
});

app.get('/registros', async (req, res) => {
  try {
    const [lightRows] = await pool.query(
      `SELECT id, data, timestamp, start_tx_ns, end_tx_ns, tx_id
         FROM light_model_data
        ORDER BY timestamp DESC`
    );
    const [heavyRows] = await pool.query(
      `SELECT id, timestamp, start_tx_ns, end_tx_ns, tx_id
         FROM heavy_model_data
        ORDER BY timestamp DESC`
    );
    res.json({
      light: lightRows.map(r => ({ ...r, tipo: 'light' })),
      heavy: heavyRows.map(r => ({ ...r, tipo: 'heavy' }))
    });
  } catch (e) {
    console.error('❌ Error al obtener registros:', e);
    res.status(500).json({ error: 'Error interno al obtener registros' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});

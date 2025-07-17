require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const guardarRouter = require('./routes/guardar');
const leerRouter = require('./routes/leer');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 42300;

// Middlewares
app.use(bodyParser.json());

// Rutas principales
app.use('/guardar-json', guardarRouter);
app.use('/leer-json', leerRouter);

// Conexión a MySQL para registros
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  charset: 'utf8mb4'
};
const pool = mysql.createPool(dbConfig);

// Ruta para obtener registros desde la base de datos
app.get('/registros', async (req, res) => {
  try {
    const [lightRows] = await pool.query(
      'SELECT id, data, timestamp, tx_id FROM light_model_data ORDER BY timestamp DESC'
    );
    const [heavyRows] = await pool.query(
      'SELECT id, NULL AS data, timestamp, tx_id FROM heavy_model_data ORDER BY timestamp DESC'
    );

    // Marcar tipo en cada registro
    const light = lightRows.map(r => ({ ...r, tipo: 'light' }));
    const heavy = heavyRows.map(r => ({ ...r, tipo: 'heavy' }));

    res.json({ light, heavy });
  } catch (error) {
    console.error('❌ Error al obtener registros:', error);
    res.status(500).json({ error: 'Error interno al obtener registros' });
  }
});

// Servir assets estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});

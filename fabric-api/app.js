const express = require('express');
const bodyParser = require('body-parser');
const guardarRouter = require('./routes/guardar');
const leerRouter = require('./routes/leer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 42300;

app.use(bodyParser.json());
app.use('/guardar-json', guardarRouter);
app.use('/leer-json', leerRouter);

app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/registros', (req, res) => {
  const fs = require('fs');
  const logPath = path.join(__dirname, 'tx-registros.json');
  if (!fs.existsSync(logPath)) return res.json([]);
  const contenido = fs.readFileSync(logPath, 'utf8').trim();
  const registros = contenido ? JSON.parse(contenido) : [];
  res.json(registros);
});

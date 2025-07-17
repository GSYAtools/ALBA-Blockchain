require('dotenv').config();
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

const guardarJson = async (req, res) => {
  let db;
  let gateway;
  try {
    const { data, descripcion } = req.body;
    if (!data || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos (data, descripcion)' });
    }

    // Configuración de BD
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      charset: 'utf8mb4'
    };
    db = await mysql.createConnection(dbConfig);

    // Carga de perfil y wallet
    const ccp = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', process.env.CCP_PATH), 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(path.resolve(__dirname, '..', process.env.WALLET_PATH));
    const identity = await wallet.get(process.env.IDENTITY);
    if (!identity) {
      return res.status(500).json({ error: 'Identidad no encontrada en wallet' });
    }

    // Conexión Gateway
    gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: process.env.IDENTITY,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Preparar payloads
    const jsonString = JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(jsonString).digest('hex');

    // Petición LIGHT
    const channelLight   = process.env.LIGHT_CHANNEL;
    const channelHeavy   = process.env.HEAVY_CHANNEL;
    const chaincodeName  = process.env.CHAINCODE_NAME;

    // Enviar a lightchannel
    const networkLight  = await gateway.getNetwork(channelLight);
    const contractLight = networkLight.getContract(chaincodeName);
    const txLight       = contractLight.createTransaction('StoreData');
    await txLight.submit('light', hash);
    const txidLight     = txLight.getTransactionId();

    // Enviar a heavychannel
    const networkHeavy  = await gateway.getNetwork(channelHeavy);
    const contractHeavy = networkHeavy.getContract(chaincodeName);
    const txHeavy       = contractHeavy.createTransaction('StoreData');
    await txHeavy.submit('heavy', jsonString);
    const txidHeavy     = txHeavy.getTransactionId();

    // Persistencia en MySQL
    const now = new Date();
    // light_model_data: almacena JSON, timestamp, tx_id
    await db.execute(
      'INSERT INTO light_model_data (data, timestamp, tx_id) VALUES (?, ?, ?)',
      [jsonString, now, txidLight]
    );
    // heavy_model_data: almacena tx_id, timestamp
    await db.execute(
      'INSERT INTO heavy_model_data (tx_id, timestamp) VALUES (?, ?)',
      [txidHeavy, now]
    );

    // Desconexión
    await gateway.disconnect();
    await db.end();

    res.json({
      message: 'JSON procesado en light y heavy channels y BD',
      txidLight,
      txidHeavy
    });

  } catch (error) {
    console.error('❌ Error completo:', error);
    if (gateway) {
      try { await gateway.disconnect(); } catch(_) {}
    }
    if (db) {
      try { await db.end(); } catch(_) {}
    }
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

module.exports = { guardarJson };

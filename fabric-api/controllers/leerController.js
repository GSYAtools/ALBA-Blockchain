require('dotenv').config();
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs-extra');

const leerJson = async (req, res) => {
  let gateway;
  try {
    const { tipo, txid } = req.params;
    if (!tipo || !txid) {
      return res.status(400).json({ error: 'Faltan parámetros en la URL: tipo y txid' });
    }
    if (!['light', 'heavy'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido (debe ser "light" o "heavy")' });
    }

    // Carga de perfil de red y wallet
    const ccpPath = path.resolve(__dirname, '..', process.env.CCP_PATH);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const walletPath = path.resolve(__dirname, '..', process.env.WALLET_PATH);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get(process.env.IDENTITY);
    if (!identity) {
      return res.status(500).json({ error: 'Identidad no encontrada en wallet' });
    }

    // Conectar al gateway
    gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: process.env.IDENTITY,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Selección de canal y contrato según tipo
    const channel = tipo === 'light'
      ? process.env.LIGHT_CHANNEL
      : process.env.HEAVY_CHANNEL;
    const contractName = process.env.CHAINCODE_NAME;
    const network = await gateway.getNetwork(channel);
    const contract = network.getContract(contractName);

    // Evaluar transacción de lectura
    const resultBuffer = await contract.evaluateTransaction('GetDataByTxID', tipo, txid);
    const record = JSON.parse(resultBuffer.toString());

    // Desconexión
    await gateway.disconnect();

    // Devolver el registro completo
    res.json(record);
  } catch (error) {
    console.error('❌ Error al leer JSON:', error);
    if (gateway) {
      try { await gateway.disconnect(); } catch(_) {}
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = { leerJson };

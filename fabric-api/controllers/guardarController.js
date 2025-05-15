const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs-extra');

const guardarJson = async (req, res) => {
  try {
    const { data, descripcion } = req.body;
    if (!data || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // 1. Cargar conexión
    const ccpPath = path.resolve(__dirname, '..', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // 2. Cargar wallet
    const walletPath = path.join(__dirname, '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('Admin@org1.example.com');
    if (!identity) {
      return res.status(500).json({ error: 'Identidad no encontrada en wallet' });
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'Admin@org1.example.com',
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('jsonstore');

    const jsonString = JSON.stringify(data);
    const tx = contract.createTransaction('StoreData');
    await tx.submit(jsonString);

    const txid = tx.getTransactionId();

    // Registrar metadata en archivo local
    const logPath = path.join(__dirname, '..', 'tx-registros.json');
    let registros = [];

    if (fs.existsSync(logPath)) {
      registros = JSON.parse(fs.readFileSync(logPath));
    }

    registros.push({
      txid,
      descripcion,
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(logPath, JSON.stringify(registros, null, 2));

    await gateway.disconnect();

    res.json({ message: 'JSON guardado en Fabric', txid });
  } catch (error) {
    console.error('❌ Error completo:', error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
  
};

module.exports = { guardarJson };

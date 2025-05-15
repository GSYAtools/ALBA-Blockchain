const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs-extra');

const leerJson = async (req, res) => {
  try {
    const { txid } = req.params;

    if (!txid) {
      return res.status(400).json({ error: 'Falta el txid en la URL' });
    }

    const ccpPath = path.resolve(__dirname, '..', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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

    const result = await contract.evaluateTransaction('GetDataByTxID', txid);
    const jsonData = JSON.parse(result.toString());

    await gateway.disconnect();

    res.json(jsonData);
  } catch (error) {
    console.error('Error al leer JSON:', error);
    res.status(500).json({ error: 'Error interno al leer JSON' });
  }
};

module.exports = { leerJson };

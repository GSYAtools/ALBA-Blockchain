import { Web3 } from 'web3';

// Configura la conexión a tu nodo Ethereum
// Cambia la URL según tu configuración (local o remota)
const web3 = new Web3('http://172.18.0.2:8545');

// Función para verificar la conexión
async function checkConnection() {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Conexión exitosa. Último bloque:', blockNumber);
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

// Función para obtener el balance de una dirección
async function getBalance(address) {
  try {
    const balance = await web3.eth.getBalance(address);
    console.log('Balance de', address, ':', web3.utils.fromWei(balance, 'ether'), 'ETH');
  } catch (error) {
    console.error('Error al obtener el balance:', error);
  }
}

// Función principal para ejecutar las pruebas
async function main() {
  await checkConnection();
  
  // Ejemplo de dirección Ethereum (válida en el sistema de pruebas)
  const testAddress = '0x7d9f4d000dccA3B2CC3c77049A7AA1a2Ce6ceCfC';
  await getBalance(testAddress);
}

// Ejecutar la función principal
main().catch(console.error);

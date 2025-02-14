# Creación del proyecto hardhat

```bash
mkdir ethereum-project && cd ethereum-project
npx hardhat
```
## Instrucciones para configurar el proyecto Hardhat
1. Configura Hardhat para trabajar con tu red privada. Edita el archivo `hardhat.config.js`:
```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    privateNetwork: {
      url: "http://127.0.0.1:8545",
      chainId: 15
    }
  }
};
```
2. Crea tu primer contrato inteligente en Solidity dentro del directorio contracts/.
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
```
3. Compila tu contrato:

```bash
npx hardhat compile
```
4. Despliega tu contrato en la red privada:

```bash
npx hardhat run scripts/deploy.js --network privateNetwork
```
5. Comienza a interactuar con tu contrato usando scripts de Hardhat o desarrollando una interfaz de usuario.

script/deploy.js
```javascript
async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying SimpleStorage...");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.deployed();
  console.log("SimpleStorage deployed to:", simpleStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
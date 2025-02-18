## Instalación de herramientas para el proyecto Ethereum privado

### 1. Instalar Docker y Docker Compose
Docker nos permitirá crear y gestionar contenedores para nuestro nodo Ethereum y otras herramientas.

```
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```
### 2. Instalar Node.js y npm

Necesarios para Hardhat y otras herramientas de desarrollo.
```
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### 3. Instalar Go-Ethereum (Geth)

Geth será nuestro cliente Ethereum principal.

Para Ubuntu:
```
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

Para Debian:
```
echo "deb http://ppa.launchpad.net/ethereum/ethereum/ubuntu bionic main" | sudo tee /etc/apt/sources.list.d/ethereum-bionic.list
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 2A518C819BE37D2C2031944D1C52189C923F6CA9

sudo apt-get update
sudo apt-get install ethereum
```
### 4. Instalar Hardhat

Hardhat será nuestro entorno de desarrollo para contratos inteligentes.
```
mkdir ethereum-project && cd ethereum-project
npm init -y
npm install --save-dev hardhat
```
### 5. Configurar Hardhat

Inicializa un proyecto Hardhat:
```
npx hardhat
```
Sigue las instrucciones para crear un proyecto básico.

### 6. Instalar dependencias adicionales
```
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```
### 7. Instalar Remix IDE (opcional)

Remix IDE es útil para desarrollo rápido y pruebas de contratos.
```
npm install -g @remix-project/remixd
```
### 8. Configurar herramientas de monitoreo

Para Ethereum Explorer:
```
git clone https://github.com/etherparty/explorer
cd explorer
npm install
```
Para Ethereum Network Intelligence API:
```
git clone https://github.com/cubedro/eth-net-intelligence-api
cd eth-net-intelligence-api
npm install
npm install -g pm2
```
### 9. Instalar Web3.js o Ethers.js

Elige una de estas bibliotecas para interactuar con la blockchain:
```
npm install web3
# o
npm install ethers
```

El siguiente paso sería configurar tu nodo Ethereum y comenzar a desarrollar contratos inteligentes y aplicaciones.
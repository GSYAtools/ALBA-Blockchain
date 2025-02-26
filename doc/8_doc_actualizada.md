# Documentación: Creación de una Blockchain Privada Ethereum PoS con Lighthouse (Instalación Nativa)

Esta documentación detalla los pasos necesarios para configurar una blockchain privada Ethereum utilizando el mecanismo de consenso Proof-of-Stake (PoS). Se utilizará Geth como cliente de ejecución y Lighthouse como cliente de consenso (Beacon Chain), con una instalación nativa sin contenedores Docker.

## 1. Instalación de Herramientas

### 1.1. Node.js y npm

Necesarios para Hardhat y otras herramientas de desarrollo.

```bash
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.2. Go-Ethereum (Geth)

Geth será nuestro cliente Ethereum principal.

Para Ubuntu:

```bash
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

Para Debian:

```bash
echo "deb http://ppa.launchpad.net/ethereum/ethereum/ubuntu bionic main" | sudo tee /etc/apt/sources.list.d/ethereum-bionic.list
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 2A518C819BE37D2C2031944D1C52189C923F6CA9
sudo apt-get update
sudo apt-get install ethereum
```

### 1.3. Hardhat

Hardhat es un entorno de desarrollo para contratos inteligentes.

```bash
mkdir ethereum-project && cd ethereum-project
npm init -y
npm install --save-dev hardhat
```

### 1.4. Configuración de Hardhat

Inicializa un proyecto Hardhat:

```bash
npx hardhat
```

Sigue las instrucciones para crear un proyecto básico.

### 1.5. Dependencias Adicionales de Hardhat

```bash
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

### 1.6. Remix IDE (Opcional)

Remix IDE es útil para desarrollo rápido y pruebas de contratos.

```bash
npm install -g @remix-project/remixd
```

### 1.7. Web3.js o Ethers.js

Elige una de estas bibliotecas para interactuar con la blockchain:

```bash
npm install web3
# o
npm install ethers
```

## 2. Configuración de Nodos Validadores

### 2.1. Creación de Carpetas y Cuentas para los Nodos

```bash
# Crear carpetas para los nodos:
mkdir node1 node2 node3

# Crear carpetas para clef:
mkdir node1/clef node2/clef node3/clef

# Crear cuentas para los diferentes nodos:
geth account new --datadir node1
geth account new --datadir node2
geth account new --datadir node3
```

### 2.2. Modificar el Archivo `genesis.json`

Modifica el archivo `genesis.json` con las direcciones de las cuentas creadas para preasignarles fondos. Asegúrate de configurar correctamente los parámetros de consenso PoS, como `chainId` y `clique`.

Ejemplo de `genesis.json`:

```json
{
  "config": {
    "terminalTotalDifficulty": 0,
    "terminalTotalDifficultyPassed": true,
    "chainId": 15,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "ethash": {},
    "clique": {
      "period": 5,
      "epoch": 30000
    },
    "difficulty": "1",
    "gasLimit": "8000000",
    "alloc": {
      "0x22d3578501dfab7fe694cEB6D2620F7F2b4e45b7": { "balance": "1000000000000000000000" },
      "0x3808C99037D358Aca5808f5B7f410c2A4101fc7e": { "balance": "1000000000000000000000" },
      "0xa94773F6A19baBc4e12E5AF05C37038004ce195B": { "balance": "1000000000000000000000" }
    },
    "extradata": "0x000000000000000000000000000000000000000000000000000000000000000022d3578501dfab7fe694cEB6D2620F7F2b4e45b73808C99037D358Aca5808f5B7f410c2A4101fc7ea94773F6A19baBc4e12E5AF05C37038004ce195B000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
  }
}
```

*   `chainId`: Identificador de la red.
*   `alloc`: Asignación inicial de Ether a las cuentas.
*   `extradata`: Debe contener las direcciones de los validadores (20 bytes cada una, rellenadas con ceros hasta 32 bytes).

### 2.3. Inicialización de los Nodos

```bash
geth init --datadir node1 genesis.json
geth init --datadir node2 genesis.json
geth init --datadir node3 genesis.json
```

### 2.4. Creación y Configuración de Clef

En versiones recientes de Geth, Clef se utiliza para la gestión de cuentas y la firma de transacciones.

```bash
# Inicializar el firmante (clef):
clef init
```

Para coordinar Clef y Geth, inícialos dentro del mismo keystore.

```bash
# Iniciar Clef:
clef --configdir ./node1/clef --keystore=./node1/keystore --chainid=15

# Iniciar Geth:
geth --datadir ./node1 --networkid 15 --http --http.addr '0.0.0.0' --http.port 8545 --http.corsdomain "*" --http.api eth,net,web3,admin --signer=./node1/clef/clef.ipc --keystore ./node1/keystore/
```

Crea nuevas cuentas desde Clef:

```bash
# Nueva cuenta
clef newaccount

# Listar cuentas
clef list-accounts
```

### 2.5. Lanzar los Nodos Geth con Clef

```bash
## Nodo 1
clef --keystore node1/keystore --chainid 15 --http --http.addr localhost --http.port 8550

geth --datadir node1 --port 30303 --authrpc.port 8551 --http --http.port 8545 --http.api eth,net,engine,admin --networkid 15 --signer http://localhost:8550
```

Repite el proceso para los nodos 2 y 3, ajustando los puertos y las rutas según sea necesario.

## 3. Creación de una Bootnode

La bootnode facilita el descubrimiento de nodos en la red.

```bash
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install bootnode
```

```bash
# Crear la bootnode
bootnode -genkey boot.key

# Inicializar la bootnode
bootnode -nodekey boot.key -addr :30301
```

Añade el enode de la bootnode a cada nodo Geth al iniciar:

```bash
--bootnodes enode://@:30301
```

Ejemplo:

```bash
--bootnodes enode://57ccc7c63113b250416eceea099ce25adbca05aaa273e1509e04fed9db91451d264da1c1af831932ee346072324fb1bdbe52119fb8ea74506db10b9d9daaad76@127.0.0.1:30301
```

## 4. Configuración del Cliente de Consenso (Lighthouse)

Para coordinar Geth y Lighthouse y habilitar el consenso PoS, sigue estos pasos:

### 4.1. Instalación de Lighthouse

Sigue estas instrucciones para instalar Lighthouse:

1.  **Descarga Lighthouse:**

    *   Ve a la página de lanzamientos de Lighthouse en GitHub: [https://github.com/sigp/lighthouse/releases](https://github.com/sigp/lighthouse/releases)
    *   Descarga el archivo binario precompilado correspondiente a tu sistema operativo y arquitectura (por ejemplo, `lighthouse-vX.X.X-x86_64-linux.tar.gz`).

2.  **Extrae el archivo:**

    ```bash
    tar -xvzf lighthouse-vX.X.X-x86_64-linux.tar.gz
    ```

3.  **Mueve el ejecutable a un directorio en tu PATH (opcional pero recomendado):**

    ```bash
    sudo mv lighthouse /usr/local/bin
    ```

4.  **Verifica la instalación:**

    ```bash
    lighthouse --version
    ```

    Esto debería mostrar la versión de Lighthouse instalada.

### 4.2. Generación del JWT Secret

El JWT Secret se utiliza para autenticar las comunicaciones entre Geth (el cliente de ejecución) y Lighthouse (el cliente de consenso). Genera un secreto y asegúrate de que sea idéntico tanto para Geth como para Lighthouse.

```bash
openssl rand -hex 32 | tr -d '\n' > jwtsecret.txt
```

Asegúrate de que este archivo sea accesible tanto para Geth como para Lighthouse. En los ejemplos, se asume que está ubicado en `/home/gsya-eugenio/ethereum/private-ethereum/node1/geth/jwtsecret`.

### 4.3. Configuración y Ejecución de Lighthouse

1.  **Archivo Génesis:** Asegúrate de tener el archivo de estado génesis PoS correcto para tu red privada (`genesis.json` o `genesis.ssz`).

2.  **Ejecuta el cliente Beacon Chain (Lighthouse):**

    ```bash
    lighthouse beacon --network custom --genesis-file genesis.json --execution-endpoint=http://localhost:8551 --jwt-secret=/home/gsya-eugenio/ethereum/private-ethereum/node1/geth/jwtsecret --listen-address 0.0.0.0
    ```

    *   `--network custom`: Indica que estás utilizando una red personalizada (no Mainnet, Goerli, etc.).
    *   `--genesis-file`: Ruta a tu archivo genesis.json. (Asegúrate de que el archivo sea compatible con Lighthouse, podría requerir un formato SSZ).
    *   `--execution-endpoint`: Apunta al puerto `authrpc` de Geth (generalmente 8551).
    *   `--jwt-secret`: Ruta al mismo archivo JWT secret que usas en Geth.
    *   `--listen-address 0.0.0.0`: Permite conexiones desde cualquier dirección IP (útil si tienes nodos en diferentes máquinas).

3.  **Ejecuta el cliente Validator (Lighthouse):**

    ```bash
    lighthouse validator --network custom --beacon-node-url http://localhost:5052 --jwt-secret=/home/gsya-eugenio/ethereum/private-ethereum/node1/geth/jwtsecret
    ```

    *   `--beacon-node-url`: Apunta a la dirección donde el cliente Beacon Chain está escuchando (por defecto, `http://localhost:5052`).
    *   `--jwt-secret`: Ruta al mismo archivo JWT secret que usas en Geth y en el cliente Beacon Chain.

4.  **Importa tus claves de validador:**

    Para que el cliente Validator participe en el consenso, necesitarás importar tus claves de validador. El proceso exacto dependerá de cómo hayas generado tus claves. Lighthouse proporciona herramientas para importar claves desde diferentes formatos.

### 4.4. Configuración de Geth para PoS

Al lanzar Geth, asegúrate de incluir los siguientes parámetros:

*   `--authrpc.port`: Puerto para la autenticación del Engine API (debe coincidir con `--execution-endpoint` en Lighthouse).
*   `--authrpc.vhosts`: Vhosts para la autenticación del Engine API.
*   `--authrpc.jwtsecret`: Ruta al archivo JWT secret.
*   `--engine.endpoint`: URL del Engine API del cliente Beacon (Lighthouse).

Ejemplo:

```bash
geth --datadir node1 \
--port 30303 \
--http \
--http.port 8545 \
--http.api eth,net,engine,admin,web3 \
--networkid 15 \
--signer http://localhost:8550 \
--bootnodes enode://57ccc7c63113b250416eceea099ce25adbca05aaa273e1509e04fed9db91451d264da1c1af831932ee346072324fb1bdbe52119fb8ea74506db10b9d9daaad76@127.0.0.1:0?discport=30301 \
--syncmode full \
--authrpc.port 8551 \
--authrpc.vhosts localhost \
--authrpc.jwtsecret /home/gsya-eugenio/ethereum/private-ethereum/node1/geth/jwtsecret \
--engine.endpoint http://localhost:8552
```

*Nota*: Asegúrate de ajustar la dirección del bootnode a tu configuración actual.

### 4.5. Verificación de la Conexión

Supervisa los logs de Geth y Lighthouse para confirmar que se están comunicando correctamente. Busca mensajes relacionados con la conexión JWT y la sincronización de la Beacon Chain. Deberías ver mensajes que indiquen que la conexión Engine API se ha establecido.

### 4.6. Staking

Para convertirte en un validador, deberás hacer staking de ETH. El proceso exacto dependerá de tu red PoS privada y de la configuración de Lighthouse. Consulta la documentación de Lighthouse para obtener más detalles.

**Puntos importantes:**

*   **Firewall:** Asegúrate de que tu firewall permita el tráfico en los puertos utilizados por Lighthouse (por defecto, 9000 para P2P y 5052 para la API).
*   **Documentación:** Consulta la documentación oficial de Lighthouse para obtener información más detallada y opciones de configuración: [https://lighthouse-book.sigp.io/](https://lighthouse-book.sigp.io/)
*   **Archivo Genesis:** Verifica el formato requerido por Lighthouse. Si necesitas un archivo `genesis.ssz`, es posible que debas convertir tu archivo `genesis.json`.

## 5. Herramientas de Monitorización (Opcional)

### 5.1. Ethereum Explorer

```bash
git clone https://github.com/etherparty/explorer
cd explorer
npm install
```

### 5.2. Ethereum Network Intelligence API

```bash
git clone https://github.com/cubedro/eth-net-intelligence-api
cd eth-net-intelligence-api
npm install
npm install -g pm2
```
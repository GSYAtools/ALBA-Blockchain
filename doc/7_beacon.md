Lanzar los nodos Geth:
--miner.etherbase eliminado: Esta opción está deprecada en PoS.

--authrpc.port 8551 y --authrpc.vhosts localhost añadidos: Configuran el puerto y los vhosts para la autenticación del Engine API.

--authrpc.jwtsecret /path/to/jwtsecret añadido: Especifica la ruta al archivo JWT secret, que se usa para autenticar las comunicaciones entre Geth (el cliente de ejecución) y el cliente Beacon (el cliente de consenso). Debes generar este archivo y compartirlo entre Geth y el cliente Beacon.

--engine.endpoint http://localhost:8552 añadido: Este es crucial. Especifica la URL del Engine API del cliente Beacon. Reemplaza 8552 con el puerto correcto en el que tu cliente Beacon está escuchando.
```sh
geth --datadir node1 \
     --port 30303 \
     --http \
     --http.port 8545 \
     --http.api eth,net,engine,admin,web3 \
     --networkid 15 \
     --signer http://localhost:8550 \
     --bootnodes enode://57ccc7c63113b250416eceea099ce25adbca05aaa273e1509e04fed9db91451d264da1c1af831932ee346072324fb1bdbe52119fb8ea74506db10b9d9daaad76@127.0.0.1:30301?discport=30301 \
     --syncmode full \
     --authrpc.port 8551 \
     --authrpc.vhosts localhost \
     --authrpc.jwtsecret /home/gsya-eugenio/ethereum/private-ethereum/node1/geth/jwtsecret \
     --engine.endpoint http://localhost:8552
```

Crear el beacon:
1. Generar el JWT Secret:
   1. `prysm validator --generate-jwt-secret /path/to/jwtsecret`
2. Configurar y ejecutar el cliente Beacon:
   1. `prysm beacon-chain --genesis-state=/path/to/genesis.ssz --jwt-secret=/path/to/jwtsecret --execution-endpoint=http://localhost:8551 --p2p-host-ip=0.0.0.0`
      1. --genesis-state: Ruta a tu archivo de estado génesis PoS.
      2. --jwt-secret: Ruta al mismo archivo JWT secret que usaste en Geth.
      3. --execution-endpoint: Apunta al puerto authrpc de Geth.
      4. --p2p-host-ip: La IP para la conexión P2P del cliente Beacon.
3. Verificar la conexión: Una vez que tanto Geth como el cliente Beacon estén en ejecución, observa los logs de ambos para confirmar que se están conectando y sincronizando correctamente. Deberías ver mensajes que indiquen que la conexión Engine API se ha establecido.
4. Staking: Para convertirte en un validador, deberás hacer staking de ETH. El proceso exacto dependerá de tu red PoS privada y de la configuración de tu cliente Beacon.

## Instalar Prysm
```sh
# Configurar el repositorio bazel
sudo apt update && sudo apt install apt-transport-https gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://bazel.build/bazel-release.pub.gpg | gpg --dearmor >/etc/apt/keyrings/bazel.gpg
echo "deb [signed-by=/etc/apt/keyrings/bazel.gpg] https://storage.googleapis.com/bazel-apt stable jdk1.8" | sudo tee /etc/apt/sources.list.d/bazel.list
sudo apt update && sudo apt install bazel
```

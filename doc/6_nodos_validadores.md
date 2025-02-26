# Nodos validadores para transacciones
Debido a la nueva estructura PoS no existe la minería tradicional, si no, mediante validación:

```bash
# Crear carpetas para los nodos:
mkdir node1 node2 node3

# Crear carpetas para clef:
mkdir node1/clef node2/clef node3/clef

# Crear cuentas para los diferentes nodos:
geth account new --datadir node1
geth account new --datadir node2
geth account new --datadir node3

## Modificar el fichero genesis.json con las nuevas cuentas:

# Inicializar el firmante (clef):
clef init

# Inicializar los nodos:
geth init --datadir node1 genesis.json
geth init --datadir node2 genesis.json
geth init --datadir node3 genesis.json

# Lanzar los firmantes y los nodos geth
## Nodo 1
clef --keystore node1/keystore --chainid 15 --http --http.addr localhost --http.port 8550

geth --datadir node1 --port 30303 --authrpc.port 8551 --http --http.port 8545 --http.api eth,net,engine,admin --networkid 15 --miner.etherbase 0x22d3578501dfab7fe694cEB6D2620F7F2b4e45b7 --signer http://localhost:8550

## Nodo 2
clef --keystore node2/keystore --chainid 15 --http --http.addr localhost --http.port 8552

geth --datadir node2 --port 30304 --authrpc.port 8553 --http --http.port 8546 --http.api eth,net,engine,admin --networkid 15 --miner.etherbase 0x3808C99037D358Aca5808f5B7f410c2A4101fc7e --signer http://localhost:8552

## Nodo 3
clef --keystore node3/keystore --chainid 15 --http --http.addr localhost --http.port 8554

geth --datadir node3 --port 30305 --authrpc.port 8555 --http --http.port 8547 --http.api eth,net,engine,admin --networkid 15 --miner.etherbase 0xa94773F6A19baBc4e12E5AF05C37038004ce195B --signer http://localhost:8554

```
## Crear una bootnode

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
Añadir el enode a cada nodo

```bash
# Añadir el parametro --bootnodes a la hora de lanzar geth:
--bootnodes enode://<enode-id-del-bootnode>@<ip-bootnode>:30301

# En el caso que nos ocupa:
--bootnodes enode://57ccc7c63113b250416eceea099ce25adbca05aaa273e1509e04fed9db91451d264da1c1af831932ee346072324fb1bdbe52119fb8ea74506db10b9d9daaad76@127.0.0.1:0?discport=30301
```

## Fichero genesis.json modificado con las cuentas creadas

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
        }
    },
    "difficulty": "1",
    "gasLimit": "8000000",
    "alloc": {
        "0x22d3578501dfab7fe694cEB6D2620F7F2b4e45b7": { "balance": "1000000000000000000000" },
        "0x3808C99037D358Aca5808f5B7f410c2A4101fc7e": { "balance": "1000000000000000000000" },
        "0xa94773F6A19baBc4e12E5AF05C37038004ce195B": { "balance": "1000000000000000000000" }
    },
    "extradata": "0x000000000000000000000000000000000000000000000000000000000000000022d3578501dfab7fe694cEB6D2620F7F2b4e45b73808C99037D358Aca5808f5B7f410c2A4101fc7ea94773F6A19baBc4e12E5AF05C37038004ce195B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
}
```
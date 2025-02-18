# Parámetros del archivo genesis.json

## config
Configuración general de la blockchain

### terminalTotalDifficulty y terminalTotalDifficultyPassed
- Valores: 0 y true (respectivamente)
- Configura el nodo para funcionar en una red Proof of Stake (PoS)

### chainId
- Valor: 15
- Descripción: Identificador único de la cadena. Protege contra ataques de repetición.

### homesteadBlock
- Valor: 0
- Descripción: Activa las características de Homestead desde el bloque 0. Homestead es el segundo lanzamiento importante de Ethereum.

### eip150Block, eip155Block, eip158Block
- Valor: 0
- Descripción: Activan diferentes Propuestas de Mejora de Ethereum (EIP) desde el bloque 0.

### byzantiumBlock, constantinopleBlock, petersburgBlock, istanbulBlock, berlinBlock
- Valor: 0
- Descripción: Activan las características de diferentes actualizaciones de Ethereum desde el bloque 0.

## alloc
- Valor: {}
- Descripción: Asignación inicial de ether a cuentas específicas. Vacío en este caso.

## coinbase
- Valor: "0x0000000000000000000000000000000000000000"
- Descripción: Dirección que recibirá las recompensas de minería.

## difficulty
- Valor: "0x20000"
- Descripción: Dificultad inicial de minería.

## extraData
- Valor: ""
- Descripción: Datos adicionales en el bloque génesis (opcional).

## gasLimit
- Valor: "0x2fefd8"
- Descripción: Límite de gas inicial por bloque.

## nonce
- Valor: "0x0000000000000042"
- Descripción: Nonce utilizado para generar el bloque génesis.

## mixhash
- Valor: "0x0000000000000000000000000000000000000000000000000000000000000000"
- Descripción: Combinado con el nonce para probar suficiente cómputo.

## parentHash
- Valor: "0x0000000000000000000000000000000000000000000000000000000000000000"
- Descripción: Hash del bloque padre (ceros para el bloque génesis).

## timestamp
- Valor: "0x00"
- Descripción: Marca de tiempo del bloque génesis.

# genesis.json
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
        "berlinBlock": 0
    },
    "alloc": {},
    "coinbase": "0x0000000000000000000000000000000000000000",
    "difficulty": "0x20000",
    "extraData": "",
    "gasLimit": "0x2fefd8",
    "nonce": "0x0000000000000042",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "0x00"
}
```

## Iniciar el nodo a partir de genesis.json
```bash
geth --datadir ./data init ./genesis.json
```

Posteriormente, iniciar el nodo con lo siguientes parámetros:
```bash
geth --datadir ./data --networkid 15 --http --http.addr '0.0.0.0' --http.port 8545 --http.corsdomain "*" --mine --miner.threads 1
```

1. `geth --datadir ./data init ./genesis.json`
    - Este comando inicializa la base de datos del nodo con la configuración especificada en el archivo genesis.json.
    - No inicia un nodo en ejecución, solo prepara el directorio de datos.
2. `geth --datadir ./data --networkid 15 --http --http.addr '0.0.0.0' --http.port 8545 --http.corsdomain "*" --mine --http.api eth,net,web3,admin`
    - Este comando inicia el nodo Ethereum con los parámetros especificados.
    - Utiliza el directorio de datos inicializado en el paso anterior.

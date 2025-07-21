# Proyecto ALBA: blockchain

Documentacion DeepWiki: [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/GSYAtools/ALBA-Blockchain)

## Instalación de red actualizada SmartBFT

### Descarga del instalador:

```bash
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
chmod +x install-fabric.sh
```

### Instalación de fabric (ver >= 3.0.0) con soporte BFT:

```bash
./install-fabric.sh --fabric-version 3.1.1 --ca-version 1.5.15 docker samples binary
```

### Comprobar binarios:

```bash
fabric-samples/bin/peer version
```

### Levantar la red por primera vez:

```bash
cd fabric-samples/test-network

# Iniciar red BFT con CA
./network.sh up -bft -ca

# Crear los canales (dos en este caso)
./network.sh createChannel -c lightchannel -bft
./network.sh createChannel -c heavymodel -bft
```

### Limpieza de la red

```bash
cd fabric-samples/test-network

# Apagar red completamente
./network.sh down

# Opcional pero recomendable: eliminar artefactos
docker volume prune -f
docker system prune -f
```

## Desplegar el chaincode

El chaincode debe estar en esta ruta, asegurarse:
```bash
fabric-samples/chaincode/jsonstore/go/jsonstore.go
```

Desde `fabric-samples/test-network` forzando la 'Endorsement-Policy' para que solo Org1 pueda aprobar las transacciones:
```bash
./network.sh deployCC \
  -ccn jsonstore \
  -ccp ../chaincode/jsonstore/go \
  -ccl go \
  -ccep "OR('Org1MSP.member')"
```

## Configurar variables de entorno antes de `invoke`

```bash
# Asegurar binarios y configs
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

# Org1 peer env
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

## Ejecutar `invoke` test

```bash
peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls \
  --cafile "$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
  -C mychannel \
  -n jsonstore \
  --waitForEvent \
  -c '{"function":"StoreData","Args":["{\"test_key_1\":\"test_value_1\",\"test_key_2\":test_value_2}"]}'
```

El resultado deberia ser algo como:
```text
txid [abc123...] committed with status (VALID)
```

## Ejecutar `query` para recuperar los datos
```bash
peer chaincode query \
  -C mychannel \
  -n jsonstore \
  -c '{"function":"GetDataByTxID","Args":["<txID>"]}'
```

## Revisión de errores
1. Comprobar que el commit del chaincode es correcto:
```bash
peer lifecycle chaincode querycommitted --channelID mychannel
```
Debe mostar algo como:
```text
Committed chaincode definitions on channel 'mychannel':
Name: jsonstore, Version: 1.0, Sequence: 1, Endorsement Plugin: escc, Validation Plugin: vscc
```

2. Verificar que Org1 ha aprobado:
```bash
peer lifecycle chaincode checkcommitreadiness \
  --channelID mychannel \
  --name jsonstore \
  --version 1.0 \
  --sequence 1 \
  --output json
```
La salida debe ser algo como:
```json
{
  "approvals": {
    "Org1MSP": true
  }
}
```

3. Comprobar chaincodes instalados:
```bash
peer lifecycle chaincode queryinstalled
```
Salida:
```text
Package ID: jsonstore_2:abcd123..., Label: jsonstore_2
```
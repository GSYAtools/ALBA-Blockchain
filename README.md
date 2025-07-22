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

Desde `fabric-samples/test-network`:
```bash
./network.sh deployCC \
  -ccn jsonstoragemodel \
  -ccp ~/GitHub/ALBA-Blockchain/chaincode/jsonstoragemodel/go \
  -ccl go \
  -c lightchannel \
  -ccep "OR('Org1MSP.member','Org2MSP.member')"

./network.sh deployCC \
  -ccn jsonstoragemodel \
  -ccp ~/GitHub/ALBA-Blockchain/chaincode/jsonstoragemodel/go \
  -ccl go \
  -c heavychannel \
  -ccep "OR('Org1MSP.member','Org2MSP.member')"
```

## Enviar peticion a través de la API

Con `curl`:
```bash
curl -X POST http://localhost:<PORT>/guardar-json \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": 123,
      "name": "Sensor A",
      "measurements": [12.5, 13.0, 12.8]
    },
    "descripcion": "Registro de lecturas del Sensor A"
  }'
```

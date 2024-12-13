### Guía de instalación de la red blockchain Ethereum utilizando Docker

## Instalación de Docker

Actualizar el sistema
```bash
sudo apt update && sudo apt upgrade -y
```

Instalar dependencias necesarias
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

Agregar la clave GPG de Docker
```bash
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
```

Agregar el repositorio de Docker
```bash
echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
```

Actualizar el índice de paquetes
```bash
sudo apt update
```

Instalar Docker CE
```bash
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

Verificar la instalación
```bash
sudo docker --version
```

Iniciar y habilitar el servicio
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

Probar la instalación
```bash
sudo docker run hello-world
```

Permitir la ejecución sin sudo
```bash
sudo usermod -aG docker $USER
```

## Instalación de Geth en Docker

Crear `docker-compose.yml`
```bash
mkdir ~/ethereum-private
cd ~/ethereum-private
nano docker-compose.yml
```

Crear una cuenta Ethereum principal para la red (solicitará una contraseña, no olvidarla)
```bash
docker run -it --rm -v $(pwd)/data:/root/.ethereum ethereum/client-go:stable account new
```

Contenido de `docker-compose.yml` (sustituir 0xYourNewEtherbaseAddress por la nueva direccion de la cuenta creada anteriormente)
```yml
services:
  geth:
    image: ethereum/client-go:stable
    container_name: alba_eth
    command: >
      geth --networkid 15
      --http --http.addr 0.0.0.0 --http.port 8545 --http.api "eth,web3,net,personal"
      --mine --miner.etherbase "0xYourNewEtherbaseAddress" --miner.gasprice 0
      --nodiscover --allow-insecure-unlock
      --ipcdisable
      --verbosity 3
    ports:
      - "8545:8545"
      - "30303:30303"
    volumes:
      - ./data:/root/.ethereum
```

Iniciar la red privada
```bash
docker compose up -d
```

Crear el archivo `genesis.json`
```bash
nano genesis.json
```

Contenido de `genesis.json`
```json
{
  "config": {
    "chainId": 15,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0
  },
  "difficulty": "0x400",
  "gasLimit": "0xffffffffffffffff",
  "alloc": {}
}
```

Inicializar la blockchain
```bash
docker compose run geth init /root/.ethereum/genesis.json
```

Comprobar que está en funcionamiento
```bash
docker ps
```

Crear una nueva cuenta en la blockchain (Reemplazar `<nombre_del_contenedor>` con el nombre obtenido al ejecutar)
```bash
docker exec -it <nombre_del_contenedor> geth account new
```


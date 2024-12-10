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

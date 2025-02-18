# Crear cuentas ethereum

A continuación crearemos una cuenta Ethereum y le asignaremos unos fondos iniciales:

## Creación de cuentas
Con el comando `geth account new --datadir ./data` nos crea una nueva cuenta tras solicitarnos la contraseña.

**IMPORTANTE**: guardar tanto la dirección pública como la privada en un fichero de texto.

Añadir la cuenta en `genesis.json` en el campo `alloc` con la dirección pública de la cuenta como clave y el diccionario `{"balance": "0x200000000000000000000"}`

## Asignar gas a la nueva cuenta
1. Hacer un backup del keystore: `cp -r ./data/keystore ./backup`
2. Eliminar la carpeta de datos de Geth: `rm -rf ./data/geth`
3. Reincializar la red: `geth --datadir ./data init genesis.json`
4. Restaurar la carpeta keystore: `cp -r ./backup/keystore ./data`
5. Inicializar el nodo Geth normalmente

## Probar a realizar una transacción para confirmar que la cuenta es accesible
1. Iniciar la consola Geth: `geth attach http://localhost:8545`
2. Crear la transacción:
   ```json
   var tx = {
        from: eth.accounts[0],
        to: "dirección_destino",
        value: web3.toWei(1, "ether"),
        gas: 21000,
        gasPrice: eth.gasPrice,
        nonce: eth.getTransactionCount(eth.accounts[0])
    }
   ```
3. Firmar la transacción con la cuenta origen:
   ```
   var signedTx = eth.signTransaction(tx, "direccion_privada_from")
   ```
4. Enviar la transacción firmada:
   ```
   eth.sendRawTransaction(signedTx.raw)
   ```
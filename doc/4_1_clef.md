# Clef
En la versión de Geth que estamos trabajando actualmente (1.15.1), el cliente Geth no se encarga de la gestión de cuentas y firma de transacciones (como si sucedía en versiones anteriores), para ello utilizamos Clef como gestor de cuentas y firmante de transacciones.

Clef viene instalado junto con la version actual de Geth.

## Coordinar Clef y Geth

Para que ambos componentes trabajen coordinados necesitamos iniciarlos dentro del mismo keystore, en el caso de Geth no es necesario indicar la ruta del keystore, pero lo haremos para declararlo explícitamente.

1. Iniciar Clef:
    ```sh
    clef --configdir ./clefdata --keystore=./data/keystore --chainid=15
    ```
2. Iniciar Geth:
    ```sh
    geth --datadir ./data --networkid 15 --http --http.addr '0.0.0.0' --http.port 8545 --http.corsdomain "*" --http.api eth,net,web3,admin --signer=./clefdata/clef.ipc --keystore ./data/keystore/
    ```

## Creación de cuentas desde Clef:
```sh
# Nueva cuenta
clef newaccount

# Listar cuentas
clef list-accounts
```
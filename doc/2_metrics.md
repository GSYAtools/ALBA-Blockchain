# Monitorización de una Red con go-ethereum y Prometheus
## 1. Habilitar Métricas en go-ethereum
Para monitorizar una red con go-ethereum usando Prometheus, primero debes habilitar las métricas al iniciar el nodo:

```bash
geth <otros comandos> --metrics --metrics.addr 127.0.0.1 --metrics.port 6060 --metrics.expensive
```
## 2. Configurar Prometheus
Crear el fichero de configuracion `prometheus.yml` que se incluirá en la carpeta prometheus-config/

```yaml
global:
  scrape_interval: 15s
  scrape_timeout: 10s
  evaluation_interval: 15s
alerting:
  alertmanagers:
    - static_configs:
        - targets: []
      scheme: http
      timeout: 10s
scrape_configs:
  - job_name: geth
    scrape_interval: 15s
    scrape_timeout: 10s
    metrics_path: /debug/metrics/prometheus
    scheme: http
    static_configs:
      - targets:
          - geth:6060
```

## 3. Consultas Útiles en Prometheus
Puedes realizar las siguientes consultas en Prometheus para monitorizar diversos aspectos de tu red go-ethereum:

Número de peers conectados:

```text
eth_peers
```
Uso de CPU:

```text
rate(process_cpu_seconds_total[1m])
```
Uso de memoria:

```text
go_memstats_alloc_bytes
```
Tiempo de sincronización del bloque más reciente:

```text
ethereum_blockchain_head_block_time
```
Número total de transacciones:

```text
ethereum_txpool_pending
```
## 4. Añadir Métricas a un Dashboard en Grafana
### Conectar Grafana a Prometheus

    Ve a "Configuration" > "Data Sources" en Grafana.
    Selecciona Prometheus o añádelo si aún no está configurado.
    Establece la URL de Prometheus (por ejemplo, http://localhost:9090).
    Haz clic en "Save & Test" para verificar la conexión.

Para obtener la IP del contenedor de prometheus:

    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nombre_contenedor_prometheus


### Crear un Nuevo Dashboard

    Haz clic en el ícono "+" en el menú lateral.
    Selecciona "Dashboard".

### Añadir un Nuevo Panel

    Haz clic en "Add panel".
    Selecciona "Add a new panel".

### Configurar el Panel con Métricas

En la pestaña "Metrics", usa el editor de consultas para agregar las métricas que deseas visualizar.
Algunas métricas útiles son:

```text
eth_peers
rate(process_cpu_seconds_total[1m])
go_memstats_alloc_bytes
ethereum_blockchain_head_block_time
ethereum_txpool_pending
```
Ajusta el tipo de visualización según tus preferencias.

### Organizar y Personalizar el Dashboard

    Arrastra y suelta los paneles para organizarlos.
    Ajusta los intervalos de tiempo y la actualización automática.
    Añade variables si necesitas filtrar por instancias específicas.

### Guardar el Dashboard

    Haz clic en el ícono de disco o "Save dashboard" en la parte superior.
    Dale un nombre descriptivo a tu dashboard.

### Importar un Dashboard Preconfigurado

    Ve a "Create" > "Import" en Grafana.
    Usa el ID 18463 para un dashboard de Go-Ethereum-By-Instance.
    Selecciona tu fuente de datos Prometheus.
    Haz clic en "Import".

## 5. Monitorear Transacciones
Puedes tener métricas específicas para monitorear las transacciones:
Métricas Relacionadas con Transacciones

Número de transacciones pendientes:

```text
ethereum_txpool_pending
```
Tasa de transacciones promovidas:

```text
rate(ethereum_txpool_promoted_total[5m])
```
Transacciones por segundo:

```text
rate(ethereum_chain_transaction_count_total[1m])
```
Tiempo de confirmación de transacciones:

```text
ethereum_txpool_lifecycle_seconds
```
### Añadir Métricas al Dashboard

    Crea un nuevo panel en tu dashboard.
    En la sección de consulta, selecciona Prometheus como fuente de datos.
    Ingresa una de las consultas mencionadas arriba.
    Ajusta el tipo de visualización según tus preferencias.

Con esta información, deberías poder configurar y monitorizar tu red go-ethereum utilizando Prometheus y Grafana eficazmente. Si necesitas más ayuda, no dudes en preguntar.

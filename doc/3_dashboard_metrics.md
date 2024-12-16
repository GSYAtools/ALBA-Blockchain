# Metricas implementadas en el Dashboard de Grafana

## Obtención y propagación de transacciones

* **eth_fetcher_transaction_waiting_peers**:
    * Indica el número de pares (peers) que están esperando para recibir transacciones.
    * Estos son nodos que han solicitado transacciones pero aún no las han recibido.
* **eth_fetcher_transaction_fetching_peers**:
    * Muestra el número de pares de los que el nodo está activamente obteniendo transacciones.
    * Representa los nodos con los que se está comunicando para obtener nuevas transacciones.
* **eth_fetcher_transaction_queueing_peers**:
    * Refleja el número de pares que están en cola para enviar transacciones.
    * Estos son nodos que tienen transacciones para compartir pero están esperando su turno para enviarlas.

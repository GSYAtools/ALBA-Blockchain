#!/bin/bash

API_URL="http://localhost:42300/guardar-json"

# Generador UUID
generate_uuid() {
  cat /proc/sys/kernel/random/uuid
}

# Generador ID de sensor aleatorio
generate_sensor_id() {
  echo "sensor-$(head /dev/urandom | tr -dc 'a-f0-9' | head -c 8)"
}

# Generador de datos hexadecimales aleatorios
generate_hex_field() {
  local size=$1
  echo "$(head /dev/urandom | tr -dc 'a-f0-9' | head -c $size)"
}

# Generar cuerpo JSON aleatorio
generate_random_json() {
  local field_count=$((RANDOM % 5 + 2)) # entre 2 y 6 campos
  local json="{\"id_sensor\":\"$(generate_sensor_id)\""

  for ((i=1; i<=field_count; i++)); do
    key="state_$i"
    size=$((RANDOM % 20 + 4))  # tamaño entre 4 y 24 caracteres
    value="$(generate_hex_field $size)"
    json="$json, \"$key\": \"$value\""
  done

  json="$json}"
  echo "$json"
}

# Bucle infinito con interrupción controlada
echo "🔁 Iniciando simulación de envío de datos. Presiona Ctrl+C para detener."

while true; do
  UUID=$(generate_uuid)
  DESCRIPCION="test-esfuerzo-$UUID"
  DATA=$(generate_random_json)

  echo "📤 Enviando: $DESCRIPCION"

  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"data\": $DATA, \"descripcion\": \"$DESCRIPCION\"}" \
    | jq .

  # Espera entre 10 y 15 segundos
  SLEEP_TIME=$((RANDOM % 6 + 10))
  sleep $SLEEP_TIME
done

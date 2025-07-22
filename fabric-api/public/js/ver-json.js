// public/js/ver-json.js
let jsonData = null;

function toggleModo() {
  const dark = document.body.classList.toggle('dark');
  localStorage.setItem('modoOscuro', dark ? '1' : '0');
}
function aplicarModoGuardado() {
  if (localStorage.getItem('modoOscuro') === '1') {
    document.body.classList.add('dark');
  }
}

async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function addMetricRow(name, value, unit) {
  const tbody = document.querySelector('#metricsTable tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${name}</td><td>${value}</td><td>${unit}</td>`;
  tbody.appendChild(tr);
}

async function cargar() {
  const params = new URLSearchParams(location.search);
  const tipo = params.get('tipo');
  const txid = params.get('txid');

  document.getElementById('txid').textContent = txid || '(no proporcionado)';
  document.getElementById('tipo').textContent = tipo || '(desconocido)';
  document.getElementById('title').textContent =
    tipo === 'light' ? '🪶 JSON desde la Blockchain' : '🏋️ JSON desde la Blockchain';

  if (!tipo || !txid) {
    document.getElementById('contenido').innerHTML =
      `<div class="error">❌ Falta tipo o txid</div>`;
    return;
  }

  try {
    // 1) Traer el JSON directamente de la blockchain
    const resJson = await fetch(`/leer-json/${tipo}/${txid}`);
    if (!resJson.ok) throw new Error('Transacción no encontrada');
    const bcRec = await resJson.json();

    if (tipo === 'light') {
      // payload es el hash para light; aquí sólo mostramos el contenido original
      document.getElementById('contenido').innerHTML =
        `<div>Hash en blockchain: ${bcRec.payload}</div>`;
    } else {
      // heavy: payload es el JSON crudo
      jsonData = JSON.parse(bcRec.payload);
      document.getElementById('contenido').innerHTML =
        `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
    }

    // 2) Cargar métricas
    const metRes = await fetch(`/metrics/tx/${txid}`);
    if (!metRes.ok) throw new Error('No se pudieron cargar métricas');
    const { window, metrics } = await metRes.json();

    // 3) Duración en microsegundos
    const durUs = window.duration * 1e6;
    document.getElementById('tiempos').textContent =
      `Duración: ${durUs.toFixed(0)} µs`;

    // 4) Rellenar tabla de métricas
    const units = {
      blockLatency95: 'µs',
      blocksPerSec: 'bloques/s',
      blockchainHeight: 'bloques',
      systemCpuPct: '%',
      peerCpuPct: '%',
      peerMemBytes: 'B',
      hostMemUsagePct: '%',
      containerCount: 'count',
      totalContainerMem: 'B',
      proposalDuration: 'µs',
      proposalsReceived: 'req/s',
      proposalsSuccessful: 'req/s',
      shimReqDuration: 'µs',
      shimReqReceived: 'req/s',
      shimReqCompleted: 'req/s',
      blockProcessingTime: 'µs',
      blockStorageCommitTime: 'µs',
      stateDbCommitTime: 'µs'
    };
    const table = document.getElementById('metricsTable');
    table.style.display = 'table';
    document.querySelector('#metricsTable tbody').innerHTML = '';
    for (const [name, value] of Object.entries(metrics)) {
      addMetricRow(name, value.toFixed(3), units[name] || '');
    }

    // 5) Mostrar botón de descarga para heavy
    if (tipo === 'heavy') {
      document.getElementById('descargarBtn').style.display = 'inline-block';
    }
  } catch (e) {
    document.getElementById('contenido').innerHTML =
      `<div class="error">❌ ${e.message}</div>`;
  }
}

function descargar() {
  if (!jsonData) return;
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `datos-${Date.now()}.json`;
  a.click();
}

window.onload = () => {
  aplicarModoGuardado();
  document.getElementById('btn-modo').onclick = toggleModo;
  cargar();
};

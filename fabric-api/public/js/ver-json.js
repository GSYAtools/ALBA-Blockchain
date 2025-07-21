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

// Convierte ArrayBuffer a hex
function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Calcula SHA-256 de un string
async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return toHex(hashBuffer);
}

async function cargar() {
  const params = new URLSearchParams(location.search);
  const tipo  = params.get('tipo');
  const txid  = params.get('txid');
  document.getElementById('txid').textContent = txid || '(no proporcionado)';
  document.getElementById('tipo').textContent = tipo || '(desconocido)';

  // Ajustar título con icono
  const icon = tipo === 'light' ? '🪶' : '🏋️';
  document.getElementById('title').textContent = `${icon} JSON desde la Blockchain`;

  if (!tipo || !txid) {
    document.getElementById('contenido').innerHTML =
      '<div class="error">❌ Falta tipo o txid en la URL</div>';
    return;
  }

  try {
    if (tipo === 'light') {
      // 1) Recuperar JSON desde la BD
      const regRes = await fetch('/registros');
      const { light } = await regRes.json();
      const rec = light.find(r => r.tx_id === txid);
      if (!rec) throw new Error('Registro no encontrado en BD');

      // r.data llega como string JSON
      const dataString = rec.data;
      const parsed = JSON.parse(dataString);
      jsonData = parsed;

      // Mostrar JSON
      document.getElementById('contenido').innerHTML =
        `<pre>${JSON.stringify(parsed, null, 2)}</pre>`;

      // 2) Recalcular hash y comparar con blockchain
      const localHash = await sha256(dataString);

      // 3) Recuperar hash de blockchain
      const bcRes = await fetch(`/leer-json/${tipo}/${txid}`);
      if (!bcRes.ok) throw new Error('Hash no encontrado en blockchain');
      const bcRec = await bcRes.json();         // { tipo, payload, timestamp }
      const bcHash = bcRec.payload;

      // 4) Validación
      const validDiv = document.getElementById('validacion');
      if (localHash === bcHash) {
        validDiv.textContent = `✅ Hash coincide: ${localHash}`;
        validDiv.style.color = '#44bd32';
      } else {
        validDiv.textContent = `❌ ¡Hash NO coincide!
Local: ${localHash}
Chain: ${bcHash}`;
        validDiv.style.color = '#e84118';
      }

      document.getElementById('descargarBtn').style.display = 'inline-block';

    } else {
      // Heavy: solo request a blockchain
      const res = await fetch(`/leer-json/${tipo}/${txid}`);
      if (!res.ok) throw new Error('Transacción no encontrada');
      const bcRec = await res.json();
      jsonData = bcRec.payload ? JSON.parse(bcRec.payload) : {};
      document.getElementById('contenido').innerHTML =
        `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
      document.getElementById('descargarBtn').style.display = 'inline-block';
    }
  } catch (e) {
    document.getElementById('contenido').innerHTML =
      `<div class="error">❌ Error: ${e.message}</div>`;
  }
}

function descargar() {
  if (!jsonData) return;
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `datos-${jsonData.tipo||'data'}-${new Date().toISOString()}.json`;
  a.click();
}

window.onload = () => {
  aplicarModoGuardado();
  document.getElementById('btn-modo').onclick = toggleModo;
  cargar();
};

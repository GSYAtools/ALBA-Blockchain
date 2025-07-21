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

// SHA-256 util
function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return toHex(buf);
}

async function cargar() {
  const params = new URLSearchParams(location.search);
  const tipo  = params.get('tipo');
  const txid  = params.get('txid');
  document.getElementById('txid').textContent = txid;
  document.getElementById('tipo').textContent = tipo;
  document.getElementById('title').textContent =
    `${tipo==='light'?'🪶':'🏋️'} JSON desde la Blockchain`;

  if (!tipo || !txid) {
    document.getElementById('contenido').innerHTML =
      `<div class="error">❌ Falta tipo o txid</div>`;
    return;
  }

  try {
    // Obtener registro de BD
    const regRes = await fetch('/registros');
    const { light, heavy } = await regRes.json();
    const recList = tipo==='light'? light : heavy;
    const rec     = recList.find(r=>r.tx_id===txid);
    if (!rec) throw new Error('Registro no encontrado');

    // Cálculo tiempo
    const diffNs = (BigInt(rec.end_tx_ns) - BigInt(rec.start_tx_ns)).toString();

    if (tipo==='light') {
      jsonData = JSON.parse(rec.data);
      document.getElementById('contenido').innerHTML =
        `<pre>${JSON.stringify(jsonData,null,2)}</pre>`;

      const localHash = await sha256(rec.data);
      const bcHash    = (await (await fetch(`/leer-json/${tipo}/${txid}`)).json()).payload;
      const validDiv  = document.getElementById('validacion');
      validDiv.textContent = localHash===bcHash
        ? '✅ Hash coincide'
        : '❌ Hash NO coincide';
      validDiv.style.color = localHash===bcHash ? '#44bd32' : '#e84118';

    } else {
      const bcData = (await (await fetch(`/leer-json/${tipo}/${txid}`)).json()).payload;
      jsonData = JSON.parse(bcData);
      document.getElementById('contenido').innerHTML =
        `<pre>${JSON.stringify(jsonData,null,2)}</pre>`;
    }

    document.getElementById('tiempos').textContent =
      `Duración: ${diffNs} ns`;
    document.getElementById('descargarBtn').style.display = 'inline-block';

  } catch (e) {
    document.getElementById('contenido').innerHTML =
      `<div class="error">❌ ${e.message}</div>`;
  }
}

function descargar() {
  if (!jsonData) return;
  const blob = new Blob([JSON.stringify(jsonData,null,2)],{type:'application/json'});
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `datos-${Date.now()}.json`;
  a.click();
}

window.onload = () => {
  aplicarModoGuardado();
  document.getElementById('btn-modo').onclick = toggleModo;
  cargar();
};

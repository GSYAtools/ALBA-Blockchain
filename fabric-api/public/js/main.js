// Gestión del modo oscuro
function toggleModo() {
  const dark = document.body.classList.toggle('dark');
  localStorage.setItem('modoOscuro', dark ? '1' : '0');
}
function aplicarModoGuardado() {
  if (localStorage.getItem('modoOscuro') === '1') {
    document.body.classList.add('dark');
  }
}

// Carga registros de MySQL (DB) y pinta dos tablas
async function cargarRegistros() {
  const res = await fetch('/registros');
  const { light, heavy } = await res.json();
  document.getElementById('last-update').textContent = 
    `(última actualización: ${new Date().toLocaleTimeString()})`;

  const pintar = (arr, tbodyId, tipo) => {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '';
    arr.forEach(r => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${r.id}</td>
        <td>${new Date(r.timestamp).toLocaleString()}</td>
        <td><button onclick="verJson('${tipo}','${r.tx_id}')">
             Ver ${tipo}
           </button></td>`;
      tbody.appendChild(row);
    });
  };

  pintar(light, 'tabla-light', 'light');
  pintar(heavy, 'tabla-heavy', 'heavy');
}

// Abrir ventana de ver-json pasando tipo y txid
function verJson(tipo, txid) {
  window.open(`/ver-json.html?tipo=${tipo}&txid=${txid}`, '_blank');
}

// Inicialización
aplicarModoGuardado();
document.getElementById('btn-modo').onclick = toggleModo;
cargarRegistros();
setInterval(cargarRegistros, 10000);

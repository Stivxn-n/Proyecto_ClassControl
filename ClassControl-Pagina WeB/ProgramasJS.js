/* ============================================
   programas.js — ClassControl
   CRUD completo + filtros reactivos + paginación
   + métricas dinámicas + descarga CSV
   ============================================ */

'use strict';

/* ──────────────────────────────────────────
   1. DATOS INICIALES
────────────────────────────────────────── */
let programas = [
  { id: 1, codigo: '228106', nombre: 'Análisis y Desarrollo de Software',                       nivel: 'Tecnólogo',        version: 102, estado: 'Activo'   },
  { id: 2, codigo: '524105', nombre: 'Sistemas Telemáticos',                                     nivel: 'Técnico',          version: 1,   estado: 'Activo'   },
  { id: 3, codigo: '123512', nombre: 'Gestión de Talento Humano',                                nivel: 'Especialización',  version: 12,  estado: 'Inactivo' },
  { id: 4, codigo: '228118', nombre: 'Programación de Aplicaciones para Dispositivos Móviles',   nivel: 'Técnico',          version: 3,   estado: 'Activo'   },
  { id: 5, codigo: '135001', nombre: 'Contabilización de Operaciones Comerciales y Financieras', nivel: 'Técnico',          version: 4,   estado: 'Activo'   },
  { id: 6, codigo: '623615', nombre: 'Diseño e Integración de Multimedia',                       nivel: 'Tecnólogo',        version: 1,   estado: 'Activo'   },
  { id: 7, codigo: '228185', nombre: 'Gestión de Redes de Datos',                                nivel: 'Tecnólogo',        version: 2,   estado: 'Inactivo' },
];

let nextId       = 8;
let paginaActual = 1;
const POR_PAGINA = 5;
let idAEliminar  = null;

/* ──────────────────────────────────────────
   2. SELECTORES
────────────────────────────────────────── */
const tbodyProgramas     = document.getElementById('tbody-programas');
const contadorEl         = document.getElementById('contador-programas');
const paginacionEl       = document.getElementById('paginacion');
const metricasEl         = document.getElementById('metricas');

const formFiltros        = document.getElementById('form-filtros');
const filtroBusqueda     = document.getElementById('filtro-busqueda');
const filtroNivel        = document.getElementById('filtro-nivel');
const filtroEstado       = document.getElementById('filtro-estado');
const btnLimpiar         = document.getElementById('btn-limpiar');

const modalPrograma      = document.getElementById('modal-programa');
const modalTitulo        = document.getElementById('modal-titulo');
const formPrograma       = document.getElementById('form-programa');
const progId             = document.getElementById('prog-id');
const progCodigo         = document.getElementById('prog-codigo');
const progNombre         = document.getElementById('prog-nombre');
const progNivel          = document.getElementById('prog-nivel');
const progVersion        = document.getElementById('prog-version');
const progEstado         = document.getElementById('prog-estado');

const btnNuevo           = document.getElementById('btn-nuevo-programa');
const btnCerrarModal     = document.getElementById('btn-cerrar-modal');
const btnCancelar        = document.getElementById('btn-cancelar');
const btnDescargar       = document.getElementById('btn-descargar');

const modalEliminar      = document.getElementById('modal-eliminar');
const btnCancelarElim    = document.getElementById('btn-cancelar-eliminar');
const btnConfirmarElim   = document.getElementById('btn-confirmar-eliminar');

const toast              = document.getElementById('toast');
const toastMsg           = document.getElementById('toast-msg');
const toastIcon          = document.getElementById('toast-icon');

/* ──────────────────────────────────────────
   3. MÉTRICAS
────────────────────────────────────────── */
const COLORES_METRICA = {
  total:           { borde: '#38a800', etiqueta: 'Total Programas' },
  Técnico:         { borde: '#00304D', etiqueta: 'Técnicos' },
  Tecnólogo:       { borde: '#0369a1', etiqueta: 'Tecnólogos' },
  Especialización: { borde: '#ea580c', etiqueta: 'Especializaciones' },
};

function renderMetricas() {
  const total      = programas.length;
  const tecnicos   = programas.filter(p => p.nivel === 'Técnico').length;
  const tecnologos = programas.filter(p => p.nivel === 'Tecnólogo').length;
  const espec      = programas.filter(p => p.nivel === 'Especialización').length;

  const datos = [
    { key: 'total',           valor: total      },
    { key: 'Técnico',         valor: tecnicos   },
    { key: 'Tecnólogo',       valor: tecnologos },
    { key: 'Especialización', valor: espec      },
  ];

  metricasEl.innerHTML = datos.map(d => `
    <div class="metrica-card" style="border-left-color: ${COLORES_METRICA[d.key].borde}">
      <p class="text-xs font-bold text-slate-500 uppercase mb-1">${COLORES_METRICA[d.key].etiqueta}</p>
      <p class="text-2xl font-bold text-slate-800">${d.valor}</p>
    </div>
  `).join('');
}

/* ──────────────────────────────────────────
   4. FILTRADO
────────────────────────────────────────── */
function filtrarProgramas() {
  const busq   = filtroBusqueda.value.trim().toLowerCase();
  const nivel  = filtroNivel.value;
  const estado = filtroEstado.value;

  return programas.filter(p => {
    const matchBusq   = !busq   || p.nombre.toLowerCase().includes(busq) || p.codigo.includes(busq);
    const matchNivel  = !nivel  || p.nivel === nivel;
    const matchEstado = !estado || p.estado === estado;
    return matchBusq && matchNivel && matchEstado;
  });
}

/* ──────────────────────────────────────────
   5. BADGE DE NIVEL
────────────────────────────────────────── */
function badgeNivel(nivel) {
  const map = {
    'Técnico':        'badge-tecnico',
    'Tecnólogo':      'badge-tecnologo',
    'Especialización':'badge-especializacion',
  };
  const cls = map[nivel] || 'badge-tecnico';
  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}">
    <span class="w-1.5 h-1.5 rounded-full" style="background:currentColor"></span>${nivel}
  </span>`;
}

/* ──────────────────────────────────────────
   6. BADGE DE ESTADO
────────────────────────────────────────── */
function badgeEstado(estado) {
  if (estado === 'Activo') {
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">
      <span class="material-symbols-outlined text-[14px]">check_circle</span> Activo
    </span>`;
  }
  return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-500">
    <span class="material-symbols-outlined text-[14px]">cancel</span> Inactivo
  </span>`;
}

/* ──────────────────────────────────────────
   7. RENDER TABLA
────────────────────────────────────────── */
function renderTabla() {
  const filtrados = filtrarProgramas();
  const total     = filtrados.length;
  const totalPags = Math.max(1, Math.ceil(total / POR_PAGINA));

  if (paginaActual > totalPags) paginaActual = totalPags;

  const inicio  = (paginaActual - 1) * POR_PAGINA;
  const pagina  = filtrados.slice(inicio, inicio + POR_PAGINA);

  tbodyProgramas.innerHTML = '';

  if (pagina.length === 0) {
    tbodyProgramas.innerHTML = `
      <tr class="empty-row">
        <td colspan="6">
          <span class="material-symbols-outlined" style="font-size:2rem;display:block;margin:0 auto 8px;color:#cbd5e1">search_off</span>
          No se encontraron programas con los filtros aplicados.
        </td>
      </tr>`;
  } else {
    pagina.forEach(p => {
      tbodyProgramas.insertAdjacentHTML('beforeend', crearFila(p));
    });
  }

  contadorEl.textContent =
    `Mostrando ${Math.min(inicio + 1, total)}–${Math.min(inicio + POR_PAGINA, total)} de ${total} programa${total !== 1 ? 's' : ''}`;

  renderPaginacion(totalPags);
  renderMetricas();
}

function crearFila(p) {
  return `
  <tr class="hover:bg-primary/5 transition-colors group" data-id="${p.id}">
    <td class="px-6 py-4 font-mono text-xs text-slate-500">${p.codigo}</td>
    <td class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">${p.nombre}</td>
    <td class="px-6 py-4">${badgeNivel(p.nivel)}</td>
    <td class="px-6 py-4 text-center font-medium text-slate-700 dark:text-slate-300">${p.version}</td>
    <td class="px-6 py-4">${badgeEstado(p.estado)}</td>
    <td class="px-6 py-4 text-right">
      <div class="action-btns flex justify-end gap-1">
        <button class="p-1.5 hover:bg-amber-500/10 text-amber-500 rounded transition-colors btn-editar" data-id="${p.id}" title="Editar">
          <span class="material-symbols-outlined text-lg">edit</span>
        </button>
        <button class="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors btn-eliminar" data-id="${p.id}" title="Eliminar">
          <span class="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </td>
  </tr>`;
}

/* ──────────────────────────────────────────
   8. PAGINACIÓN
────────────────────────────────────────── */
function renderPaginacion(totalPags) {
  paginacionEl.innerHTML = '';

  const btnPrev = crearBtnNav('chevron_left', paginaActual === 1, () => { paginaActual--; renderTabla(); });
  paginacionEl.appendChild(btnPrev);

  calcularRango(paginaActual, totalPags).forEach(item => {
    if (item === '...') {
      const sep = document.createElement('span');
      sep.textContent = '...';
      sep.className = 'text-slate-400 px-1 text-xs';
      paginacionEl.appendChild(sep);
    } else {
      const btn = document.createElement('button');
      btn.textContent = item;
      btn.className = `w-8 h-8 flex items-center justify-center rounded border text-xs font-bold transition-colors
        ${item === paginaActual
          ? 'border-primary bg-primary text-white page-btn-active'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50'}`;
      btn.addEventListener('click', () => { paginaActual = item; renderTabla(); });
      paginacionEl.appendChild(btn);
    }
  });

  const btnNext = crearBtnNav('chevron_right', paginaActual === totalPags, () => { paginaActual++; renderTabla(); });
  paginacionEl.appendChild(btnNext);
}

function crearBtnNav(icon, disabled, handler) {
  const btn = document.createElement('button');
  btn.className = `w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700
    bg-white dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  btn.disabled = disabled;
  btn.innerHTML = `<span class="material-symbols-outlined text-sm">${icon}</span>`;
  btn.addEventListener('click', handler);
  return btn;
}

function calcularRango(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const rango = new Set([1, total, actual]);
  if (actual > 1) rango.add(actual - 1);
  if (actual < total) rango.add(actual + 1);
  const sorted = [...rango].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push('...');
    result.push(n);
  });
  return result;
}

/* ──────────────────────────────────────────
   9. MODAL CREAR / EDITAR
────────────────────────────────────────── */
function abrirModalNuevo() {
  modalTitulo.textContent = 'Nuevo Programa';
  formPrograma.reset();
  progId.value = '';
  limpiarErrores();
  modalPrograma.classList.remove('hidden');
}

function abrirModalEditar(id) {
  const p = programas.find(x => x.id === id);
  if (!p) return;
  modalTitulo.textContent = 'Editar Programa';
  progId.value      = p.id;
  progCodigo.value  = p.codigo;
  progNombre.value  = p.nombre;
  progNivel.value   = p.nivel;
  progVersion.value = p.version;
  progEstado.value  = p.estado;
  limpiarErrores();
  modalPrograma.classList.remove('hidden');
}

function cerrarModalPrograma() {
  modalPrograma.classList.add('hidden');
  formPrograma.reset();
  limpiarErrores();
}

/* ──────────────────────────────────────────
   10. VALIDACIÓN
────────────────────────────────────────── */
function validarFormulario() {
  let valido = true;
  [progCodigo, progNombre, progNivel, progVersion, progEstado].forEach(campo => {
    const errorEl = campo.nextElementSibling;
    if (!campo.value.toString().trim()) {
      campo.classList.add('is-invalid');
      errorEl?.classList.remove('hidden');
      valido = false;
    } else {
      campo.classList.remove('is-invalid');
      errorEl?.classList.add('hidden');
    }
  });
  return valido;
}

function limpiarErrores() {
  document.querySelectorAll('.input-field').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));
}

/* ──────────────────────────────────────────
   11. GUARDAR
────────────────────────────────────────── */
formPrograma.addEventListener('submit', e => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const id = progId.value ? parseInt(progId.value, 10) : null;

  const datos = {
    codigo  : progCodigo.value.trim(),
    nombre  : progNombre.value.trim(),
    nivel   : progNivel.value,
    version : parseInt(progVersion.value, 10),
    estado  : progEstado.value,
  };

  if (id) {
    const idx = programas.findIndex(x => x.id === id);
    programas[idx] = { ...programas[idx], ...datos };
    mostrarToast('Programa actualizado correctamente.', 'check_circle', 'text-primary');
  } else {
    programas.unshift({ id: nextId++, ...datos });
    paginaActual = 1;
    mostrarToast('Programa creado correctamente.', 'check_circle', 'text-primary');
  }

  cerrarModalPrograma();
  renderTabla();
});

/* ──────────────────────────────────────────
   12. ELIMINAR
────────────────────────────────────────── */
function abrirModalEliminar(id) {
  idAEliminar = id;
  modalEliminar.classList.remove('hidden');
}

function cerrarModalEliminar() {
  idAEliminar = null;
  modalEliminar.classList.add('hidden');
}

btnConfirmarElim.addEventListener('click', () => {
  programas = programas.filter(p => p.id !== idAEliminar);
  cerrarModalEliminar();
  renderTabla();
  mostrarToast('Programa eliminado.', 'delete', 'text-red-400');
});

/* ──────────────────────────────────────────
   13. DESCARGA CSV
────────────────────────────────────────── */
btnDescargar.addEventListener('click', () => {
  const cabecera = ['Código', 'Nombre', 'Nivel', 'Versión', 'Estado'];
  const filas    = programas.map(p =>
    [p.codigo, `"${p.nombre}"`, p.nivel, p.version, p.estado].join(',')
  );
  const csv  = [cabecera.join(','), ...filas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'programas_classcontrol.csv';
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('Reporte descargado.', 'download', 'text-blue-400');
});

/* ──────────────────────────────────────────
   14. TOAST
────────────────────────────────────────── */
let toastTimer = null;

function mostrarToast(msg, icon = 'check_circle', colorClass = 'text-primary') {
  toastMsg.textContent   = msg;
  toastIcon.textContent  = icon;
  toastIcon.className    = `material-symbols-outlined ${colorClass}`;
  toast.classList.remove('hidden');
  toast.classList.add('toast-anim');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

/* ──────────────────────────────────────────
   15. DELEGACIÓN EN TABLA
────────────────────────────────────────── */
tbodyProgramas.addEventListener('click', e => {
  const btnEdit = e.target.closest('.btn-editar');
  const btnDel  = e.target.closest('.btn-eliminar');
  if (btnEdit) abrirModalEditar(parseInt(btnEdit.dataset.id, 10));
  if (btnDel)  abrirModalEliminar(parseInt(btnDel.dataset.id, 10));
});

/* ──────────────────────────────────────────
   16. FILTROS REACTIVOS
────────────────────────────────────────── */
[filtroBusqueda, filtroNivel, filtroEstado].forEach(el => {
  el.addEventListener('input', () => { paginaActual = 1; renderTabla(); });
});

formFiltros.addEventListener('reset', () => {
  setTimeout(() => { paginaActual = 1; renderTabla(); }, 0);
});

formFiltros.addEventListener('submit', e => {
  e.preventDefault();
  paginaActual = 1;
  renderTabla();
});

/* ──────────────────────────────────────────
   17. EVENTOS MODALES
────────────────────────────────────────── */
btnNuevo.addEventListener('click', abrirModalNuevo);
btnCerrarModal.addEventListener('click', cerrarModalPrograma);
btnCancelar.addEventListener('click', cerrarModalPrograma);
btnCancelarElim.addEventListener('click', cerrarModalEliminar);

modalPrograma.addEventListener('click', e => { if (e.target === modalPrograma) cerrarModalPrograma(); });
modalEliminar.addEventListener('click', e => { if (e.target === modalEliminar) cerrarModalEliminar(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { cerrarModalPrograma(); cerrarModalEliminar(); }
});

/* ──────────────────────────────────────────
   18. INICIALIZACIÓN
────────────────────────────────────────── */
renderTabla();

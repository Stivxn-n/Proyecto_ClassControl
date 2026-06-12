/* ============================================
   competencias.js — ClassControl
   CRUD completo + filtros reactivos + paginación
   + métricas dinámicas + exportar CSV
   ============================================ */

'use strict';

/* ──────────────────────────────────────────
   1. DATOS INICIALES
────────────────────────────────────────── */
let competencias = [
  {
    id: 1, codigo: '220501096',
    descripcion: 'Gestionar la información de acuerdo con los requerimientos del cliente y políticas de la organización.',
    programa: 'ADSO', estado: 'Activo', horas: 96,
  },
  {
    id: 2, codigo: '240201501',
    descripcion: 'Interactuar en contextos sociales de acuerdo con principios éticos y de cultura de paz.',
    programa: 'Transversal', estado: 'Activo', horas: 40,
  },
  {
    id: 3, codigo: '220501103',
    descripcion: 'Diseñar la solución de software de acuerdo con procedimientos y requisitos técnicos.',
    programa: 'ADSO', estado: 'Inactivo', horas: 120,
  },
  {
    id: 4, codigo: '210601026',
    descripcion: 'Procesar datos de acuerdo con procedimiento técnico y metodología estadística.',
    programa: 'Gestión', estado: 'Activo', horas: 80,
  },
  {
    id: 5, codigo: '281105014',
    descripcion: 'Desarrollar contenidos digitales interactivos de acuerdo con requerimientos del cliente.',
    programa: 'Multimedia', estado: 'Activo', horas: 88,
  },
  {
    id: 6, codigo: '220501046',
    descripcion: 'Construir los componentes de software de acuerdo con el diseño del sistema de información.',
    programa: 'ADSO', estado: 'Activo', horas: 132,
  },
  {
    id: 7, codigo: '240201528',
    descripcion: 'Utilizar herramientas tecnológicas de acuerdo con los requerimientos del proceso y el contexto.',
    programa: 'Transversal', estado: 'Inactivo', horas: 30,
  },
];

let nextId       = 8;
let paginaActual = 1;
const POR_PAGINA = 5;
let idAEliminar  = null;

/* ──────────────────────────────────────────
   2. SELECTORES
────────────────────────────────────────── */
const tbodyComp          = document.getElementById('tbody-competencias');
const contadorEl         = document.getElementById('contador-competencias');
const paginacionEl       = document.getElementById('paginacion');
const metricasEl         = document.getElementById('metricas');
const resumenCargaEl     = document.getElementById('resumen-carga');

const formFiltros        = document.getElementById('form-filtros');
const filtroBusqueda     = document.getElementById('filtro-busqueda');
const filtroPrograma     = document.getElementById('filtro-programa');
const filtroEstado       = document.getElementById('filtro-estado');

const modalComp          = document.getElementById('modal-competencia');
const modalTitulo        = document.getElementById('modal-titulo');
const formComp           = document.getElementById('form-competencia');
const compId             = document.getElementById('comp-id');
const compCodigo         = document.getElementById('comp-codigo');
const compDescripcion    = document.getElementById('comp-descripcion');
const compPrograma       = document.getElementById('comp-programa');
const compEstado         = document.getElementById('comp-estado');
const compHoras          = document.getElementById('comp-horas');

const btnNueva           = document.getElementById('btn-nueva-competencia');
const btnFab             = document.getElementById('btn-fab');
const btnCerrarModal     = document.getElementById('btn-cerrar-modal');
const btnCancelar        = document.getElementById('btn-cancelar');
const btnDescargar       = document.getElementById('btn-descargar');
const btnGenerarReporte  = document.getElementById('btn-generar-reporte');

const modalDetalle       = document.getElementById('modal-detalle');
const detalleContenido   = document.getElementById('detalle-contenido');
const btnCerrarDetalle   = document.getElementById('btn-cerrar-detalle');
const btnCerrarDetalle2  = document.getElementById('btn-cerrar-detalle2');

const modalEliminar      = document.getElementById('modal-eliminar');
const btnCancelarElim    = document.getElementById('btn-cancelar-eliminar');
const btnConfirmarElim   = document.getElementById('btn-confirmar-eliminar');

const toast              = document.getElementById('toast');
const toastMsg           = document.getElementById('toast-msg');
const toastIcon          = document.getElementById('toast-icon');

/* ──────────────────────────────────────────
   3. CONFIGURACIÓN DE BADGES
────────────────────────────────────────── */
const BADGE_PROGRAMA = {
  'ADSO':        'badge-adso',
  'Multimedia':  'badge-multimedia',
  'Gestión':     'badge-gestion',
  'Transversal': 'badge-transversal',
};

const COLORES_METRICA = {
  total:        { borde: '#38a800', label: 'Total' },
  Activo:       { borde: '#38a800', label: 'Activas' },
  Inactivo:     { borde: '#94a3b8', label: 'Inactivas' },
  pendientes:   { borde: '#f59e0b', label: 'Sin asignar' },
};

/* ──────────────────────────────────────────
   4. MÉTRICAS
────────────────────────────────────────── */
function renderMetricas() {
  const total     = competencias.length;
  const activas   = competencias.filter(c => c.estado === 'Activo').length;
  const inactivas = competencias.filter(c => c.estado === 'Inactivo').length;
  const sinHoras  = competencias.filter(c => !c.horas).length;

  const datos = [
    { key: 'total',      valor: total,     label: 'Total',        borde: '#38a800' },
    { key: 'Activo',     valor: activas,   label: 'Activas',      borde: '#38a800' },
    { key: 'Inactivo',   valor: inactivas, label: 'Inactivas',    borde: '#94a3b8' },
    { key: 'pendientes', valor: sinHoras,  label: 'Sin horas',    borde: '#f59e0b' },
  ];

  metricasEl.innerHTML = datos.map(d => `
    <div class="metrica-card" style="border-left-color:${d.borde}">
      <p class="text-xs font-bold text-slate-500 uppercase mb-1">${d.label}</p>
      <p class="text-2xl font-bold text-slate-800">${d.valor}</p>
    </div>
  `).join('');

  resumenCargaEl.textContent =
    `Hay ${inactivas} competencia${inactivas !== 1 ? 's' : ''} inactiva${inactivas !== 1 ? 's' : ''} y ${sinHoras} sin horas asignadas para el próximo trimestre.`;
}

/* ──────────────────────────────────────────
   5. FILTRADO
────────────────────────────────────────── */
function filtrar() {
  const busq    = filtroBusqueda.value.trim().toLowerCase();
  const prog    = filtroPrograma.value;
  const estado  = filtroEstado.value;

  return competencias.filter(c => {
    const matchBusq   = !busq   || c.codigo.includes(busq) || c.descripcion.toLowerCase().includes(busq);
    const matchProg   = !prog   || c.programa === prog;
    const matchEstado = !estado || c.estado === estado;
    return matchBusq && matchProg && matchEstado;
  });
}

/* ──────────────────────────────────────────
   6. BADGE DE PROGRAMA
────────────────────────────────────────── */
function badgePrograma(prog) {
  const cls = BADGE_PROGRAMA[prog] || 'badge-transversal';
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${cls}">${prog}</span>`;
}

/* ──────────────────────────────────────────
   7. BADGE DE ESTADO
────────────────────────────────────────── */
function badgeEstado(estado) {
  if (estado === 'Activo') {
    return `<span class="flex items-center gap-1.5 text-primary text-xs font-bold">
      <span class="w-2 h-2 rounded-full bg-primary"></span> Activo
    </span>`;
  }
  return `<span class="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
    <span class="w-2 h-2 rounded-full bg-slate-300"></span> Inactivo
  </span>`;
}

/* ──────────────────────────────────────────
   8. RENDER TABLA
────────────────────────────────────────── */
function renderTabla() {
  const filtradas = filtrar();
  const total     = filtradas.length;
  const totalPags = Math.max(1, Math.ceil(total / POR_PAGINA));

  if (paginaActual > totalPags) paginaActual = totalPags;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = filtradas.slice(inicio, inicio + POR_PAGINA);

  tbodyComp.innerHTML = '';

  if (pagina.length === 0) {
    tbodyComp.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">
          <span class="material-symbols-outlined" style="font-size:2rem;display:block;margin:0 auto 8px;color:#cbd5e1">search_off</span>
          No se encontraron competencias con los filtros aplicados.
        </td>
      </tr>`;
  } else {
    pagina.forEach(c => tbodyComp.insertAdjacentHTML('beforeend', crearFila(c)));
  }

  contadorEl.textContent =
    `Mostrando ${Math.min(inicio + 1, total)}–${Math.min(inicio + POR_PAGINA, total)} de ${total} competencia${total !== 1 ? 's' : ''}`;

  renderPaginacion(totalPags);
  renderMetricas();
}

function crearFila(c) {
  return `
  <tr class="hover:bg-primary/5 transition-colors group" data-id="${c.id}">
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="text-sm font-bold text-accent-blue dark:text-slate-300 font-mono">${c.codigo}</span>
    </td>
    <td class="px-6 py-4">
      <p class="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed desc-truncada">${c.descripcion}</p>
      ${c.horas ? `<span class="text-[10px] text-slate-400 mt-1 block">${c.horas} horas</span>` : ''}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">${badgePrograma(c.programa)}</td>
    <td class="px-6 py-4 whitespace-nowrap">${badgeEstado(c.estado)}</td>
    <td class="px-6 py-4 text-right">
      <div class="action-btns flex justify-end gap-1">
        <button class="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition-colors btn-ver" data-id="${c.id}" title="Ver detalle">
          <span class="material-symbols-outlined text-lg">visibility</span>
        </button>
        <button class="p-1.5 hover:bg-amber-500/10 text-amber-500 rounded transition-colors btn-editar" data-id="${c.id}" title="Editar">
          <span class="material-symbols-outlined text-lg">edit</span>
        </button>
        <button class="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors btn-eliminar" data-id="${c.id}" title="Eliminar">
          <span class="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </td>
  </tr>`;
}

/* ──────────────────────────────────────────
   9. PAGINACIÓN
────────────────────────────────────────── */
function renderPaginacion(totalPags) {
  paginacionEl.innerHTML = '';

  const prev = crearBtnNav('chevron_left', paginaActual === 1, () => { paginaActual--; renderTabla(); });
  paginacionEl.appendChild(prev);

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

  const next = crearBtnNav('chevron_right', paginaActual === totalPags, () => { paginaActual++; renderTabla(); });
  paginacionEl.appendChild(next);
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
  const s = new Set([1, total, actual]);
  if (actual > 1) s.add(actual - 1);
  if (actual < total) s.add(actual + 1);
  const sorted = [...s].sort((a, b) => a - b);
  const res = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) res.push('...');
    res.push(n);
  });
  return res;
}

/* ──────────────────────────────────────────
   10. MODAL CREAR / EDITAR
────────────────────────────────────────── */
function abrirModalNuevo() {
  modalTitulo.textContent = 'Nueva Competencia';
  formComp.reset();
  compId.value = '';
  limpiarErrores();
  modalComp.classList.remove('hidden');
}

function abrirModalEditar(id) {
  const c = competencias.find(x => x.id === id);
  if (!c) return;
  modalTitulo.textContent  = 'Editar Competencia';
  compId.value             = c.id;
  compCodigo.value         = c.codigo;
  compDescripcion.value    = c.descripcion;
  compPrograma.value       = c.programa;
  compEstado.value         = c.estado;
  compHoras.value          = c.horas || '';
  limpiarErrores();
  modalComp.classList.remove('hidden');
}

function cerrarModalComp() {
  modalComp.classList.add('hidden');
  formComp.reset();
  limpiarErrores();
}

/* ──────────────────────────────────────────
   11. VALIDACIÓN
────────────────────────────────────────── */
function validar() {
  let ok = true;
  [compCodigo, compDescripcion, compPrograma, compEstado].forEach(campo => {
    const err = campo.nextElementSibling;
    if (!campo.value.trim()) {
      campo.classList.add('is-invalid');
      err?.classList.remove('hidden');
      ok = false;
    } else {
      campo.classList.remove('is-invalid');
      err?.classList.add('hidden');
    }
  });
  return ok;
}

function limpiarErrores() {
  document.querySelectorAll('.input-field').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));
}

/* ──────────────────────────────────────────
   12. GUARDAR
────────────────────────────────────────── */
formComp.addEventListener('submit', e => {
  e.preventDefault();
  if (!validar()) return;

  const id = compId.value ? parseInt(compId.value, 10) : null;
  const datos = {
    codigo:      compCodigo.value.trim(),
    descripcion: compDescripcion.value.trim(),
    programa:    compPrograma.value,
    estado:      compEstado.value,
    horas:       compHoras.value ? parseInt(compHoras.value, 10) : null,
  };

  if (id) {
    const idx = competencias.findIndex(x => x.id === id);
    competencias[idx] = { ...competencias[idx], ...datos };
    mostrarToast('Competencia actualizada correctamente.', 'check_circle', 'text-primary');
  } else {
    competencias.unshift({ id: nextId++, ...datos });
    paginaActual = 1;
    mostrarToast('Competencia creada correctamente.', 'check_circle', 'text-primary');
  }

  cerrarModalComp();
  renderTabla();
});

/* ──────────────────────────────────────────
   13. VER DETALLE
────────────────────────────────────────── */
function verDetalle(id) {
  const c = competencias.find(x => x.id === id);
  if (!c) return;

  detalleContenido.innerHTML = `
    <div class="detalle-row"><span>Código</span><span class="font-mono text-accent-blue">${c.codigo}</span></div>
    <div class="detalle-row"><span>Descripción</span><span>${c.descripcion}</span></div>
    <div class="detalle-row"><span>Programa</span><span>${badgePrograma(c.programa)}</span></div>
    <div class="detalle-row"><span>Estado</span><span>${badgeEstado(c.estado)}</span></div>
    <div class="detalle-row"><span>Horas de Formación</span><span>${c.horas ? c.horas + ' horas' : '—'}</span></div>
  `;

  modalDetalle.classList.remove('hidden');
}

/* ──────────────────────────────────────────
   14. ELIMINAR
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
  competencias = competencias.filter(c => c.id !== idAEliminar);
  cerrarModalEliminar();
  renderTabla();
  mostrarToast('Competencia eliminada.', 'delete', 'text-red-400');
});

/* ──────────────────────────────────────────
   15. EXPORTAR CSV
────────────────────────────────────────── */
function exportarCSV() {
  const cabecera = ['Código', 'Descripción', 'Programa', 'Estado', 'Horas'];
  const filas = competencias.map(c =>
    [c.codigo, `"${c.descripcion}"`, c.programa, c.estado, c.horas ?? ''].join(',')
  );
  const csv  = [cabecera.join(','), ...filas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'competencias_classcontrol.csv';
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('Reporte exportado correctamente.', 'download', 'text-blue-400');
}

/* ──────────────────────────────────────────
   16. TOAST
────────────────────────────────────────── */
let toastTimer = null;

function mostrarToast(msg, icon = 'check_circle', colorClass = 'text-primary') {
  toastMsg.textContent  = msg;
  toastIcon.textContent = icon;
  toastIcon.className   = `material-symbols-outlined ${colorClass}`;
  toast.classList.remove('hidden');
  toast.classList.add('toast-anim');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

/* ──────────────────────────────────────────
   17. DELEGACIÓN EN TABLA
────────────────────────────────────────── */
tbodyComp.addEventListener('click', e => {
  const btnVer  = e.target.closest('.btn-ver');
  const btnEdit = e.target.closest('.btn-editar');
  const btnDel  = e.target.closest('.btn-eliminar');
  if (btnVer)  verDetalle(parseInt(btnVer.dataset.id, 10));
  if (btnEdit) abrirModalEditar(parseInt(btnEdit.dataset.id, 10));
  if (btnDel)  abrirModalEliminar(parseInt(btnDel.dataset.id, 10));
});

/* ──────────────────────────────────────────
   18. FILTROS REACTIVOS
────────────────────────────────────────── */
[filtroBusqueda, filtroPrograma, filtroEstado].forEach(el => {
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
   19. EVENTOS DE BOTONES Y MODALES
────────────────────────────────────────── */
btnNueva.addEventListener('click', abrirModalNuevo);
btnFab?.addEventListener('click', abrirModalNuevo);
btnCerrarModal.addEventListener('click', cerrarModalComp);
btnCancelar.addEventListener('click', cerrarModalComp);
btnCancelarElim.addEventListener('click', cerrarModalEliminar);
btnCerrarDetalle.addEventListener('click', () => modalDetalle.classList.add('hidden'));
btnCerrarDetalle2.addEventListener('click', () => modalDetalle.classList.add('hidden'));
btnDescargar.addEventListener('click', exportarCSV);
btnGenerarReporte.addEventListener('click', exportarCSV);

// Cierre al clic en overlay
modalComp.addEventListener('click', e => { if (e.target === modalComp) cerrarModalComp(); });
modalEliminar.addEventListener('click', e => { if (e.target === modalEliminar) cerrarModalEliminar(); });
modalDetalle.addEventListener('click', e => { if (e.target === modalDetalle) modalDetalle.classList.add('hidden'); });

// Cierre con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarModalComp();
    cerrarModalEliminar();
    modalDetalle.classList.add('hidden');
  }
});

/* ──────────────────────────────────────────
   20. INICIALIZACIÓN
────────────────────────────────────────── */
renderTabla();

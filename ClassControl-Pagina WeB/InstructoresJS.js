/* ============================================
   instructores.js — ClassControl
   CRUD completo + filtros reactivos + paginación
   + métricas + avatares dinámicos + exportar CSV
   ============================================ */

'use strict';

/* ──────────────────────────────────────────
   1. DATOS INICIALES
────────────────────────────────────────── */
let instructores = [
  {
    id: 1,
    nombres: 'Carlos Alberto', apellidos: 'Gómez Ruiz',
    cedula: '1.020.304.050', correo: 'carlos.gomez@sena.edu.co',
    telefono: '3001234567', area: 'Tecnología',
    rol: 'Instructor', estado: 'Activo',
  },
  {
    id: 2,
    nombres: 'Ana María', apellidos: 'Rodríguez',
    cedula: '52.637.485', correo: 'ana.rod@sena.edu.co',
    telefono: '3109876543', area: 'Gestión',
    rol: 'Administrador', estado: 'Activo',
  },
  {
    id: 3,
    nombres: 'Luis Fernando', apellidos: 'Pérez',
    cedula: '1.098.765.432', correo: 'luis.perez@sena.edu.co',
    telefono: '3205551234', area: 'Matemáticas',
    rol: 'Instructor', estado: 'Inactivo',
  },
  {
    id: 4,
    nombres: 'Martha Lucía', apellidos: 'Sánchez',
    cedula: '32.456.789', correo: 'martha.san@sena.edu.co',
    telefono: '3156789012', area: 'Idiomas',
    rol: 'Instructor', estado: 'Activo',
  },
  {
    id: 5,
    nombres: 'Roberto Carlos', apellidos: 'Díaz Mora',
    cedula: '79.543.210', correo: 'roberto.diaz@sena.edu.co',
    telefono: '3012223344', area: 'Tecnología',
    rol: 'Instructor', estado: 'Activo',
  },
  {
    id: 6,
    nombres: 'Sandra Milena', apellidos: 'Torres',
    cedula: '43.210.987', correo: 'sandra.torres@sena.edu.co',
    telefono: '3187654321', area: 'Transversal',
    rol: 'Coordinador', estado: 'Activo',
  },
];

let nextId       = 7;
let paginaActual = 1;
const POR_PAGINA = 5;
let idAEliminar  = null;

/* ──────────────────────────────────────────
   2. SELECTORES
────────────────────────────────────────── */
const tbodyInst          = document.getElementById('tbody-instructores');
const contadorEl         = document.getElementById('contador-instructores');
const paginacionEl       = document.getElementById('paginacion');
const metricasEl         = document.getElementById('metricas');

const formFiltros        = document.getElementById('form-filtros');
const filtroBusqueda     = document.getElementById('filtro-busqueda');
const filtroRol          = document.getElementById('filtro-rol');
const filtroEstado       = document.getElementById('filtro-estado');

const modalInst          = document.getElementById('modal-instructor');
const modalTitulo        = document.getElementById('modal-titulo');
const formInst           = document.getElementById('form-instructor');
const instId             = document.getElementById('inst-id');
const instNombres        = document.getElementById('inst-nombres');
const instApellidos      = document.getElementById('inst-apellidos');
const instCedula         = document.getElementById('inst-cedula');
const instCorreo         = document.getElementById('inst-correo');
const instTelefono       = document.getElementById('inst-telefono');
const instArea           = document.getElementById('inst-area');
const instRol            = document.getElementById('inst-rol');
const instEstado         = document.getElementById('inst-estado');

const btnNuevo           = document.getElementById('btn-nuevo-instructor');
const btnCerrarModal     = document.getElementById('btn-cerrar-modal');
const btnCancelar        = document.getElementById('btn-cancelar');
const btnDescargar       = document.getElementById('btn-descargar');

const modalDetalle       = document.getElementById('modal-detalle');
const detalleAvatar      = document.getElementById('detalle-avatar');
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
   3. COLORES DE AVATAR (por área)
────────────────────────────────────────── */
const COLORES_AVATAR = {
  'Tecnología':   { bg: '#dbeafe', text: '#1e40af' },
  'Idiomas':      { bg: '#dcfce7', text: '#166534' },
  'Matemáticas':  { bg: '#ffedd5', text: '#9a3412' },
  'Transversal':  { bg: '#f0fdf4', text: '#15803d' },
  'Gestión':      { bg: '#fef9c3', text: '#854d0e' },
};

function getColorAvatar(area) {
  return COLORES_AVATAR[area] || { bg: '#e2e8f0', text: '#475569' };
}

function getIniciales(nombres, apellidos) {
  const n = nombres?.trim().split(' ')[0]?.[0]?.toUpperCase() || '';
  const a = apellidos?.trim().split(' ')[0]?.[0]?.toUpperCase() || '';
  return n + a;
}

/* ──────────────────────────────────────────
   4. MÉTRICAS
────────────────────────────────────────── */
function renderMetricas() {
  const total        = instructores.length;
  const activos      = instructores.filter(i => i.estado === 'Activo').length;
  const instructoresN = instructores.filter(i => i.rol === 'Instructor').length;
  const admins       = instructores.filter(i => i.rol !== 'Instructor').length;

  const datos = [
    { label: 'Total Personal',  valor: total,         borde: '#38a800' },
    { label: 'Activos',         valor: activos,       borde: '#38a800' },
    { label: 'Instructores',    valor: instructoresN, borde: '#1e40af' },
    { label: 'Admin / Coord.',  valor: admins,        borde: '#7c3aed' },
  ];

  metricasEl.innerHTML = datos.map(d => `
    <div class="metrica-card" style="border-left-color:${d.borde}">
      <p class="text-xs font-bold text-slate-500 uppercase mb-1">${d.label}</p>
      <p class="text-2xl font-bold text-slate-800">${d.valor}</p>
    </div>
  `).join('');
}

/* ──────────────────────────────────────────
   5. FILTRADO
────────────────────────────────────────── */
function filtrar() {
  const busq   = filtroBusqueda.value.trim().toLowerCase();
  const rol    = filtroRol.value;
  const estado = filtroEstado.value;

  return instructores.filter(i => {
    const nombreCompleto = `${i.nombres} ${i.apellidos}`.toLowerCase();
    const matchBusq   = !busq   || nombreCompleto.includes(busq) || i.cedula.includes(busq) || i.correo.toLowerCase().includes(busq);
    const matchRol    = !rol    || i.rol === rol;
    const matchEstado = !estado || i.estado === estado;
    return matchBusq && matchRol && matchEstado;
  });
}

/* ──────────────────────────────────────────
   6. BADGES
────────────────────────────────────────── */
function badgeRol(rol) {
  const cls = {
    'Instructor':    'badge-instructor',
    'Administrador': 'badge-administrador',
    'Coordinador':   'badge-coordinador',
  }[rol] || 'badge-instructor';
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${cls}">${rol}</span>`;
}

function badgeEstado(estado) {
  if (estado === 'Activo') {
    return `<div class="flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-primary"></span>
      <span class="text-xs font-bold text-primary uppercase">Activo</span>
    </div>`;
  }
  return `<div class="flex items-center gap-1.5">
    <span class="w-2 h-2 rounded-full bg-slate-400"></span>
    <span class="text-xs font-bold text-slate-400 uppercase">Inactivo</span>
  </div>`;
}

/* ──────────────────────────────────────────
   7. RENDER TABLA
────────────────────────────────────────── */
function renderTabla() {
  const filtrados = filtrar();
  const total     = filtrados.length;
  const totalPags = Math.max(1, Math.ceil(total / POR_PAGINA));

  if (paginaActual > totalPags) paginaActual = totalPags;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = filtrados.slice(inicio, inicio + POR_PAGINA);

  tbodyInst.innerHTML = '';

  if (pagina.length === 0) {
    tbodyInst.innerHTML = `
      <tr class="empty-row">
        <td colspan="7">
          <span class="material-symbols-outlined" style="font-size:2rem;display:block;margin:0 auto 8px;color:#cbd5e1">person_search</span>
          No se encontraron instructores con los filtros aplicados.
        </td>
      </tr>`;
  } else {
    pagina.forEach(i => tbodyInst.insertAdjacentHTML('beforeend', crearFila(i)));
  }

  contadorEl.textContent =
    `Mostrando ${Math.min(inicio + 1, total)}–${Math.min(inicio + POR_PAGINA, total)} de ${total} instructor${total !== 1 ? 'es' : ''}`;

  renderPaginacion(totalPags);
  renderMetricas();
}

function crearFila(i) {
  const col   = getColorAvatar(i.area);
  const inic  = getIniciales(i.nombres, i.apellidos);
  const inact = i.estado === 'Inactivo';

  return `
  <tr class="hover:bg-primary/5 transition-colors group ${inact ? 'opacity-60' : ''}" data-id="${i.id}">
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="avatar-iniciales" style="background:${col.bg};color:${col.text}">${inic}</div>
        <div>
          <p class="text-sm font-semibold text-accent-blue dark:text-white">${i.nombres}</p>
          <p class="text-xs text-slate-500">${i.apellidos}</p>
        </div>
      </div>
    </td>
    <td class="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">${i.cedula}</td>
    <td class="px-6 py-4 text-sm text-primary font-medium whitespace-nowrap">${i.correo}</td>
    <td class="px-6 py-4"><span class="badge-area">${i.area}</span></td>
    <td class="px-6 py-4">${badgeRol(i.rol)}</td>
    <td class="px-6 py-4">${badgeEstado(i.estado)}</td>
    <td class="px-6 py-4 text-right">
      <div class="action-btns flex justify-end gap-1">
        <button class="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition-colors btn-ver" data-id="${i.id}" title="Ver perfil">
          <span class="material-symbols-outlined text-lg">visibility</span>
        </button>
        <button class="p-1.5 hover:bg-amber-500/10 text-amber-500 rounded transition-colors btn-editar" data-id="${i.id}" title="Editar">
          <span class="material-symbols-outlined text-lg">edit_note</span>
        </button>
        <button class="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors btn-eliminar" data-id="${i.id}" title="Eliminar">
          <span class="material-symbols-outlined text-lg">person_remove</span>
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
   9. MODAL CREAR / EDITAR
────────────────────────────────────────── */
function abrirModalNuevo() {
  modalTitulo.textContent = 'Nuevo Instructor';
  formInst.reset();
  instId.value = '';
  limpiarErrores();
  modalInst.classList.remove('hidden');
}

function abrirModalEditar(id) {
  const i = instructores.find(x => x.id === id);
  if (!i) return;
  modalTitulo.textContent = 'Editar Instructor';
  instId.value        = i.id;
  instNombres.value   = i.nombres;
  instApellidos.value = i.apellidos;
  instCedula.value    = i.cedula;
  instCorreo.value    = i.correo;
  instTelefono.value  = i.telefono || '';
  instArea.value      = i.area;
  instRol.value       = i.rol;
  instEstado.value    = i.estado;
  limpiarErrores();
  modalInst.classList.remove('hidden');
}

function cerrarModalInst() {
  modalInst.classList.add('hidden');
  formInst.reset();
  limpiarErrores();
}

/* ──────────────────────────────────────────
   10. VALIDACIÓN
────────────────────────────────────────── */
function validar() {
  let ok = true;
  const requeridos = [instNombres, instApellidos, instCedula, instCorreo, instArea, instRol, instEstado];

  requeridos.forEach(campo => {
    const err = campo.nextElementSibling;
    const vacio = !campo.value.trim();
    const correoInvalido = campo === instCorreo && !vacio && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value);

    if (vacio || correoInvalido) {
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
   11. GUARDAR
────────────────────────────────────────── */
formInst.addEventListener('submit', e => {
  e.preventDefault();
  if (!validar()) return;

  const id = instId.value ? parseInt(instId.value, 10) : null;
  const datos = {
    nombres:   instNombres.value.trim(),
    apellidos: instApellidos.value.trim(),
    cedula:    instCedula.value.trim(),
    correo:    instCorreo.value.trim(),
    telefono:  instTelefono.value.trim(),
    area:      instArea.value,
    rol:       instRol.value,
    estado:    instEstado.value,
  };

  if (id) {
    const idx = instructores.findIndex(x => x.id === id);
    instructores[idx] = { ...instructores[idx], ...datos };
    mostrarToast('Instructor actualizado correctamente.', 'check_circle', 'text-primary');
  } else {
    instructores.unshift({ id: nextId++, ...datos });
    paginaActual = 1;
    mostrarToast('Instructor registrado correctamente.', 'person_add', 'text-primary');
  }

  cerrarModalInst();
  renderTabla();
});

/* ──────────────────────────────────────────
   12. VER DETALLE / PERFIL
────────────────────────────────────────── */
function verDetalle(id) {
  const i = instructores.find(x => x.id === id);
  if (!i) return;

  const col  = getColorAvatar(i.area);
  const inic = getIniciales(i.nombres, i.apellidos);

  detalleAvatar.innerHTML = `
    <div class="avatar-lg" style="background:${col.bg};color:${col.text}">${inic}</div>
    <div>
      <p class="text-lg font-bold text-slate-800">${i.nombres} ${i.apellidos}</p>
      <p class="text-sm text-slate-500">${i.correo}</p>
      <div class="mt-1">${badgeRol(i.rol)}</div>
    </div>`;

  detalleContenido.innerHTML = `
    <div class="detalle-row">
      <span class="detalle-label">Identificación</span>
      <span class="detalle-valor font-mono">${i.cedula}</span>
    </div>
    <div class="detalle-row">
      <span class="detalle-label">Teléfono</span>
      <span class="detalle-valor">${i.telefono || '—'}</span>
    </div>
    <div class="detalle-row">
      <span class="detalle-label">Área</span>
      <span class="detalle-valor">${i.area}</span>
    </div>
    <div class="detalle-row">
      <span class="detalle-label">Estado</span>
      <span class="detalle-valor">${badgeEstado(i.estado)}</span>
    </div>`;

  modalDetalle.classList.remove('hidden');
}

/* ──────────────────────────────────────────
   13. ELIMINAR
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
  instructores = instructores.filter(i => i.id !== idAEliminar);
  cerrarModalEliminar();
  renderTabla();
  mostrarToast('Instructor eliminado.', 'person_remove', 'text-red-400');
});

/* ──────────────────────────────────────────
   14. EXPORTAR CSV
────────────────────────────────────────── */
function exportarCSV() {
  const cabecera = ['Nombres', 'Apellidos', 'Cédula', 'Correo', 'Teléfono', 'Área', 'Rol', 'Estado'];
  const filas = instructores.map(i =>
    [i.nombres, i.apellidos, i.cedula, i.correo, i.telefono || '', i.area, i.rol, i.estado].join(',')
  );
  const csv  = [cabecera.join(','), ...filas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'instructores_classcontrol.csv';
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('Reporte exportado correctamente.', 'download', 'text-blue-400');
}

/* ──────────────────────────────────────────
   15. TOAST
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
   16. DELEGACIÓN EN TABLA
────────────────────────────────────────── */
tbodyInst.addEventListener('click', e => {
  const btnVer  = e.target.closest('.btn-ver');
  const btnEdit = e.target.closest('.btn-editar');
  const btnDel  = e.target.closest('.btn-eliminar');
  if (btnVer)  verDetalle(parseInt(btnVer.dataset.id, 10));
  if (btnEdit) abrirModalEditar(parseInt(btnEdit.dataset.id, 10));
  if (btnDel)  abrirModalEliminar(parseInt(btnDel.dataset.id, 10));
});

/* ──────────────────────────────────────────
   17. FILTROS REACTIVOS
────────────────────────────────────────── */
[filtroBusqueda, filtroRol, filtroEstado].forEach(el => {
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
   18. EVENTOS DE MODALES Y BOTONES
────────────────────────────────────────── */
btnNuevo.addEventListener('click', abrirModalNuevo);
btnCerrarModal.addEventListener('click', cerrarModalInst);
btnCancelar.addEventListener('click', cerrarModalInst);
btnCancelarElim.addEventListener('click', cerrarModalEliminar);
btnDescargar.addEventListener('click', exportarCSV);
btnCerrarDetalle.addEventListener('click', () => modalDetalle.classList.add('hidden'));
btnCerrarDetalle2.addEventListener('click', () => modalDetalle.classList.add('hidden'));

modalInst.addEventListener('click', e => { if (e.target === modalInst) cerrarModalInst(); });
modalEliminar.addEventListener('click', e => { if (e.target === modalEliminar) cerrarModalEliminar(); });
modalDetalle.addEventListener('click', e => { if (e.target === modalDetalle) modalDetalle.classList.add('hidden'); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarModalInst();
    cerrarModalEliminar();
    modalDetalle.classList.add('hidden');
  }
});

/* ──────────────────────────────────────────
   19. INICIALIZACIÓN
────────────────────────────────────────── */
renderTabla();

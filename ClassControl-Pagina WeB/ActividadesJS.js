/* ============================================
   actividades.js — ClassControl
   CRUD completo + filtros reactivos + paginación
   ============================================ */

'use strict';

/* ──────────────────────────────────────────
   1. DATOS INICIALES
────────────────────────────────────────── */
let actividades = [
  {
    id: 1,
    codigo: 'ACT-001',
    nombre: 'Taller de Lógica de Programación',
    descripcion: 'Fundamentos de algoritmos y pseudocódigo básico.',
    ficha: '2503452',
    instructor: 'Juan Pérez',
    iniciales: 'JP',
    ambiente: 'Ambiente 102',
    dias: 'Lun - Mar',
    horaInicio: '07:00',
    horaFin: '12:00',
  },
  {
    id: 2,
    codigo: 'ACT-002',
    nombre: 'Desarrollo de Interfaces Web',
    descripcion: 'Maquetación avanzada con HTML5 y CSS Grid.',
    ficha: '2503452',
    instructor: 'Maria García',
    iniciales: 'MG',
    ambiente: 'Laboratorio 4',
    dias: 'Miércoles',
    horaInicio: '13:00',
    horaFin: '18:00',
  },
  {
    id: 3,
    codigo: 'ACT-003',
    nombre: 'Gestión de Bases de Datos',
    descripcion: 'Modelado relacional y sentencias SQL.',
    ficha: '2612980',
    instructor: 'Carlos Ruiz',
    iniciales: 'CR',
    ambiente: 'Ambiente 205',
    dias: 'Jue - Vie',
    horaInicio: '07:00',
    horaFin: '12:00',
  },
];

let nextId = 4;
let paginaActual = 1;
const POR_PAGINA = 5;
let idAEliminar = null;

/* ──────────────────────────────────────────
   2. SELECTORES DOM
────────────────────────────────────────── */
const tbodyActividades   = document.getElementById('tbody-actividades');
const contadorEl         = document.getElementById('contador-actividades');
const paginacionEl       = document.getElementById('paginacion');

const formFiltros        = document.getElementById('form-filtros');
const filtroBusqueda     = document.getElementById('filtro-busqueda');
const filtroFicha        = document.getElementById('filtro-ficha');
const filtroInstructor   = document.getElementById('filtro-instructor');
const filtroDia          = document.getElementById('filtro-dia');
const btnLimpiar         = document.getElementById('btn-limpiar');

const modalActividad     = document.getElementById('modal-actividad');
const modalTitulo        = document.getElementById('modal-titulo');
const formActividad      = document.getElementById('form-actividad');
const actividadId        = document.getElementById('actividad-id');
const actNombre          = document.getElementById('act-nombre');
const actDescripcion     = document.getElementById('act-descripcion');
const actFicha           = document.getElementById('act-ficha');
const actInstructor      = document.getElementById('act-instructor');
const actAmbiente        = document.getElementById('act-ambiente');
const actDias            = document.getElementById('act-dias');
const actHoraInicio      = document.getElementById('act-hora-inicio');
const actHoraFin         = document.getElementById('act-hora-fin');

const btnNuevaActividad  = document.getElementById('btn-nueva-actividad');
const btnCerrarModal     = document.getElementById('btn-cerrar-modal');
const btnCancelar        = document.getElementById('btn-cancelar');

const modalEliminar      = document.getElementById('modal-eliminar');
const btnCancelarElim    = document.getElementById('btn-cancelar-eliminar');
const btnConfirmarElim   = document.getElementById('btn-confirmar-eliminar');

const toast              = document.getElementById('toast');
const toastMsg           = document.getElementById('toast-msg');
const toastIcon          = document.getElementById('toast-icon');

/* ──────────────────────────────────────────
   3. UTILIDADES
────────────────────────────────────────── */

/** Genera iniciales a partir del nombre completo */
function getIniciales(nombre) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');
}

/** Genera el próximo código de actividad */
function generarCodigo() {
  const max = actividades.reduce((m, a) => {
    const n = parseInt(a.codigo.replace('ACT-', ''), 10);
    return n > m ? n : m;
  }, 0);
  return `ACT-${String(max + 1).padStart(3, '0')}`;
}

/** Formatea horario: "07:00 - 12:00" */
function formatHorario(inicio, fin) {
  if (!inicio && !fin) return '—';
  if (!fin) return inicio;
  return `${inicio} - ${fin}`;
}

/* ──────────────────────────────────────────
   4. FILTRADO
────────────────────────────────────────── */
function filtrarActividades() {
  const busq    = filtroBusqueda.value.trim().toLowerCase();
  const ficha   = filtroFicha.value;
  const instr   = filtroInstructor.value;
  const dia     = filtroDia.value.toLowerCase();

  return actividades.filter(a => {
    const matchBusq  = !busq  || a.nombre.toLowerCase().includes(busq)
                              || a.codigo.toLowerCase().includes(busq)
                              || a.descripcion.toLowerCase().includes(busq);
    const matchFicha = !ficha || a.ficha === ficha;
    const matchInstr = !instr || a.instructor === instr;
    const matchDia   = !dia   || a.dias.toLowerCase().includes(dia);
    return matchBusq && matchFicha && matchInstr && matchDia;
  });
}

/* ──────────────────────────────────────────
   5. RENDER TABLA
────────────────────────────────────────── */
function renderTabla() {
  const filtradas = filtrarActividades();
  const total     = filtradas.length;
  const totalPags = Math.max(1, Math.ceil(total / POR_PAGINA));

  // Ajustar página si se pasó de rango
  if (paginaActual > totalPags) paginaActual = totalPags;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = filtradas.slice(inicio, inicio + POR_PAGINA);

  tbodyActividades.innerHTML = '';

  if (pagina.length === 0) {
    tbodyActividades.innerHTML = `
      <tr class="empty-row">
        <td colspan="7">
          <span class="material-symbols-outlined" style="font-size:2rem;display:block;margin:0 auto 8px;color:#cbd5e1">search_off</span>
          No se encontraron actividades con los filtros aplicados.
        </td>
      </tr>`;
  } else {
    pagina.forEach(a => {
      tbodyActividades.insertAdjacentHTML('beforeend', crearFila(a));
    });
  }

  contadorEl.textContent = `Mostrando ${Math.min(inicio + 1, total)}–${Math.min(inicio + POR_PAGINA, total)} de ${total} actividad${total !== 1 ? 'es' : ''}`;
  renderPaginacion(totalPags);
}

function crearFila(a) {
  return `
  <tr class="hover:bg-primary/5 transition-colors group" data-id="${a.id}">
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="bg-primary/10 text-primary-dark font-mono text-xs px-2 py-1 rounded">${a.codigo}</span>
    </td>
    <td class="px-6 py-4">
      <p class="text-sm font-semibold text-accent-blue dark:text-slate-200">${a.nombre}</p>
      <p class="text-xs text-slate-400 truncate max-w-xs">${a.descripcion || '—'}</p>
    </td>
    <td class="px-6 py-4">
      <span class="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
        <span class="material-symbols-outlined text-sm">tag</span> ${a.ficha}
      </span>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">${a.iniciales}</div>
        <span class="text-sm text-slate-600 dark:text-slate-400">${a.instructor}</span>
      </div>
    </td>
    <td class="px-6 py-4">
      <span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
        ${a.ambiente}
      </span>
    </td>
    <td class="px-6 py-4">
      <div class="text-xs leading-relaxed">
        <p class="font-medium text-slate-700 dark:text-slate-300">${a.dias || '—'}</p>
        <p class="text-slate-500 italic">${formatHorario(a.horaInicio, a.horaFin)}</p>
      </div>
    </td>
    <td class="px-6 py-4 text-right">
      <div class="action-btns flex justify-end gap-2">
        <button class="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition-colors btn-ver" data-id="${a.id}" title="Ver detalle">
          <span class="material-symbols-outlined text-lg">visibility</span>
        </button>
        <button class="p-1.5 hover:bg-amber-500/10 text-amber-500 rounded transition-colors btn-editar" data-id="${a.id}" title="Editar">
          <span class="material-symbols-outlined text-lg">edit</span>
        </button>
        <button class="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors btn-eliminar" data-id="${a.id}" title="Eliminar">
          <span class="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </td>
  </tr>`;
}

/* ──────────────────────────────────────────
   6. PAGINACIÓN
────────────────────────────────────────── */
function renderPaginacion(totalPags) {
  paginacionEl.innerHTML = '';

  const btnPrev = crearBtnPag('chevron_left', paginaActual === 1, () => {
    paginaActual--;
    renderTabla();
  }, true);
  paginacionEl.appendChild(btnPrev);

  // Calcular rango visible
  const rango = calcularRango(paginaActual, totalPags);
  rango.forEach(item => {
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
      btn.addEventListener('click', () => {
        paginaActual = item;
        renderTabla();
      });
      paginacionEl.appendChild(btn);
    }
  });

  const btnNext = crearBtnPag('chevron_right', paginaActual === totalPags, () => {
    paginaActual++;
    renderTabla();
  }, true);
  paginacionEl.appendChild(btnNext);
}

function crearBtnPag(icon, disabled, handler, isIcon = false) {
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
   7. MODAL ACTIVIDAD (CREAR / EDITAR)
────────────────────────────────────────── */
function abrirModalNuevo() {
  modalTitulo.textContent = 'Nueva Actividad';
  formActividad.reset();
  actividadId.value = '';
  limpiarErrores();
  modalActividad.classList.remove('hidden');
}

function abrirModalEditar(id) {
  const a = actividades.find(x => x.id === id);
  if (!a) return;

  modalTitulo.textContent = 'Editar Actividad';
  actividadId.value   = a.id;
  actNombre.value     = a.nombre;
  actDescripcion.value= a.descripcion || '';
  actFicha.value      = a.ficha;
  actInstructor.value = a.instructor;
  actAmbiente.value   = a.ambiente;
  actDias.value       = a.dias || '';
  actHoraInicio.value = a.horaInicio || '';
  actHoraFin.value    = a.horaFin || '';

  limpiarErrores();
  modalActividad.classList.remove('hidden');
}

function cerrarModalActividad() {
  modalActividad.classList.add('hidden');
  formActividad.reset();
  limpiarErrores();
}

/* ──────────────────────────────────────────
   8. VALIDACIÓN DEL FORMULARIO
────────────────────────────────────────── */
function validarFormulario() {
  let valido = true;
  const requeridos = [actNombre, actFicha, actInstructor, actAmbiente];

  requeridos.forEach(campo => {
    const errorEl = campo.nextElementSibling;
    if (!campo.value.trim()) {
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
   9. GUARDAR ACTIVIDAD
────────────────────────────────────────── */
formActividad.addEventListener('submit', e => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const id       = actividadId.value ? parseInt(actividadId.value, 10) : null;
  const nombre   = actNombre.value.trim();
  const instrNom = actInstructor.value;

  if (id) {
    // Editar
    const idx = actividades.findIndex(x => x.id === id);
    actividades[idx] = {
      ...actividades[idx],
      nombre,
      descripcion : actDescripcion.value.trim(),
      ficha       : actFicha.value,
      instructor  : instrNom,
      iniciales   : getIniciales(instrNom),
      ambiente    : actAmbiente.value.trim(),
      dias        : actDias.value.trim(),
      horaInicio  : actHoraInicio.value,
      horaFin     : actHoraFin.value,
    };
    mostrarToast('Actividad actualizada correctamente.', 'check_circle', 'text-primary');
  } else {
    // Crear
    const nueva = {
      id         : nextId++,
      codigo     : generarCodigo(),
      nombre,
      descripcion: actDescripcion.value.trim(),
      ficha      : actFicha.value,
      instructor : instrNom,
      iniciales  : getIniciales(instrNom),
      ambiente   : actAmbiente.value.trim(),
      dias       : actDias.value.trim(),
      horaInicio : actHoraInicio.value,
      horaFin    : actHoraFin.value,
    };
    actividades.unshift(nueva);
    paginaActual = 1;
    mostrarToast('Actividad creada correctamente.', 'check_circle', 'text-primary');
  }

  cerrarModalActividad();
  renderTabla();
});

/* ──────────────────────────────────────────
   10. ELIMINAR ACTIVIDAD
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
  actividades = actividades.filter(a => a.id !== idAEliminar);
  cerrarModalEliminar();
  renderTabla();
  mostrarToast('Actividad eliminada.', 'delete', 'text-red-400');
});

/* ──────────────────────────────────────────
   11. VER DETALLE (alerta simple)
────────────────────────────────────────── */
function verDetalle(id) {
  const a = actividades.find(x => x.id === id);
  if (!a) return;
  alert(
    `📋 ${a.codigo} — ${a.nombre}\n\n` +
    `Ficha: ${a.ficha}\n` +
    `Instructor: ${a.instructor}\n` +
    `Ambiente: ${a.ambiente}\n` +
    `Días: ${a.dias || '—'}\n` +
    `Horario: ${formatHorario(a.horaInicio, a.horaFin)}\n\n` +
    `${a.descripcion || 'Sin descripción.'}`
  );
}

/* ──────────────────────────────────────────
   12. TOAST
────────────────────────────────────────── */
let toastTimer = null;

function mostrarToast(msg, icon = 'check_circle', colorClass = 'text-primary') {
  toastMsg.textContent = msg;
  toastIcon.textContent = icon;
  toastIcon.className = `material-symbols-outlined ${colorClass}`;
  toast.classList.remove('hidden');
  toast.classList.add('toast-anim');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

/* ──────────────────────────────────────────
   13. DELEGACIÓN DE EVENTOS EN TABLA
────────────────────────────────────────── */
tbodyActividades.addEventListener('click', e => {
  const btnVer  = e.target.closest('.btn-ver');
  const btnEdit = e.target.closest('.btn-editar');
  const btnDel  = e.target.closest('.btn-eliminar');

  if (btnVer)  verDetalle(parseInt(btnVer.dataset.id, 10));
  if (btnEdit) abrirModalEditar(parseInt(btnEdit.dataset.id, 10));
  if (btnDel)  abrirModalEliminar(parseInt(btnDel.dataset.id, 10));
});

/* ──────────────────────────────────────────
   14. FILTROS REACTIVOS
────────────────────────────────────────── */
[filtroBusqueda, filtroFicha, filtroInstructor, filtroDia].forEach(el => {
  el.addEventListener('input', () => {
    paginaActual = 1;
    renderTabla();
  });
});

// Reset del form de filtros también recarga la tabla
formFiltros.addEventListener('reset', () => {
  // El reset del formulario ocurre antes de este handler en Chrome,
  // pero por seguridad esperamos un tick
  setTimeout(() => {
    paginaActual = 1;
    renderTabla();
  }, 0);
});

/* ──────────────────────────────────────────
   15. EVENTOS MODALES
────────────────────────────────────────── */
btnNuevaActividad.addEventListener('click', abrirModalNuevo);
btnCerrarModal.addEventListener('click', cerrarModalActividad);
btnCancelar.addEventListener('click', cerrarModalActividad);
btnCancelarElim.addEventListener('click', cerrarModalEliminar);

// Cerrar modal al clic en el overlay (fuera del contenedor)
modalActividad.addEventListener('click', e => {
  if (e.target === modalActividad) cerrarModalActividad();
});
modalEliminar.addEventListener('click', e => {
  if (e.target === modalEliminar) cerrarModalEliminar();
});

// Cerrar modales con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarModalActividad();
    cerrarModalEliminar();
  }
});

/* ──────────────────────────────────────────
   16. INICIALIZACIÓN
────────────────────────────────────────── */
renderTabla();

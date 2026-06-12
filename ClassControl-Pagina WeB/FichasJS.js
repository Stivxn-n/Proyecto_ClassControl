/* ============================================================
   ClassControl — Gestión de Fichas
   fichas.js
   ============================================================ */

"use strict";

/* ══════════════════════════════════════════════════
   DATA STORE
══════════════════════════════════════════════════ */
const fichas = [
  {
    id: 1, codigo: "2560342",
    programa: "Análisis y Desarrollo de Software",
    nivel: "Tecnólogo", sede: "Sede Central",
    fechaInicio: "2024-01-02", fechaFin: "2025-12-15",
    modalidad: "Presencial", aprendices: 28,
    estado: "Activa", notas: ""
  },
  {
    id: 2, codigo: "2451980",
    programa: "Gestión Contable y Financiera",
    nivel: "Técnico", sede: "Sede Norte",
    fechaInicio: "2023-06-15", fechaFin: "2024-06-14",
    modalidad: "Virtual", aprendices: 45,
    estado: "En proceso", notas: ""
  },
  {
    id: 3, codigo: "2304112",
    programa: "Mantenimiento de Motores Diesel",
    nivel: "Técnico", sede: "Centro Industrial",
    fechaInicio: "2022-02-20", fechaFin: "2023-02-19",
    modalidad: "Presencial", aprendices: 22,
    estado: "Finalizada", notas: ""
  },
  {
    id: 4, codigo: "2670221",
    programa: "Producción Multimedia",
    nivel: "Tecnólogo", sede: "Sede Central",
    fechaInicio: "2024-05-10", fechaFin: "2026-05-09",
    modalidad: "Distancia", aprendices: 32,
    estado: "Activa", notas: ""
  },
];

let nextId     = fichas.length + 1;
const PER_PAGE = 4;
let currentPage = 1;
let filtered    = [...fichas];

/* ══════════════════════════════════════════════════
   DOM HELPERS
══════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════
   RENDERING
══════════════════════════════════════════════════ */
function renderTable() {
  const tbody = $("#fichas-tbody");
  const start = (currentPage - 1) * PER_PAGE;
  const page  = filtered.slice(start, start + PER_PAGE);

  tbody.innerHTML = page.length
    ? page.map(rowHTML).join("")
    : `<tr><td colspan="7" class="px-6 py-10 text-center text-slate-400 text-sm">
         No se encontraron fichas con los filtros actuales.
       </td></tr>`;

  // attach row events
  page.forEach(f => {
    $(`[data-view="${f.id}"]`)?.addEventListener("click", () => openDetail(f.id));
    $(`[data-edit="${f.id}"]`)?.addEventListener("click", () => openEdit(f.id));
    $(`[data-del="${f.id}"]`)?.addEventListener("click",  () => openConfirm(f.id));
  });

  renderPagination();
  updateCount();
}

function rowHTML(f) {
  const modalidadChip = {
    Presencial: `<span class="chip chip--presencial">
                   <span class="material-symbols-outlined text-sm">home</span>Presencial</span>`,
    Virtual:    `<span class="chip chip--virtual">
                   <span class="material-symbols-outlined text-sm">laptop</span>Virtual</span>`,
    Distancia:  `<span class="chip chip--distancia">
                   <span class="material-symbols-outlined text-sm">directions_walk</span>Distancia</span>`,
  }[f.modalidad] ?? f.modalidad;

  const estadoBadge = {
    "Activa":     `<span class="badge badge--active">Activa</span>`,
    "En proceso": `<span class="badge badge--process">En proceso</span>`,
    "Finalizada": `<span class="badge badge--finished">Finalizada</span>`,
  }[f.estado] ?? f.estado;

  return `
    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td class="px-6 py-4 font-mono text-sm text-primary font-bold">${f.codigo}</td>
      <td class="px-6 py-4">
        <div class="flex flex-col">
          <span class="font-semibold text-slate-800 dark:text-slate-100">${f.programa}</span>
          <span class="text-xs text-slate-500">${f.nivel} • ${f.sede}</span>
        </div>
      </td>
      <td class="px-6 py-4 text-sm text-center">
        <div class="flex flex-col">
          <span class="text-slate-700 dark:text-slate-300">${formatDate(f.fechaInicio)}</span>
          <span class="text-xs text-slate-400">a ${formatDate(f.fechaFin)}</span>
        </div>
      </td>
      <td class="px-6 py-4">${modalidadChip}</td>
      <td class="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">${f.aprendices}</td>
      <td class="px-6 py-4">${estadoBadge}</td>
      <td class="px-6 py-4 text-right">
        <div class="flex justify-end gap-1">
          <button class="action-btn action-btn--view" data-view="${f.id}" title="Ver detalles">
            <span class="material-symbols-outlined text-xl">visibility</span>
          </button>
          <button class="action-btn action-btn--edit" data-edit="${f.id}" title="Editar">
            <span class="material-symbols-outlined text-xl">edit</span>
          </button>
          <button class="action-btn action-btn--delete" data-del="${f.id}" title="Eliminar">
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </td>
    </tr>`;
}

/* ── Pagination ── */
function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const container  = $("#pagination-btns");
  container.innerHTML = "";

  // Prev
  const prev = paginBtn("chevron_left", true);
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", () => changePage(currentPage - 1));
  container.appendChild(prev);

  for (let p = 1; p <= totalPages; p++) {
    const btn = document.createElement("button");
    btn.textContent = p;
    btn.className = `px-3 py-1.5 rounded border text-sm transition-all
      ${p === currentPage
        ? "bg-primary text-white font-bold border-primary"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`;
    btn.addEventListener("click", () => changePage(p));
    container.appendChild(btn);
  }

  // Next
  const next = paginBtn("chevron_right", false);
  next.disabled = currentPage === totalPages;
  next.addEventListener("click", () => changePage(currentPage + 1));
  container.appendChild(next);
}

function paginBtn(icon, isLeft) {
  const btn = document.createElement("button");
  btn.className = `px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700
    bg-white dark:bg-slate-900 text-slate-400 hover:text-primary transition-all disabled:opacity-40`;
  btn.innerHTML = `<span class="material-symbols-outlined text-sm leading-none">${icon}</span>`;
  return btn;
}

function changePage(p) {
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  currentPage = Math.min(Math.max(1, p), total);
  renderTable();
}

function updateCount() {
  $("#count-showing").textContent = Math.min(filtered.length, (currentPage - 1) * PER_PAGE + PER_PAGE) - (currentPage - 1) * PER_PAGE;
  $("#count-total").textContent   = filtered.length;
}

/* ── Date helper ── */
function formatDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/* ══════════════════════════════════════════════════
   SEARCH & FILTER
══════════════════════════════════════════════════ */
function applyFilters() {
  const q      = $("#search-input").value.toLowerCase().trim();
  const estado = $("#filter-estado").value;
  const modal  = $("#filter-modalidad").value;
  const sede   = $("#filter-sede").value;

  filtered = fichas.filter(f => {
    const matchQ = !q || f.codigo.includes(q) || f.programa.toLowerCase().includes(q) || f.sede.toLowerCase().includes(q);
    const matchE = !estado || f.estado === estado;
    const matchM = !modal  || f.modalidad === modal;
    const matchS = !sede   || f.sede === sede;
    return matchQ && matchE && matchM && matchS;
  });

  currentPage = 1;
  renderTable();
}

$("#search-input").addEventListener("input", applyFilters);
$("#filter-estado").addEventListener("change", applyFilters);
$("#filter-modalidad").addEventListener("change", applyFilters);
$("#filter-sede").addEventListener("change", applyFilters);

/* ══════════════════════════════════════════════════
   MODAL — NUEVA / EDITAR FICHA
══════════════════════════════════════════════════ */
const formModal   = $("#modal-form-overlay");
const formTitle   = $("#form-modal-title");
const fichaForm   = $("#ficha-form");
const btnDel      = $("#btn-form-delete");

let editingId = null;

function openNew() {
  editingId = null;
  formTitle.textContent = "Nueva Ficha";
  fichaForm.reset();
  btnDel.classList.add("hidden");
  formModal.classList.add("open");
}

function openEdit(id) {
  const f = fichas.find(x => x.id === id);
  if (!f) return;
  editingId = id;
  formTitle.textContent = "Editar Ficha";
  btnDel.classList.remove("hidden");

  $("#f-codigo").value     = f.codigo;
  $("#f-programa").value   = f.programa;
  $("#f-nivel").value      = f.nivel;
  $("#f-sede").value       = f.sede;
  $("#f-inicio").value     = f.fechaInicio;
  $("#f-fin").value        = f.fechaFin;
  $("#f-modalidad").value  = f.modalidad;
  $("#f-aprendices").value = f.aprendices;
  $("#f-estado").value     = f.estado;
  $("#f-notas").value      = f.notas ?? "";

  formModal.classList.add("open");
}

fichaForm.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    codigo:     $("#f-codigo").value.trim(),
    programa:   $("#f-programa").value.trim(),
    nivel:      $("#f-nivel").value,
    sede:       $("#f-sede").value,
    fechaInicio:$("#f-inicio").value,
    fechaFin:   $("#f-fin").value,
    modalidad:  $("#f-modalidad").value,
    aprendices: parseInt($("#f-aprendices").value) || 0,
    estado:     $("#f-estado").value,
    notas:      $("#f-notas").value.trim(),
  };

  if (!data.codigo || !data.programa) {
    showToast("Completa los campos obligatorios.", "error");
    return;
  }

  if (editingId !== null) {
    const idx = fichas.findIndex(x => x.id === editingId);
    if (idx > -1) fichas[idx] = { id: editingId, ...data };
    showToast("Ficha actualizada ✓");
  } else {
    fichas.push({ id: nextId++, ...data });
    showToast("Ficha creada ✓");
  }

  closeFormModal();
  applyFilters();
});

btnDel.addEventListener("click", () => {
  closeFormModal();
  openConfirm(editingId);
});

function closeFormModal() { formModal.classList.remove("open"); }

$("#btn-close-form").addEventListener("click",  closeFormModal);
$("#btn-cancel-form").addEventListener("click", closeFormModal);
formModal.addEventListener("click", e => { if (e.target === formModal) closeFormModal(); });

/* ══════════════════════════════════════════════════
   MODAL — DETALLE (read-only)
══════════════════════════════════════════════════ */
const detailModal = $("#modal-detail-overlay");

function openDetail(id) {
  const f = fichas.find(x => x.id === id);
  if (!f) return;

  const modalidadIcon = { Presencial: "home", Virtual: "laptop", Distancia: "directions_walk" }[f.modalidad] ?? "help";

  $("#detail-content").innerHTML = `
    <div class="detail-row"><span class="detail-label">Código</span><span class="detail-value font-mono text-primary">${f.codigo}</span></div>
    <div class="detail-row"><span class="detail-label">Programa</span><span class="detail-value">${f.programa}</span></div>
    <div class="detail-row"><span class="detail-label">Nivel</span><span class="detail-value">${f.nivel}</span></div>
    <div class="detail-row"><span class="detail-label">Sede</span><span class="detail-value">${f.sede}</span></div>
    <div class="detail-row grid grid-cols-2">
      <div><span class="detail-label">Inicio</span><span class="detail-value block">${formatDate(f.fechaInicio)}</span></div>
      <div><span class="detail-label">Fin</span><span class="detail-value block">${formatDate(f.fechaFin)}</span></div>
    </div>
    <div class="detail-row"><span class="detail-label">Modalidad</span>
      <span class="detail-value flex items-center gap-1">
        <span class="material-symbols-outlined text-sm">${modalidadIcon}</span>${f.modalidad}
      </span>
    </div>
    <div class="detail-row"><span class="detail-label">Aprendices</span><span class="detail-value">${f.aprendices}</span></div>
    <div class="detail-row"><span class="detail-label">Estado</span><span class="detail-value">${f.estado}</span></div>
    ${f.notas ? `<div class="detail-row"><span class="detail-label">Notas</span><span class="detail-value text-slate-500 text-sm">${f.notas}</span></div>` : ""}
  `;

  detailModal.classList.add("open");
}

function closeDetailModal() { detailModal.classList.remove("open"); }

$("#btn-close-detail").addEventListener("click", closeDetailModal);
detailModal.addEventListener("click", e => { if (e.target === detailModal) closeDetailModal(); });

/* ══════════════════════════════════════════════════
   CONFIRM DELETE
══════════════════════════════════════════════════ */
const confirmModal = $("#modal-confirm-overlay");
let deletingId     = null;

function openConfirm(id) {
  deletingId = id;
  const f = fichas.find(x => x.id === id);
  if (f) $("#confirm-ficha-name").textContent = `${f.codigo} — ${f.programa}`;
  confirmModal.classList.add("open");
}

function closeConfirm() { confirmModal.classList.remove("open"); }

$("#btn-confirm-delete").addEventListener("click", () => {
  const idx = fichas.findIndex(x => x.id === deletingId);
  if (idx > -1) fichas.splice(idx, 1);
  closeConfirm();
  applyFilters();
  showToast("Ficha eliminada", "error");
});

$("#btn-cancel-delete").addEventListener("click", closeConfirm);
confirmModal.addEventListener("click", e => { if (e.target === confirmModal) closeConfirm(); });

/* ══════════════════════════════════════════════════
   DARK MODE
══════════════════════════════════════════════════ */
$("#btn-dark-toggle")?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

/* ══════════════════════════════════════════════════
   NUEVA FICHA BUTTON
══════════════════════════════════════════════════ */
$("#btn-new-ficha").addEventListener("click", openNew);

/* ══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
const toastEl = $("#toast");
let toastTimer;

function showToast(msg, type = "success") {
  toastEl.textContent = msg;
  toastEl.style.background = type === "error" ? "#dc2626" : "#38a800";
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
}

/* ══════════════════════════════════════════════════
   KEYBOARD
══════════════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeFormModal();
    closeDetailModal();
    closeConfirm();
  }
});

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
applyFilters();

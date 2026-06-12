/* ===========================
   ClassControl – ambientes.js
   =========================== */

"use strict";

/* ══════════════════════════════════════════════════
   DATOS (simulan lo que vendría de una API/BD)
══════════════════════════════════════════════════ */
const ambientesData = [
  { id: 1, nombre: "Ambiente 402",       ubicacion: "Torre A - Piso 4",    sede: "Sede Central", capacidad: 35,  tipo: "Aula Polivalente", estado: "disponible", icon: "meeting_room" },
  { id: 2, nombre: "Laboratorio TIC 02", ubicacion: "Bloque 2 - Piso 1",   sede: "Sede TIC",     capacidad: 25,  tipo: "Laboratorio",      estado: "ocupado",     icon: "biotech" },
  { id: 3, nombre: "Auditorio Principal",ubicacion: "Entrada Central",      sede: "Sede Central", capacidad: 120, tipo: "Auditorio",        estado: "mantenimiento",icon: "stadium" },
  { id: 4, nombre: "Ambiente 105",       ubicacion: "Torre B - Piso 1",    sede: "Sede Central", capacidad: 30,  tipo: "Aula Polivalente", estado: "disponible", icon: "meeting_room" },
];

const ITEMS_PER_PAGE = 4;
let currentPage     = 1;
let filteredData    = [...ambientesData];
let editingId       = null;

/* ══════════════════════════════════════════════════
   DARK MODE
══════════════════════════════════════════════════ */
const darkToggle = document.getElementById("dark-toggle");
const html       = document.documentElement;

function applyTheme(isDark) {
  html.classList.toggle("dark", isDark);
  if (darkToggle) {
    darkToggle.querySelector(".material-symbols-outlined").textContent =
      isDark ? "light_mode" : "dark_mode";
  }
}

(function initTheme() {
  const saved = localStorage.getItem("cc-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "dark" : prefersDark);
})();

darkToggle?.addEventListener("click", () => {
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("cc-theme", isDark ? "dark" : "light");
  applyTheme(isDark);
});

/* ══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
const toastContainer = document.getElementById("toast-container");

function showToast(message, type = "success", duration = 3500) {
  const icons = { success: "check_circle", error: "error", info: "info" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size:1.1rem">${icons[type] ?? "info"}</span>
    <span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, duration);
}

/* ══════════════════════════════════════════════════
   MODAL ENGINE
══════════════════════════════════════════════════ */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("open");
  setTimeout(() => el.querySelector("input, select, textarea")?.focus(), 50);
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("open");
  el.querySelectorAll("form").forEach(f => {
    f.reset();
    f.querySelectorAll(".form-control").forEach(fc => fc.classList.remove("is-invalid"));
  });
  editingId = null;
}

// Close on overlay click
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close on Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.open").forEach(m => closeModal(m.id));
  }
});

// Wire data-modal-open / data-modal-close attributes
document.querySelectorAll("[data-modal-open]").forEach(btn =>
  btn.addEventListener("click", () => openModal(btn.dataset.modalOpen))
);
document.querySelectorAll("[data-modal-close]").forEach(btn =>
  btn.addEventListener("click", () => closeModal(btn.dataset.modalClose))
);

/* ══════════════════════════════════════════════════
   FORM VALIDATION
══════════════════════════════════════════════════ */
function validateField(input) {
  const value = input.value.trim();
  let valid = true;
  if (input.required && value === "") valid = false;
  if (input.type === "number" && value) {
    const n = Number(value);
    if (input.min && n < Number(input.min)) valid = false;
    if (input.max && n > Number(input.max)) valid = false;
  }
  input.classList.toggle("is-invalid", !valid);
  return valid;
}

function validateForm(formEl) {
  let ok = true;
  formEl.querySelectorAll(".form-control[required]").forEach(inp => {
    if (!validateField(inp)) ok = false;
  });
  return ok;
}

document.querySelectorAll(".form-control").forEach(input => {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) validateField(input);
  });
});

/* ══════════════════════════════════════════════════
   RENDER TABLE
══════════════════════════════════════════════════ */
function estadoHTML(estado) {
  const map = {
    disponible:    `<span class="status-dot"><span class="dot dot-green"></span><span style="color:var(--primary)">Disponible</span></span>`,
    ocupado:       `<span class="status-dot"><span class="dot dot-amber"></span><span style="color:#f59e0b">Ocupado (Clase)</span></span>`,
    mantenimiento: `<span class="status-dot"><span class="dot dot-slate"></span><span style="color:#94a3b8">Mantenimiento</span></span>`,
    inhabilitado:  `<span class="status-dot"><span class="dot dot-red"></span><span style="color:#ef4444">Inhabilitado</span></span>`,
  };
  return map[estado] ?? estado;
}

function tipoBadge(tipo) {
  const map = {
    "Laboratorio":      "badge-purple",
    "Aula Polivalente": "badge-blue",
    "Auditorio":        "badge-rose",
    "Taller":           "badge-amber",
  };
  return `<span class="badge ${map[tipo] ?? 'badge-slate'}">${tipo}</span>`;
}

function renderTable() {
  const tbody = document.getElementById("ambientes-tbody");
  if (!tbody) return;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const slice = filteredData.slice(start, start + ITEMS_PER_PAGE);

  if (slice.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">
      <span class="material-symbols-outlined" style="font-size:2rem;display:block;margin-bottom:.5rem">search_off</span>
      No se encontraron ambientes
    </td></tr>`;
    return;
  }

  tbody.innerHTML = slice.map(a => `
    <tr data-id="${a.id}">
      <td>
        <div class="amb-cell">
          <div class="amb-icon"><span class="material-symbols-outlined">${a.icon}</span></div>
          <div>
            <p class="amb-name">${a.nombre}</p>
            <p class="amb-sub">${a.ubicacion}</p>
          </div>
        </div>
      </td>
      <td><span style="font-size:.875rem;color:var(--text-muted);font-weight:500">${a.sede}</span></td>
      <td class="text-center">
        <div style="display:flex;flex-direction:column;align-items:center">
          <span style="font-weight:700">${a.capacidad}</span>
          <span style="font-size:.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em">Personas</span>
        </div>
      </td>
      <td>${tipoBadge(a.tipo)}</td>
      <td>${estadoHTML(a.estado)}</td>
      <td class="text-right">
        <button class="action-btn edit" onclick="openEdit(${a.id})" title="Editar">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="action-btn delete" onclick="openDelete(${a.id})" title="Eliminar">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </td>
    </tr>`).join("");

  renderPagination();
  updateStats();
}

/* ══════════════════════════════════════════════════
   PAGINATION
══════════════════════════════════════════════════ */
function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const start = Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredData.length);
  const end   = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);

  const info = document.getElementById("pagination-info");
  if (info) info.textContent = `Mostrando ${start}–${end} de ${filteredData.length} ambientes`;

  const btnsEl = document.getElementById("pagination-btns");
  if (!btnsEl) return;

  let html = `
    <button class="page-btn" id="prev-page" ${currentPage === 1 ? "disabled" : ""} onclick="goPage(${currentPage - 1})">
      <span class="material-symbols-outlined">chevron_left</span>
    </button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }

  html += `
    <button class="page-btn" ${currentPage === totalPages ? "disabled" : ""} onclick="goPage(${currentPage + 1})">
      <span class="material-symbols-outlined">chevron_right</span>
    </button>`;

  btnsEl.innerHTML = html;
}

function goPage(p) {
  const total = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  if (p < 1 || p > total) return;
  currentPage = p;
  renderTable();
}

/* ══════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════ */
function updateStats() {
  const total       = ambientesData.length;
  const capacidad   = ambientesData.reduce((s, a) => s + a.capacidad, 0);
  const disponibles = ambientesData.filter(a => a.estado === "disponible").length;
  const mant        = ambientesData.filter(a => a.estado === "mantenimiento").length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("stat-total",      total);
  set("stat-capacidad",  capacidad);
  set("stat-disponibles",disponibles);
  set("stat-mant",       mant);
}

/* ══════════════════════════════════════════════════
   SEARCH + FILTERS
══════════════════════════════════════════════════ */
function applyFilters() {
  const q    = (document.getElementById("search-input")?.value ?? "").toLowerCase().trim();
  const sede = document.getElementById("filter-sede")?.value ?? "";
  const tipo = document.getElementById("filter-tipo")?.value ?? "";
  const est  = document.getElementById("filter-estado")?.value ?? "";

  filteredData = ambientesData.filter(a => {
    const matchQ    = !q    || a.nombre.toLowerCase().includes(q) || a.ubicacion.toLowerCase().includes(q);
    const matchSede = !sede || a.sede === sede;
    const matchTipo = !tipo || a.tipo === tipo;
    const matchEst  = !est  || a.estado === est;
    return matchQ && matchSede && matchTipo && matchEst;
  });

  currentPage = 1;
  renderTable();
}

document.getElementById("search-input")?.addEventListener("input", applyFilters);
document.getElementById("filter-sede")?.addEventListener("change", applyFilters);
document.getElementById("filter-tipo")?.addEventListener("change", applyFilters);
document.getElementById("filter-estado")?.addEventListener("change", applyFilters);

document.getElementById("btn-limpiar")?.addEventListener("click", () => {
  ["filter-sede","filter-tipo","filter-estado"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const si = document.getElementById("search-input");
  if (si) si.value = "";
  applyFilters();
  showToast("Filtros limpiados", "info");
});

/* ══════════════════════════════════════════════════
   CREAR / EDITAR AMBIENTE
══════════════════════════════════════════════════ */
document.getElementById("form-ambiente")?.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateForm(e.target)) { showToast("Completa los campos requeridos", "error"); return; }

  const get = id => document.getElementById(id)?.value.trim() ?? "";

  const datos = {
    nombre:    get("amb-nombre"),
    ubicacion: get("amb-ubicacion"),
    sede:      get("amb-sede"),
    capacidad: parseInt(get("amb-capacidad"), 10),
    tipo:      get("amb-tipo"),
    estado:    get("amb-estado"),
    icon:      iconForTipo(get("amb-tipo")),
  };

  if (editingId !== null) {
    const idx = ambientesData.findIndex(a => a.id === editingId);
    if (idx !== -1) { ambientesData[idx] = { ...ambientesData[idx], ...datos }; }
    showToast(`"${datos.nombre}" actualizado correctamente`);
  } else {
    const newId = Math.max(0, ...ambientesData.map(a => a.id)) + 1;
    ambientesData.push({ id: newId, ...datos });
    showToast(`"${datos.nombre}" registrado correctamente`);
  }

  applyFilters();
  closeModal("modal-ambiente");
});

function iconForTipo(tipo) {
  const m = { "Laboratorio": "biotech", "Auditorio": "stadium", "Taller": "build" };
  return m[tipo] ?? "meeting_room";
}

function openEdit(id) {
  const a = ambientesData.find(x => x.id === id);
  if (!a) return;
  editingId = id;

  // Populate modal title
  const title = document.getElementById("modal-ambiente-title");
  if (title) title.textContent = "Editar Ambiente";

  // Populate fields
  const set = (fieldId, val) => { const el = document.getElementById(fieldId); if (el) el.value = val; };
  set("amb-nombre",    a.nombre);
  set("amb-ubicacion", a.ubicacion);
  set("amb-sede",      a.sede);
  set("amb-capacidad", a.capacidad);
  set("amb-tipo",      a.tipo);
  set("amb-estado",    a.estado);

  openModal("modal-ambiente");
}

// Reset modal title when opening for new
document.querySelector("[data-modal-open='modal-ambiente']")?.addEventListener("click", () => {
  const title = document.getElementById("modal-ambiente-title");
  if (title) title.textContent = "Nuevo Ambiente";
});

/* ══════════════════════════════════════════════════
   ELIMINAR AMBIENTE
══════════════════════════════════════════════════ */
let deleteTargetId = null;

function openDelete(id) {
  const a = ambientesData.find(x => x.id === id);
  if (!a) return;
  deleteTargetId = id;
  const msg = document.getElementById("delete-msg");
  if (msg) msg.textContent = `¿Eliminar "${a.nombre}"? Esta acción no se puede deshacer.`;
  openModal("modal-confirmar");
}

document.getElementById("btn-confirmar-delete")?.addEventListener("click", () => {
  if (deleteTargetId === null) return;
  const idx = ambientesData.findIndex(a => a.id === deleteTargetId);
  const nombre = ambientesData[idx]?.nombre ?? "Ambiente";
  if (idx !== -1) ambientesData.splice(idx, 1);
  deleteTargetId = null;
  applyFilters();
  closeModal("modal-confirmar");
  showToast(`"${nombre}" eliminado`, "info");
});

/* ══════════════════════════════════════════════════
   COUNTER ANIMATION (stats)
══════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 700) {
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  renderTable();

  // Animate stat counters
  document.querySelectorAll("[data-count]").forEach(el => {
    animateCounter(el, parseInt(el.dataset.count, 10));
  });
});

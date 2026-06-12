/* ============================================================
   ClassControl — Programación de Instructores
   app.js
   ============================================================ */

"use strict";

/* ── Data store (in-memory) ─────────────────────────────────── */
const COLOR_VARIANTS = ["green", "blue", "orange", "purple"];

const schedule = [
  { id: 1, subject: "Programación Web",    instructor: "Juan Pérez",    ficha: "2501234", ambiente: "201",     day: 0, slot: 0, color: "green"  },
  { id: 2, subject: "Inglés Técnico",      instructor: "Martha Ruiz",   ficha: "2501236", ambiente: "105",     day: 2, slot: 0, color: "blue"   },
  { id: 3, subject: "Análisis de Datos",   instructor: "Maria Soto",    ficha: "2501235", ambiente: "202",     day: 1, slot: 1, color: "orange" },
  { id: 4, subject: "Lógica de Programación", instructor: "Carlos Díaz", ficha: "2501237", ambiente: "Lab 3",  day: 3, slot: 1, color: "green"  },
  { id: 5, subject: "Ética Integral",      instructor: "Carlos Ruiz",   ficha: "2501236", ambiente: "105",     day: 2, slot: 2, color: "purple" },
  { id: 6, subject: "Taller Práctico",     instructor: "Roberto Díaz",  ficha: "2501238", ambiente: "Taller A",day: 4, slot: 2, color: "green"  },
];

let nextId = schedule.length + 1;

/* ── DOM helpers ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Calendar rendering ──────────────────────────────────────── */
/**
 * Slot index → time label mapping
 * 0 = 07:00 AM, 1 = 10:00 AM, 2 = 02:00 PM
 */
const SLOT_TIMES = ["07:00 AM", "10:00 AM", "02:00 PM"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function renderCalendar(data = schedule) {
  const body = $("#calendar-body");
  if (!body) return;
  body.innerHTML = "";

  SLOT_TIMES.forEach((time, slotIdx) => {
    const row = document.createElement("div");
    row.className = "calendar-grid border-b border-slate-100 dark:border-slate-800 h-40";

    // Time label
    const timeCell = document.createElement("div");
    timeCell.className = "p-4 text-[11px] font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800 text-right";
    timeCell.textContent = time;
    row.appendChild(timeCell);

    // Day columns
    DAYS.forEach((_, dayIdx) => {
      const cell = document.createElement("div");
      const isLast = dayIdx === DAYS.length - 1;
      cell.className = `p-2 ${isLast ? "" : "border-r"} border-slate-100 dark:border-slate-800`;

      const entry = data.find(e => e.day === dayIdx && e.slot === slotIdx);
      if (entry) {
        cell.innerHTML = buildCardHTML(entry);
        cell.querySelector(".schedule-card").addEventListener("click", () => openEditModal(entry.id));
      }
      row.appendChild(cell);
    });

    // Receso after last time-slot
    body.appendChild(row);

    if (slotIdx === 0) {
      body.appendChild(buildRecesoRow());
    }
  });
}

function buildCardHTML(entry) {
  return `
    <div class="schedule-card schedule-card--${entry.color}" data-id="${entry.id}">
      <h4 class="text-xs font-bold mb-1 truncate">${entry.subject}</h4>
      <p class="text-[10px] font-medium">Inst: ${entry.instructor}</p>
      <div class="mt-2 flex flex-col gap-1">
        <span class="flex items-center gap-1 text-[10px] opacity-70">
          <span class="material-symbols-outlined text-[12px]">fingerprint</span> Ficha: ${entry.ficha}
        </span>
        <span class="flex items-center gap-1 text-[10px] opacity-70">
          <span class="material-symbols-outlined text-[12px]">room</span> Amb: ${entry.ambiente}
        </span>
      </div>
    </div>`;
}

function buildRecesoRow() {
  const row = document.createElement("div");
  row.className = "calendar-grid border-b border-slate-100 dark:border-slate-800 h-12 bg-slate-50/50 dark:bg-slate-800/30";
  row.innerHTML = `
    <div class="p-2 text-[10px] font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800 text-right italic">Receso</div>
    <div class="col-span-6 flex items-center justify-center">
      <div class="h-[1px] w-full border-t border-dashed border-slate-300 dark:border-slate-700 mx-4"></div>
    </div>`;
  return row;
}

/* ── Search / filter ─────────────────────────────────────────── */
function filterSchedule(query) {
  if (!query.trim()) return renderCalendar(schedule);
  const q = query.toLowerCase();
  const filtered = schedule.filter(e =>
    e.subject.toLowerCase().includes(q) ||
    e.instructor.toLowerCase().includes(q) ||
    e.ficha.includes(q)
  );
  renderCalendar(filtered);
}

/* ── Modal (Nueva Programación & Editar) ─────────────────────── */
const modal          = $("#modal-overlay");
const modalTitle     = $("#modal-title");
const form           = $("#scheduling-form");
const btnCloseModal  = $("#btn-close-modal");
const btnCancelModal = $("#btn-cancel-modal");
const btnDelete      = $("#btn-delete");

let editingId = null; // null = new, number = edit

function openNewModal() {
  editingId = null;
  modalTitle.textContent = "Nueva Programación";
  form.reset();
  btnDelete.classList.add("hidden");
  modal.classList.add("open");
}

function openEditModal(id) {
  const entry = schedule.find(e => e.id === id);
  if (!entry) return;

  editingId = id;
  modalTitle.textContent = "Editar Programación";
  btnDelete.classList.remove("hidden");

  // Populate form
  $("#field-subject").value     = entry.subject;
  $("#field-instructor").value  = entry.instructor;
  $("#field-ficha").value       = entry.ficha;
  $("#field-ambiente").value    = entry.ambiente;
  $("#field-day").value         = entry.day;
  $("#field-slot").value        = entry.slot;
  $("#field-color").value       = entry.color;

  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
}

/* Form submission */
form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    subject:     $("#field-subject").value.trim(),
    instructor:  $("#field-instructor").value.trim(),
    ficha:       $("#field-ficha").value.trim(),
    ambiente:    $("#field-ambiente").value.trim(),
    day:         parseInt($("#field-day").value),
    slot:        parseInt($("#field-slot").value),
    color:       $("#field-color").value,
  };

  if (!data.subject || !data.instructor) {
    showToast("Por favor completa los campos requeridos.", "error");
    return;
  }

  if (editingId !== null) {
    // Update existing
    const idx = schedule.findIndex(e => e.id === editingId);
    if (idx > -1) schedule[idx] = { id: editingId, ...data };
    showToast("Programación actualizada ✓");
  } else {
    // Create new
    schedule.push({ id: nextId++, ...data });
    showToast("Programación creada ✓");
  }

  closeModal();
  renderCalendar(schedule);
});

/* Delete */
btnDelete.addEventListener("click", () => {
  if (editingId === null) return;
  const idx = schedule.findIndex(e => e.id === editingId);
  if (idx > -1) schedule.splice(idx, 1);
  closeModal();
  renderCalendar(schedule);
  showToast("Programación eliminada", "error");
});

/* Close triggers */
btnCloseModal.addEventListener("click",  closeModal);
btnCancelModal.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ── Toast ───────────────────────────────────────────────────── */
const toast = $("#toast");
let toastTimer;

function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.style.background = type === "error" ? "#dc2626" : "#38a800";
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ── View toggle (Calendar / Lista) ─────────────────────────── */
const btnCalendar    = $("#btn-view-calendar");
const btnList        = $("#btn-view-list");
const calendarView   = $("#calendar-view");
const listView       = $("#list-view");

function activateView(view) {
  if (view === "calendar") {
    calendarView.classList.remove("hidden");
    listView.classList.add("hidden");
    btnCalendar.classList.add("bg-white", "dark:bg-slate-700", "shadow-sm", "text-primary");
    btnList.classList.remove("bg-white", "dark:bg-slate-700", "shadow-sm", "text-primary");
  } else {
    listView.classList.remove("hidden");
    calendarView.classList.add("hidden");
    renderListView();
    btnList.classList.add("bg-white", "dark:bg-slate-700", "shadow-sm", "text-primary");
    btnCalendar.classList.remove("bg-white", "dark:bg-slate-700", "shadow-sm", "text-primary");
  }
}

function renderListView() {
  const tbody = $("#list-tbody");
  tbody.innerHTML = schedule.map(e => `
    <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
      <td class="py-3 px-4 text-sm font-semibold">${e.subject}</td>
      <td class="py-3 px-4 text-sm">${e.instructor}</td>
      <td class="py-3 px-4 text-sm">${DAYS[e.day]}</td>
      <td class="py-3 px-4 text-sm">${SLOT_TIMES[e.slot]}</td>
      <td class="py-3 px-4 text-sm">${e.ficha}</td>
      <td class="py-3 px-4 text-sm">${e.ambiente}</td>
      <td class="py-3 px-4 text-sm">
        <button onclick="openEditModal(${e.id})"
          class="text-primary hover:underline font-medium text-xs">Editar</button>
      </td>
    </tr>`).join("");
}

btnCalendar.addEventListener("click", () => activateView("calendar"));
btnList.addEventListener("click",     () => activateView("list"));

/* ── Search input ────────────────────────────────────────────── */
$("#search-input").addEventListener("input", e => filterSchedule(e.target.value));

/* ── "Nueva Programación" button ─────────────────────────────── */
$("#btn-new").addEventListener("click", openNewModal);

/* ── Dark-mode toggle ────────────────────────────────────────── */
const btnDark = $("#btn-dark-toggle");
if (btnDark) {
  btnDark.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });
}

/* ── Init ────────────────────────────────────────────────────── */
renderCalendar(schedule);

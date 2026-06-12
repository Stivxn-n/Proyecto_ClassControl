/* ===========================
   ClassControl - app.js
   =========================== */

"use strict";

/* ── Dark Mode ─────────────────────────────────────── */
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

/* ── Toast Notifications ───────────────────────────── */
const toastContainer = document.getElementById("toast-container");

function showToast(message, type = "success", duration = 3500) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size:1.1rem">
      ${type === "success" ? "check_circle" : "error"}
    </span>
    <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, duration);
}

/* ── Modal Engine ──────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("open");
  el.querySelector("input, select, textarea")?.focus();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("open");
  // Reset form inside modal
  el.querySelectorAll("form").forEach(f => {
    f.reset();
    f.querySelectorAll(".form-control").forEach(fc => fc.classList.remove("is-invalid"));
  });
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

// Wire open buttons
document.querySelectorAll("[data-modal-open]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.modalOpen));
});

// Wire close buttons
document.querySelectorAll("[data-modal-close]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.dataset.modalClose));
});

/* ── Form Validation ───────────────────────────────── */
function validateField(input) {
  const value = input.value.trim();
  let valid = true;

  if (input.required && value === "") valid = false;
  if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) valid = false;
  if (input.type === "number" && value) {
    const num = Number(value);
    if (input.min && num < Number(input.min)) valid = false;
    if (input.max && num > Number(input.max)) valid = false;
  }

  input.classList.toggle("is-invalid", !valid);
  return valid;
}

function validateForm(formEl) {
  let allValid = true;
  formEl.querySelectorAll(".form-control[required], .form-control[data-validate]")
    .forEach(input => { if (!validateField(input)) allValid = false; });
  return allValid;
}

// Live validation on blur
document.querySelectorAll(".form-control").forEach(input => {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) validateField(input);
  });
});

/* ── Form Submissions ──────────────────────────────── */

// --- Nueva Ficha ---
document.getElementById("form-nueva-ficha")?.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateForm(e.target)) { showToast("Completa los campos requeridos", "error"); return; }
  showToast("Ficha creada correctamente");
  closeModal("modal-nueva-ficha");
});

// --- Nueva Actividad ---
document.getElementById("form-nueva-actividad")?.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateForm(e.target)) { showToast("Completa los campos requeridos", "error"); return; }
  showToast("Actividad registrada correctamente");
  closeModal("modal-nueva-actividad");
});

// --- Nuevo Ambiente ---
document.getElementById("form-nuevo-ambiente")?.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateForm(e.target)) { showToast("Completa los campos requeridos", "error"); return; }
  showToast("Ambiente registrado correctamente");
  closeModal("modal-nuevo-ambiente");
});

/* ── Live Search ───────────────────────────────────── */
const searchInput = document.getElementById("search-input");
const tableRows   = document.querySelectorAll("tbody tr[data-searchable]");

searchInput?.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();
  tableRows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = !q || text.includes(q) ? "" : "none";
  });
});

/* ── Bar Chart: week selector ──────────────────────── */
const chartData = {
  "Esta semana": [60, 85, 70, 95, 40, 20],
  "Hoy":         [0,  0,  0,  0,  72,  0],
};

document.getElementById("chart-select")?.addEventListener("change", e => {
  const vals = chartData[e.target.value] || chartData["Esta semana"];
  document.querySelectorAll(".bar").forEach((bar, i) => {
    bar.style.height = vals[i] + "%";
    const tip = bar.querySelector(".bar-tooltip");
    if (tip) tip.textContent = vals[i] + "%";
  });
});

/* ── Animate progress bars on load ────────────────── */
function animateProgressBars() {
  document.querySelectorAll(".progress-fill[data-width]").forEach(fill => {
    fill.style.width = "0%";
    requestAnimationFrame(() => {
      setTimeout(() => { fill.style.width = fill.dataset.width; }, 100);
    });
  });
}

/* ── Stats counter animation ───────────────────────── */
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current).toString().padStart(2, "0");
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

/* ── Action menu (more_vert) ───────────────────────── */
document.querySelectorAll(".icon-btn[data-row-id]").forEach(btn => {
  btn.addEventListener("click", () => {
    const rowId = btn.dataset.rowId;
    const menu  = document.getElementById(`menu-${rowId}`);
    if (!menu) return;
    const isOpen = menu.classList.toggle("open");
    // close others
    document.querySelectorAll(".row-menu.open").forEach(m => {
      if (m !== menu) m.classList.remove("open");
    });
  });
});

document.addEventListener("click", e => {
  if (!e.target.closest(".icon-btn")) {
    document.querySelectorAll(".row-menu.open").forEach(m => m.classList.remove("open"));
  }
});

/* ── Nav active highlight ──────────────────────────── */
(function setActiveNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = (link.getAttribute("href") || "").split("/").pop();
    link.classList.toggle("active", href === current);
  });
})();

/* ── Init ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  animateProgressBars();
  animateCounters();
});

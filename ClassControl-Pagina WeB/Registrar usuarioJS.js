/**
 * ClassControl — Registro de Usuario
 * registrar_usuario.js
 *
 * Incluye:
 *  - Validación en tiempo real por campo
 *  - Validación completa al enviar
 *  - Indicador de fortaleza de contraseña
 *  - Toggle mostrar/ocultar contraseña
 *  - Detección de paso activo (steps en sidebar)
 *  - Feedback visual (toast + spinner)
 *  - Contador de caracteres en username
 */

/* ============================================================
   Helpers
   ============================================================ */

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toastIcon');

  toast.querySelector('.toast-msg').textContent = message;
  icon.textContent = type === 'success' ? 'check_circle' : 'error';
  toast.className = `toast ${type} show`;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3800);
}

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (!field) return;
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  if (error) { error.textContent = message; error.classList.add('visible'); }
}

function setFieldValid(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (!field) return;
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');
  if (error) error.classList.remove('visible');
}

function clearField(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (!field) return;
  field.classList.remove('is-invalid', 'is-valid');
  if (error) error.classList.remove('visible');
}

/* ============================================================
   Validation rules
   ============================================================ */

const VALIDATORS = {
  fNombres:    v => v.trim().length >= 2          ? null : 'Mínimo 2 caracteres',
  fApellidos:  v => v.trim().length >= 2          ? null : 'Mínimo 2 caracteres',
  fTipoDoc:    v => v !== ''                       ? null : 'Seleccione un tipo',
  fDocumento:  v => /^\d{6,12}$/.test(v.trim())   ? null : 'Entre 6 y 12 dígitos numéricos',
  fEmail:      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Correo inválido',
  fTelefono:   v => /^[0-9\s\+\-]{7,15}$/.test(v.trim()) ? null : 'Teléfono inválido',
  fRol:        v => v !== ''                       ? null : 'Seleccione un rol',
  fUsername:   v => /^[a-z0-9_]{4,20}$/.test(v.trim()) ? null : '4-20 caracteres: letras minúsculas, números o _',
  fPassword:   v => v.length >= 8                 ? null : 'Mínimo 8 caracteres',
  fConfirm:    v => {
    const pw = document.getElementById('fPassword');
    return (pw && v === pw.value) ? null : 'Las contraseñas no coinciden';
  },
};

function validateField(id) {
  const field = document.getElementById(id);
  if (!field) return true;
  const rule = VALIDATORS[id];
  if (!rule) return true;
  const error = rule(field.value);
  if (error) { setFieldError(id, error); return false; }
  setFieldValid(id);
  return true;
}

function validateAll() {
  const ids = Object.keys(VALIDATORS);
  let allValid = true;
  ids.forEach(id => { if (!validateField(id)) allValid = false; });
  return allValid;
}

/* ============================================================
   Password Strength
   ============================================================ */

function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score; // 0-5
}

function updateStrengthBar(pw) {
  const wrap  = document.getElementById('pwStrength');
  const bars  = wrap.querySelectorAll('.pw-bar');
  const label = document.getElementById('pwLabel');

  if (!pw) { wrap.classList.remove('visible'); return; }
  wrap.classList.add('visible');

  const score = getPasswordStrength(pw);
  const levels = [
    { threshold: 0, cls: '',       text: '' },
    { threshold: 1, cls: 'weak',   text: 'Muy débil' },
    { threshold: 2, cls: 'weak',   text: 'Débil' },
    { threshold: 3, cls: 'fair',   text: 'Regular' },
    { threshold: 4, cls: 'strong', text: 'Buena' },
    { threshold: 5, cls: 'strong', text: 'Muy fuerte' },
  ];
  const level = levels[Math.min(score, 5)];

  bars.forEach((bar, i) => {
    bar.className = 'pw-bar';
    if (i < score) bar.classList.add(level.cls);
  });
  label.textContent = level.text;
}

/* ============================================================
   Toggle Password Visibility
   ============================================================ */

function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isHidden = target.type === 'password';
      target.type = isHidden ? 'text' : 'password';
      btn.textContent = isHidden ? 'visibility_off' : 'visibility';
    });
  });
}

/* ============================================================
   Step indicator (sidebar)
   ============================================================ */

const STEP_FIELDS = {
  step1: ['fNombres', 'fApellidos', 'fTipoDoc', 'fDocumento', 'fEmail', 'fTelefono'],
  step2: ['fUsername', 'fPassword', 'fConfirm'],
  step3: ['fRol'],
};

function updateSteps() {
  Object.entries(STEP_FIELDS).forEach(([stepId, fields]) => {
    const el = document.getElementById(stepId);
    if (!el) return;
    const icon = el.querySelector('.material-symbols-outlined');
    const allFilled = fields.every(id => {
      const f = document.getElementById(id);
      return f && f.value.trim() !== '' && !f.classList.contains('is-invalid');
    });
    if (allFilled) {
      el.querySelector('.step-icon').className = 'step-icon done';
      if (icon) icon.textContent = 'check_circle';
    }
  });
}

/* ============================================================
   Live validation bindings
   ============================================================ */

function initLiveValidation() {
  Object.keys(VALIDATORS).forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;

    field.addEventListener('blur', () => validateField(id));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(id);
      updateSteps();

      // Extra: password strength
      if (id === 'fPassword') updateStrengthBar(field.value);

      // Extra: re-validate confirm when password changes
      if (id === 'fPassword') {
        const confirm = document.getElementById('fConfirm');
        if (confirm && confirm.value) validateField('fConfirm');
      }
    });
  });
}

/* ============================================================
   Form Submit
   ============================================================ */

function handleSubmit(e) {
  e.preventDefault();

  if (!validateAll()) {
    // Scroll to first error
    const firstInvalid = document.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Revisa los campos marcados en rojo', 'error');
    return;
  }

  // Simulate async save
  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    showToast('✓ Usuario creado exitosamente', 'success');

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = 'Inicio de sesion.html';
    }, 1800);
  }, 1600);
}

/* ============================================================
   Cancel button
   ============================================================ */

function handleCancel() {
  const anyFilled = Object.keys(VALIDATORS).some(id => {
    const f = document.getElementById(id);
    return f && f.value.trim() !== '';
  });

  if (anyFilled) {
    if (confirm('¿Descartar los datos ingresados?')) {
      document.getElementById('registerForm').reset();
      Object.keys(VALIDATORS).forEach(clearField);
      document.getElementById('pwStrength').classList.remove('visible');
    }
  }
}

/* ============================================================
   Init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLiveValidation();

  const form = document.getElementById('registerForm');
  if (form) form.addEventListener('submit', handleSubmit);

  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
});

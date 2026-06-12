/* ============================================
   login.js — ClassControl
   Validación, toggle contraseña, "recordarme",
   estado de carga y redirección simulada.
   ============================================ */

'use strict';

/* ──────────────────────────────────────────
   1. SELECTORES
────────────────────────────────────────── */
const formLogin      = document.getElementById('form-login');
const inputUsuario   = document.getElementById('login-usuario');
const inputPassword  = document.getElementById('login-password');
const checkRecordar  = document.getElementById('recordarme');
const btnTogglePass  = document.getElementById('btn-toggle-pass');
const iconPass       = document.getElementById('icon-pass');
const btnLogin       = document.getElementById('btn-login');
const btnLoginText   = document.getElementById('btn-login-text');
const btnLoginIcon   = document.getElementById('btn-login-icon');
const btnSpinner     = document.getElementById('btn-spinner');
const loginError     = document.getElementById('login-error');
const loginErrorMsg  = document.getElementById('login-error-msg');

/* ──────────────────────────────────────────
   2. CREDENCIALES DE DEMO
   (En producción esto lo valida el backend)
────────────────────────────────────────── */
const CREDENCIALES_DEMO = {
  usuario: 'admin@sena.edu.co',
  password: 'sena2024',
};

/* ──────────────────────────────────────────
   3. RECORDARME — restaurar usuario guardado
────────────────────────────────────────── */
(function restaurarUsuario() {
  const usuarioGuardado = localStorage.getItem('cc_usuario');
  if (usuarioGuardado) {
    inputUsuario.value   = usuarioGuardado;
    checkRecordar.checked = true;
  }
})();

/* ──────────────────────────────────────────
   4. TOGGLE VER / OCULTAR CONTRASEÑA
────────────────────────────────────────── */
btnTogglePass.addEventListener('click', () => {
  const esPassword = inputPassword.type === 'password';
  inputPassword.type   = esPassword ? 'text' : 'password';
  iconPass.textContent = esPassword ? 'visibility_off' : 'visibility';
  inputPassword.focus();
});

/* ──────────────────────────────────────────
   5. LIMPIAR ERRORES AL ESCRIBIR
────────────────────────────────────────── */
[inputUsuario, inputPassword].forEach(campo => {
  campo.addEventListener('input', () => {
    campo.classList.remove('is-invalid');
    const errorEl = campo.closest('.flex-col')?.querySelector('.error-msg');
    errorEl?.classList.add('hidden');
    ocultarErrorGlobal();
  });
});

/* ──────────────────────────────────────────
   6. VALIDACIÓN
────────────────────────────────────────── */
function validarCampos() {
  let valido = true;

  // Usuario
  if (!inputUsuario.value.trim()) {
    marcarInvalido(inputUsuario);
    valido = false;
  } else {
    marcarValido(inputUsuario);
  }

  // Contraseña
  if (!inputPassword.value) {
    marcarInvalido(inputPassword);
    valido = false;
  } else {
    marcarValido(inputPassword);
  }

  return valido;
}

function marcarInvalido(campo) {
  campo.classList.add('is-invalid');
  const errorEl = campo.closest('.flex-col')?.querySelector('.error-msg');
  errorEl?.classList.remove('hidden');
}

function marcarValido(campo) {
  campo.classList.remove('is-invalid');
  const errorEl = campo.closest('.flex-col')?.querySelector('.error-msg');
  errorEl?.classList.add('hidden');
}

/* ──────────────────────────────────────────
   7. ERROR GLOBAL
────────────────────────────────────────── */
function mostrarErrorGlobal(msg) {
  loginErrorMsg.textContent = msg;
  loginError.classList.remove('hidden');
  formLogin.classList.add('shake');
  formLogin.addEventListener('animationend', () => {
    formLogin.classList.remove('shake');
  }, { once: true });
}

function ocultarErrorGlobal() {
  loginError.classList.add('hidden');
}

/* ──────────────────────────────────────────
   8. ESTADO DE CARGA
────────────────────────────────────────── */
function setLoading(loading) {
  btnLogin.disabled = loading;
  btnLoginText.textContent = loading ? 'Verificando...' : 'Iniciar sesión';
  btnLoginIcon.classList.toggle('hidden', loading);
  btnSpinner.classList.toggle('hidden', !loading);
}

/* ──────────────────────────────────────────
   9. AUTENTICACIÓN SIMULADA
   Reemplaza esta función por una llamada real
   a tu API cuando tengas el backend listo.
────────────────────────────────────────── */
function autenticar(usuario, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        usuario.trim().toLowerCase() === CREDENCIALES_DEMO.usuario &&
        password === CREDENCIALES_DEMO.password
      ) {
        resolve({ nombre: 'Coordinación Académica', rol: 'admin' });
      } else {
        reject(new Error('Credenciales incorrectas'));
      }
    }, 1200); // Simula latencia de red
  });
}

/* ──────────────────────────────────────────
   10. SUBMIT DEL FORMULARIO
────────────────────────────────────────── */
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  ocultarErrorGlobal();

  if (!validarCampos()) return;

  const usuario  = inputUsuario.value.trim();
  const password = inputPassword.value;

  setLoading(true);

  try {
    const sesion = await autenticar(usuario, password);

    // Guardar preferencia "recordarme"
    if (checkRecordar.checked) {
      localStorage.setItem('cc_usuario', usuario);
    } else {
      localStorage.removeItem('cc_usuario');
    }

    // Guardar sesión mínima (en producción usa tokens seguros)
    sessionStorage.setItem('cc_sesion', JSON.stringify({
      usuario,
      nombre: sesion.nombre,
      rol: sesion.rol,
    }));

    // Redirigir a página principal
    window.location.href = 'Pagina Principal.html';

  } catch (err) {
    setLoading(false);
    mostrarErrorGlobal('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
    inputPassword.value = '';
    inputPassword.focus();
  }
});

/* ──────────────────────────────────────────
   11. ENVIAR CON ENTER DESDE CUALQUIER CAMPO
────────────────────────────────────────── */
[inputUsuario, inputPassword].forEach(campo => {
  campo.addEventListener('keydown', e => {
    if (e.key === 'Enter') formLogin.requestSubmit();
  });
});

/**
 * Kawalerski – Bachelor Party RSVP Form
 * Multi-step form with SheetDB / Google Apps Script submission
 *
 * ──────────────────────────────────────────────────────────
 *  KONFIGURACJA – uzupełnij przed wdrożeniem
 * ──────────────────────────────────────────────────────────
 *
 *  Opcja A – SheetDB
 *    Stwórz arkusz Google Sheets i podłącz go do SheetDB
 *    (https://sheetdb.io/). Skopiuj API URL i wklej poniżej.
 *
 *  Opcja B – Google Apps Script
 *    Utwórz Apps Script Web App (doPost), opublikuj jako
 *    „Dostępne dla wszystkich" i wklej URL poniżej.
 *
 *  Pozostaw SUBMIT_METHOD jako 'sheetdb' lub 'apps_script'.
 * ──────────────────────────────────────────────────────────
 */
const CONFIG = {
  SUBMIT_METHOD: 'sheetdb',           // 'sheetdb' | 'apps_script'
  SHEETDB_URL:   'TWOJ_SHEETDB_URL',  // np. https://sheetdb.io/api/v1/XXXXXX
  APPS_SCRIPT_URL: 'TWOJ_APPS_SCRIPT_URL', // URL opublikowanego Apps Script
};

/* ──────────────────────────────────────────────────────────
   State
   ────────────────────────────────────────────────────────── */
let currentStep = 0;
const TOTAL_STEPS = 5; // liczba kroków formularza (bez ekranu sukcesu)

const formData = {
  imie:        '',
  email:       '',
  obecnosc:    '',
  nocleg:      '',
  transport:   '',
  koszulka:    '',
  uwagi:       '',
  timestamp:   '',
};

/* ──────────────────────────────────────────────────────────
   DOM ready
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showStep(0);
  buildProgressBar();
  bindNavButtons();
  bindChoiceTiles();
});

/* ──────────────────────────────────────────────────────────
   Progress bar
   ────────────────────────────────────────────────────────── */
function buildProgressBar() {
  const wrap = document.getElementById('progressBar');
  if (!wrap) return;
  wrap.innerHTML = '';

  for (let i = 0; i < TOTAL_STEPS; i++) {
    const seg = document.createElement('div');
    seg.classList.add('progress-step');
    seg.id = `ps-${i}`;
    wrap.appendChild(seg);
  }
  updateProgressBar();
}

function updateProgressBar() {
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const seg = document.getElementById(`ps-${i}`);
    if (!seg) continue;
    seg.classList.remove('done', 'active');
    if (i < currentStep)       seg.classList.add('done');
    else if (i === currentStep) seg.classList.add('active');
  }

  const label = document.getElementById('progressLabel');
  if (label) label.textContent = `Krok ${currentStep + 1} z ${TOTAL_STEPS}`;
}

/* ──────────────────────────────────────────────────────────
   Step navigation
   ────────────────────────────────────────────────────────── */
function showStep(index) {
  document.querySelectorAll('.step-card').forEach(card => {
    card.classList.remove('active');
  });

  const target = document.getElementById(`step-${index}`);
  if (target) {
    target.classList.add('active');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  currentStep = index;
  updateProgressBar();
}

function nextStep() {
  if (!validateCurrentStep()) return;
  collectCurrentStep();
  if (currentStep < TOTAL_STEPS - 1) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 0) showStep(currentStep - 1);
}

function bindNavButtons() {
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', nextStep);
  });
  document.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', prevStep);
  });
}

/* ──────────────────────────────────────────────────────────
   Choice tiles – auto-advance on radio select
   ────────────────────────────────────────────────────────── */
function bindChoiceTiles() {
  document.querySelectorAll('.choice-tile input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      // Small delay so user sees the selection before advancing
      const autoAdvance = radio.closest('.choice-grid')?.dataset.autoAdvance !== 'false';
      if (autoAdvance) {
        setTimeout(() => nextStep(), 350);
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────
   Validation
   ────────────────────────────────────────────────────────── */
function validateCurrentStep() {
  clearErrors();

  if (currentStep === 0) {
    const imie  = document.getElementById('imie');
    const email = document.getElementById('email');
    let ok = true;

    if (!imie?.value.trim()) {
      showError('err-imie', 'Podaj swoje imię i nazwisko.');
      ok = false;
    }
    if (!email?.value.trim() || !isValidEmail(email.value.trim())) {
      showError('err-email', 'Podaj poprawny adres e-mail.');
      ok = false;
    }
    return ok;
  }

  if (currentStep === 1) {
    if (!getRadioValue('obecnosc')) {
      showError('err-obecnosc', 'Zaznacz swoją odpowiedź.');
      return false;
    }
  }

  if (currentStep === 2) {
    if (!getRadioValue('nocleg')) {
      showError('err-nocleg', 'Wybierz opcję noclegu.');
      return false;
    }
  }

  if (currentStep === 3) {
    if (!getRadioValue('transport')) {
      showError('err-transport', 'Wybierz środek transportu.');
      return false;
    }
  }

  return true;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('visible'); }
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

/* ──────────────────────────────────────────────────────────
   Collect step data
   ────────────────────────────────────────────────────────── */
function collectCurrentStep() {
  if (currentStep === 0) {
    formData.imie  = document.getElementById('imie')?.value.trim()  || '';
    formData.email = document.getElementById('email')?.value.trim() || '';
  }
  if (currentStep === 1) {
    formData.obecnosc = getRadioValue('obecnosc') || '';
  }
  if (currentStep === 2) {
    formData.nocleg = getRadioValue('nocleg') || '';
  }
  if (currentStep === 3) {
    formData.transport  = getRadioValue('transport')  || '';
    formData.koszulka   = getRadioValue('koszulka')   || '';
  }
  if (currentStep === 4) {
    formData.uwagi = document.getElementById('uwagi')?.value.trim() || '';
    fillSummary();
  }
}

/* ──────────────────────────────────────────────────────────
   Summary (step 4)
   ────────────────────────────────────────────────────────── */
function fillSummary() {
  const map = {
    's-imie':      formData.imie,
    's-email':     formData.email,
    's-obecnosc':  labelFor('obecnosc',  formData.obecnosc),
    's-nocleg':    labelFor('nocleg',    formData.nocleg),
    's-transport': labelFor('transport', formData.transport),
    's-koszulka':  labelFor('koszulka',  formData.koszulka),
    's-uwagi':     formData.uwagi || '—',
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

function labelFor(name, value) {
  if (!value) return '—';
  const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (!input) return value;
  const label = input.closest('.choice-tile')?.querySelector('label');
  return label ? label.textContent.replace(/\s+/g, ' ').trim() : value;
}

/* ──────────────────────────────────────────────────────────
   Submit
   ────────────────────────────────────────────────────────── */
async function submitForm() {
  collectCurrentStep(); // collect step 4 data (uwagi)

  formData.timestamp = new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });

  const btn = document.getElementById('btn-submit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Wysyłam…';
  }

  try {
    const url = CONFIG.SUBMIT_METHOD === 'sheetdb'
      ? CONFIG.SHEETDB_URL
      : CONFIG.APPS_SCRIPT_URL;

    const payload = CONFIG.SUBMIT_METHOD === 'sheetdb'
      ? JSON.stringify({ data: [{ ...formData }] })
      : JSON.stringify({ ...formData });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    showSuccessScreen();
  } catch (err) {
    console.error('Błąd wysyłania:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '🚀 Wyślij zgłoszenie';
    }
    alert('Ups! Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub skontaktuj się z organizatorem.');
  }
}

/* ──────────────────────────────────────────────────────────
   Success screen
   ────────────────────────────────────────────────────────── */
function showSuccessScreen() {
  document.querySelectorAll('.step-card').forEach(c => c.classList.remove('active'));
  document.getElementById('progressBar')?.closest('.progress-wrap')?.remove();

  const success = document.getElementById('success-screen');
  if (success) success.classList.add('active');

  launchConfetti();
}

/* ──────────────────────────────────────────────────────────
   Mini confetti (canvas-free, pure DOM)
   ────────────────────────────────────────────────────────── */
function launchConfetti() {
  const colors = ['#e94560', '#f5a623', '#3498db', '#2ecc71', '#9b59b6', '#fff'];
  const container = document.body;

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 10 + 6;
    Object.assign(el.style, {
      position:       'fixed',
      top:            '-20px',
      left:           `${Math.random() * 100}vw`,
      width:          `${size}px`,
      height:         `${size}px`,
      borderRadius:   Math.random() > 0.5 ? '50%' : '2px',
      background:     colors[Math.floor(Math.random() * colors.length)],
      opacity:        '1',
      zIndex:         '9999',
      pointerEvents:  'none',
      transform:      `rotate(${Math.random() * 360}deg)`,
      transition:     `transform ${1.5 + Math.random()}s ease, top ${1.5 + Math.random() * 2}s ease, opacity 0.5s ease ${1.5 + Math.random()}s`,
    });
    container.appendChild(el);

    // Animate downward
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.top     = `${80 + Math.random() * 40}vh`;
        el.style.opacity = '0';
        el.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 200}px)`;
      });
    });

    setTimeout(() => el.remove(), 4000);
  }
}

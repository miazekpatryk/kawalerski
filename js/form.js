/**
 * Kawalerski – Bachelor Party Plan Form
 * Multi-step SPA with SheetDB / Google Apps Script submission
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
  SUBMIT_METHOD:   'sheetdb',                 // 'sheetdb' | 'apps_script'
  SHEETDB_URL:     'TWOJ_SHEETDB_URL',        // np. https://sheetdb.io/api/v1/XXXXXX
  APPS_SCRIPT_URL: 'TWOJ_APPS_SCRIPT_URL',   // URL opublikowanego Apps Script
};

/* ──────────────────────────────────────────────────────────
   Terrain options per activity (Ekran 3 – dynamiczny)
   ────────────────────────────────────────────────────────── */
const TERRAIN_OPTIONS = {
  Spacer:  [
    { value: 'Las',  icon: '🌲', label: 'Las'  },
    { value: 'Góry', icon: '⛰️', label: 'Góry' },
    { value: 'Morze',icon: '🌊', label: 'Morze'},
  ],
  Rower:   [
    { value: 'Las',  icon: '🌲', label: 'Las'  },
    { value: 'Góry', icon: '⛰️', label: 'Góry' },
  ],
  Kajaki:  [
    { value: 'Góry',   icon: '⛰️',  label: 'Góry'   },
    { value: 'Rzeki',  icon: '🏞️',  label: 'Rzeki'  },
    { value: 'Jeziora',icon: '🏔️',  label: 'Jeziora'},
  ],
};

/* ──────────────────────────────────────────────────────────
   State
   ────────────────────────────────────────────────────────── */
let currentStep = 0;
const TOTAL_STEPS = 5; // ekrany 1-5 (bez ekranu podziękowania)

const formData = {
  nick:          '',
  aktywnosc:     '',
  teren:         '',
  nocleg:        '',
  udogodnienia:  '',
  timestamp:     '',
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
    if (i < currentStep)        seg.classList.add('done');
    else if (i === currentStep) seg.classList.add('active');
  }

  const label = document.getElementById('progressLabel');
  if (label) label.textContent = `Krok ${currentStep + 1} z ${TOTAL_STEPS}`;
}

/* ──────────────────────────────────────────────────────────
   Terrain – render tiles dynamically when entering step 2
   ────────────────────────────────────────────────────────── */
function renderTerrainOptions() {
  const grid = document.getElementById('terrain-grid');
  if (!grid) return;

  const options = TERRAIN_OPTIONS[formData.aktywnosc] || [];
  grid.innerHTML = '';

  options.forEach(({ value, icon, label }) => {
    const id = `ter-${value.toLowerCase()}`;
    const tile = document.createElement('div');
    tile.className = 'choice-tile';
    tile.innerHTML = `
      <input type="radio" name="teren" id="${id}" value="${value}" />
      <label for="${id}">
        <span class="tile-icon">${icon}</span>
        ${label}
      </label>`;
    grid.appendChild(tile);
  });

  // Re-select previously chosen terrain if it's still valid
  if (formData.teren) {
    const prev = grid.querySelector(`input[value="${formData.teren}"]`);
    if (prev) prev.checked = true;
  }

  // Re-bind auto-advance for newly created radios
  grid.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      formData.teren = radio.value;
      setTimeout(() => nextStep(), 350);
    });
  });

  // Update step description
  const desc = document.getElementById('terrain-desc');
  if (desc && formData.aktywnosc) {
    desc.textContent = `Wybrałeś: ${formData.aktywnosc}. Teraz wybierz teren.`;
  }
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

  // Rebuild terrain tiles every time step 2 becomes active
  if (index === 2) renderTerrainOptions();
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

  // Ekran 1 – nick
  if (currentStep === 0) {
    const nick = document.getElementById('nick');
    if (!nick?.value.trim()) {
      showError('err-nick', 'Wpisz swój nick, byku! 🐂');
      return false;
    }
    return true;
  }

  // Ekran 2 – aktywność
  if (currentStep === 1) {
    if (!getRadioValue('aktywnosc')) {
      showError('err-aktywnosc', 'Wybierz aktywność.');
      return false;
    }
    return true;
  }

  // Ekran 3 – teren
  if (currentStep === 2) {
    if (!getRadioValue('teren')) {
      showError('err-teren', 'Wybierz teren.');
      return false;
    }
    return true;
  }

  // Ekran 4 – nocleg
  if (currentStep === 3) {
    if (!getRadioValue('nocleg')) {
      showError('err-nocleg', 'Wybierz rodzaj noclegu.');
      return false;
    }
    return true;
  }

  // Ekran 5 – udogodnienia (checkboxy – opcjonalne, nie wymagają walidacji)
  return true;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('visible'); }
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

function getCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(el => el.value);
}

/* ──────────────────────────────────────────────────────────
   Collect step data
   ────────────────────────────────────────────────────────── */
function collectCurrentStep() {
  if (currentStep === 0) {
    formData.nick = document.getElementById('nick')?.value.trim() || '';
  }
  if (currentStep === 1) {
    formData.aktywnosc = getRadioValue('aktywnosc') || '';
    // Reset terrain when activity changes
    formData.teren = '';
  }
  if (currentStep === 2) {
    formData.teren = getRadioValue('teren') || '';
  }
  if (currentStep === 3) {
    formData.nocleg = getRadioValue('nocleg') || '';
  }
  if (currentStep === 4) {
    const vals = getCheckboxValues('udogodnienia');
    formData.udogodnienia = vals.length ? vals.join(', ') : 'Brak';
  }
}

/* ──────────────────────────────────────────────────────────
   Submit (triggered from Ekran 5 – "Potwierdź plan")
   ────────────────────────────────────────────────────────── */
async function submitForm() {
  collectCurrentStep(); // collect step 4 (udogodnienia)

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
      btn.innerHTML = '✅ Potwierdź plan';
    }
    alert('Ups! Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub skontaktuj się z organizatorem.');
  }
}

/* ──────────────────────────────────────────────────────────
   Success screen (Ekran 6)
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
      position:      'fixed',
      top:           '-20px',
      left:          `${Math.random() * 100}vw`,
      width:         `${size}px`,
      height:        `${size}px`,
      borderRadius:  Math.random() > 0.5 ? '50%' : '2px',
      background:    colors[Math.floor(Math.random() * colors.length)],
      opacity:       '1',
      zIndex:        '9999',
      pointerEvents: 'none',
      transform:     `rotate(${Math.random() * 360}deg)`,
      transition:    `transform ${1.5 + Math.random()}s ease, top ${1.5 + Math.random() * 2}s ease, opacity 0.5s ease ${1.5 + Math.random()}s`,
    });
    container.appendChild(el);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.top       = `${80 + Math.random() * 40}vh`;
        el.style.opacity   = '0';
        el.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 200}px)`;
      });
    });

    setTimeout(() => el.remove(), 4000);
  }
}

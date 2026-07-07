# 🥂 Kawalerski – Formularz RSVP (GitHub Pages)

Szablon strony GitHub Pages z multi-step formularzem zgłoszeniowym na wieczór kawalerski.
Dane zbierane są przez **SheetDB** lub **Google Apps Script** i trafiają bezpośrednio do arkusza Google Sheets.

---

## 🗂️ Struktura projektu

```
kawalerski/
├── index.html              ← Strona formularza (GitHub Pages)
├── css/
│   └── style.css           ← Stylizacja (dark theme, animacje)
├── js/
│   └── form.js             ← Logika formularza + wysyłka
├── apps-script/
│   └── Code.gs             ← Backend Google Apps Script (opcja B)
└── _config.yml             ← Konfiguracja GitHub Pages
```

---

## 🚀 Szybki start

### 1. Sklonuj/forkuj repozytorium

```bash
git clone https://github.com/TWOJ_LOGIN/kawalerski.git
cd kawalerski
```

### 2. Skonfiguruj backend (wybierz jedną opcję)

---

#### Opcja A – SheetDB *(łatwiejsza)*

1. Utwórz arkusz Google Sheets z nagłówkami:
   `timestamp | imie | email | obecnosc | nocleg | transport | koszulka | uwagi`
2. Wejdź na [sheetdb.io](https://sheetdb.io/), połącz arkusz, skopiuj **API URL**.
3. Otwórz `js/form.js` i uzupełnij:

```js
const CONFIG = {
  SUBMIT_METHOD: 'sheetdb',
  SHEETDB_URL:   'https://sheetdb.io/api/v1/XXXXXX',  // ← Twój URL
  APPS_SCRIPT_URL: '',
};
```

---

#### Opcja B – Google Apps Script *(bez zewnętrznych serwisów)*

1. Utwórz nowy arkusz Google Sheets.
2. Otwórz **Rozszerzenia → Apps Script**.
3. Wklej zawartość pliku `apps-script/Code.gs`.
4. Zmień `SPREADSHEET_ID` na ID swojego arkusza
   *(część URL między `/d/` a `/edit`)*.
5. Kliknij **Wdróż → Nowe wdrożenie**:
   - Typ: *Aplikacja internetowa*
   - Wykonaj jako: *Ja*
   - Kto ma dostęp: *Wszyscy*
6. Skopiuj URL wdrożenia.
7. Otwórz `js/form.js` i uzupełnij:

```js
const CONFIG = {
  SUBMIT_METHOD:   'apps_script',
  SHEETDB_URL:     '',
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/XXXXXX/exec', // ← Twój URL
};
```

---

### 3. Dostosuj formularz

Otwórz `index.html` – możesz swobodnie edytować:
- **Tytuł imprezy** (`<h1>`, `.subtitle`)
- **Kroki formularza** (sekcje `step-0` … `step-4`)
- **Opcje wyboru** (kafelki `.choice-tile`)
- **Grafiki** (inline SVG wewnątrz każdego kroku)
- **Kolorystykę** (zmienne CSS w `:root` w `css/style.css`)

---

### 4. Włącz GitHub Pages

1. Wejdź w **Settings → Pages** swojego repozytorium.
2. Branch: `main`, folder: `/ (root)`.
3. Zapisz – strona będzie dostępna pod adresem:
   `https://TWOJ_LOGIN.github.io/kawalerski/`

---

## 📋 Zbierane dane

| Pole         | Opis                               |
|--------------|------------------------------------|
| `timestamp`  | Data i godzina zgłoszenia (PL)     |
| `imie`       | Imię i nazwisko gościa             |
| `email`      | Adres e-mail                       |
| `obecnosc`   | Potwierdzenie obecności            |
| `nocleg`     | Czy potrzebuje noclegu             |
| `transport`  | Wybrany środek transportu          |
| `koszulka`   | Rozmiar koszulki (S–XXL / brak)    |
| `uwagi`      | Dodatkowe uwagi (opcjonalne)       |

---

## 🎨 Personalizacja

- Grafiki to **inline SVG** – można je zastąpić własnymi obrazami `<img>`.
- Kolory są definiowane przez zmienne CSS w `:root` (plik `css/style.css`).
- Kroki formularza to sekcje `<section id="step-N">` – można je dodawać/usuwać
  (pamiętaj o zaktualizowaniu stałej `TOTAL_STEPS` w `js/form.js`).

---

## 🛡️ Uwagi bezpieczeństwa

- Nie umieszczaj prywatnych kluczy API w publicznym repozytorium.
- SheetDB i Google Apps Script wymagają otwartego endpointu – dane formularza
  (imię, email) są **publicznymi zgłoszeniami**, nie zawierają wrażliwych danych.
- Jeśli repozytorium jest publiczne, upewnij się że URL SheetDB/Apps Script
  jest akceptowalnie widoczny (ochrona: limity rate-limiting w SheetDB / Apps Script).

---

*Szablon stworzony z ❤️ na potrzeby wieczorów kawalerskich.*
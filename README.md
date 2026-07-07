# 🏕️ Kawalerski – Plan przygody (GitHub Pages)

Szablon strony GitHub Pages z wieloekranowym formularzem planowania wieczoru kawalerskiego.
Uczestnik krok po kroku wybiera aktywność, teren, nocleg i udogodnienia.
Dane zbierane są przez **SheetDB** lub **Google Apps Script** i trafiają do arkusza Google Sheets.

---

## 🗂️ Struktura projektu

```
kawalerski/
├── index.html              ← Strona formularza (GitHub Pages)
├── css/
│   └── style.css           ← Stylizacja (light theme, animacje)
├── js/
│   └── form.js             ← Logika formularza + konfiguracja + wysyłka
├── img/                    ← 🖼️ Ikony kafelków (PNG 2048×2048) + własne tła JPG
│   ├── spacer.png          ← Kafelek aktywności: Spacer
│   ├── rower.png           ← Kafelek aktywności: Rower
│   ├── kajaki.png          ← Kafelek aktywności: Kajaki
│   ├── las.png             ← Kafelek terenu: Las
│   ├── gory.png            ← Kafelek terenu: Góry
│   ├── morze.png           ← Kafelek terenu: Morze
│   ├── rzeki.png           ← Kafelek terenu: Rzeki
│   ├── jeziora.png         ← Kafelek terenu: Jeziora
│   ├── samotnia.png        ← Kafelek noclegu: Samotnia
│   ├── domki.png           ← Kafelek noclegu: Domki
│   ├── namioty.png         ← Kafelek noclegu: Namioty
│   ├── basen.png           ← Kafelek udogodnień: Basen
│   ├── jacuzzi.png         ← Kafelek udogodnień: Jacuzzi
│   ├── balia.png           ← Kafelek udogodnień: Balia
│   ├── aktywnosc.jpg       ← (opcjonalne) Tło ekranu 2: Aktywność
│   ├── teren.jpg           ← (opcjonalne) Tło ekranu 3: Teren
│   ├── nocleg.jpg          ← (opcjonalne) Tło ekranu 4: Nocleg
│   └── udogodnienia.jpg    ← (opcjonalne) Tło ekranu 5: Udogodnienia
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
   `timestamp | nick | aktywnosc | teren | nocleg | udogodnienia`
2. Wejdź na [sheetdb.io](https://sheetdb.io/), połącz arkusz, skopiuj **API URL**.
3. Otwórz `js/form.js` i uzupełnij:

```js
const CONFIG = {
  SUBMIT_METHOD:   'sheetdb',
  SHEETDB_URL:     'https://sheetdb.io/api/v1/XXXXXX',  // ← Twój URL
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
5. Zmień `SHEET_NAME` na nazwę docelowej zakładki (domyślnie `Odpowiedzi`).
6. Kliknij **Wdróż → Nowe wdrożenie**:
   - Typ: *Aplikacja internetowa*
   - Wykonaj jako: *Ja*
   - Kto ma dostęp: *Wszyscy*
7. Skopiuj URL wdrożenia.
8. Otwórz `js/form.js` i uzupełnij:

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
- **Opcje wyboru** (kafelki `.choice-tile` w każdej sekcji)
- **Opcje terenu zależne od aktywności** (obiekt `TERRAIN_OPTIONS` w `js/form.js`)
- **Tła sekcji** – wrzuć własne pliki `aktywnosc.jpg`, `teren.jpg`, `nocleg.jpg`, `udogodnienia.jpg` do folderu `img/`
- **Kolorystykę** (zmienne CSS w `:root` w `css/style.css`)

---

### 4. Włącz GitHub Pages

1. Wejdź w **Settings → Pages** swojego repozytorium.
2. Branch: `main`, folder: `/ (root)`.
3. Zapisz – strona będzie dostępna pod adresem:
   `https://TWOJ_LOGIN.github.io/kawalerski/`

---

## 📋 Zbierane dane

| Pole           | Opis                                              |
|----------------|---------------------------------------------------|
| `timestamp`    | Data i godzina zgłoszenia (strefa PL)             |
| `nick`         | Nick uczestnika                                   |
| `aktywnosc`    | Wybrana aktywność (Spacer / Rower / Kajaki)       |
| `teren`        | Wybrany teren (zależny od aktywności)             |
| `nocleg`       | Rodzaj noclegu (Samotnia / Domki / Namioty)       |
| `udogodnienia` | Lista wybranych udogodnień (Basen, Jacuzzi, Balia)|

---

## 🎨 Personalizacja

- **Ikony kafelków** – gotowe PNG znajdują się w `img/` (szczegóły: [`img/README.md`](img/README.md)).
  Możesz podmienić dowolny plik lub dodać nowe kafelki w `index.html`.
- **Tła sekcji** – opcjonalne zdjęcia `aktywnosc.jpg`, `teren.jpg`, `nocleg.jpg`, `udogodnienia.jpg`
  w folderze `img/`. Jeśli pliki nie istnieją, wyświetlane jest kolorowe tło zastępcze z CSS.
- **Opcje terenu** są dynamicznie renderowane na podstawie wybranej aktywności –
  edytuj obiekt `TERRAIN_OPTIONS` w `js/form.js`, aby dostosować pary aktywność → teren.
- **Kolory** definiowane są przez zmienne CSS w `:root` (plik `css/style.css`).
- **Kroki formularza** to sekcje `<section id="step-N">` – możesz je dodawać/usuwać
  (pamiętaj o zaktualizowaniu stałej `TOTAL_STEPS` w `js/form.js`).

---

## 🛡️ Uwagi bezpieczeństwa

- Nie umieszczaj prywatnych kluczy API w publicznym repozytorium.
- SheetDB i Google Apps Script wymagają otwartego endpointu – zbierane dane
  (nick, preferencje wyjazdu) są **dobrowolnymi odpowiedziami**, nie zawierają wrażliwych danych.
- Jeśli repozytorium jest publiczne, upewnij się, że URL SheetDB/Apps Script
  jest akceptowalnie widoczny (ochrona: limity rate-limiting w SheetDB / Apps Script).

---

*Szablon stworzony z ❤️ na potrzeby wieczorów kawalerskich.*
# 🖼️ Obrazki – folder `img/`

Tu wrzucasz własne zdjęcia/grafiki wyświetlane na ekranach formularza.

## Nowe pliki (po analizie)

W katalogu są aktualnie gotowe assety PNG (wszystkie: `2048×2048`):

### Ekran 2 – Aktywność

- `spacer.png`
- `rower.png`
- `kajaki.png`

### Ekran 3 – Teren

- `las.png`
- `gory.png`
- `morze.png`
- `rzeki.png`
- `jeziora.png`

### Ekran 4 – Nocleg

- `samotnia.png`
- `domki.png`
- `namioty.png`

### Ekran 5 – Udogodnienia

- `basen.png`
- `jacuzzi.png`
- `balia.png`

## Oczekiwane pliki w `index.html` (domyślnie)

Aktualnie formularz odwołuje się do:

- `aktywnosc.jpg`
- `teren.jpg`
- `nocleg.jpg`
- `udogodnienia.jpg`

Jeśli chcesz użyć nowych obrazków PNG, zaktualizuj odpowiednie atrybuty `src` w `index.html`.

## Wskazówki

- Zalecane proporcje: **16:9** lub szerszy kadr (np. 800 × 500 px).
- Akceptowane formaty: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Jeśli dany plik nie istnieje, pojawi się ciemne tło zastępcze (graceful fallback zdefiniowany w CSS).
- Możesz użyć innych nazw – wystarczy zaktualizować atrybuty `src` w `index.html`.

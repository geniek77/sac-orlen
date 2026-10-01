# M Competition Cockpit KPI v4.0.0 – SAP Analytics Cloud

## Dlaczego przygotowano v4

W wersji v3 obraz poglądowy (render graficzny) NIE był identyczny z rendererem HTML/SVG. Wersja v4 nie posiada osobnego generowanego zewnętrznie „przykładu”. `wizualizacja_z_html.png` i `.jpg` zostały wykonane z prawdziwego pliku `podglad.html` oraz **dokładnie tego samego `m_competition.js`**, którego używa SAC. To jest rzeczywisty render widgetu, a nie obietnica jego wyglądu.

Dla zachowania efektu stylizowanego nowoczesnego kokpitu zastosowano ozdobną teksturę opartą na wcześniejszym projekcie graficznym wykonanym w tej rozmowie. Została ona oczyszczona z napisów, logo i większości wartości. Logo, skalowanie liczbowe, opisy, wartości, jednostki, stopka i znaczniki to *osobne warstwy SVG* generowane przez JavaScript. Tekstura została zapisana wewnątrz `m_competition.js` jako WebP Base64, więc NIE wymaga osobnego hostingu.

**Ważne ograniczenie:** nie jest to stuprocentowo wektorowa rekonstrukcja fotografii ani wizualizacja 1:1 przy każdej konfiguracji. Kolory cyfr, oznaczeń, poświat, logo i stopki można konfigurować niezależnie. Szczegóły fototekstury (chromowane obramowania, cieniowanie i dekoracyjne fragmenty czerwonego) pozostają częścią bitmapy – ich kolory nie są osobno edytowalne. Intensywność tekstury można ustawiać od 0 do 1. Nie twierdzimy, że zdjęcie oryginalnego samochodu zostało skopiowane ani że bitmapa jest w pełni edytowalnym SVG.

## Zawartość

- `m_competition.json` – manifest Custom Widget SAP SAC 4.0.0 i deklaracja źródła danych.
- `m_competition.js` – kompletna logika widgetu, SVG oraz wbudowana dekoracyjna tekstura WebP.
- `m_competition_styling.js` – panel stylowania, wartości, opisów, kolorów, czcionek, logo i animacji.
- `podglad.html` – **rzeczywisty podgląd** z wykorzystaniem tych samych dwóch JS; otwórz lokalnie w przeglądarce.
- `wizualizacja_z_html.png` i `wizualizacja_z_html.jpg` – zrzuty gotowego komponentu HTML po rozświetleniu, nie generacje AI.
- `test_v4.py` – automatyczne testy z Chromium/Playwright (opcjonalnie, potrzebuje Playwright i Chromium).

## Instalacja SAC

1. Skopiuj `m_competition.js` i `m_competition_styling.js` na dostępny z przeglądarki serwer HTTPS.
2. W `m_competition.json` zamień `https://TWOJ-SERWER-HTTPS/` na właściwy adres plików JS. Nazw plików nie zmieniaj bez aktualizacji manifestu.
3. Zaimportuj `m_competition.json` jako **Custom Widget** w SAP Analytics Cloud. W manifeście są już policzone sumy kontrolne SHA-256 dla zawartości dołączonych plików JS. Jeśli edytujesz je po pobraniu, wylicz ponownie pola `integrity` (`openssl dgst -sha256 -binary m_competition.js | openssl base64 -A`, przed wynikiem `sha256-`).
4. W **Builder** SAC powinien pojawić się standardowy wybór miar dzięki `dataBindings.kpiData`. To dlatego panel własnej konfiguracji został zgłoszony jako `kind: styling`, a nie `kind: builder`.
5. W **Styling** skonfiguruj parametry pięciu liczników, opisy, fonty, kolory i własne logo.

## Dane z modelu

Zadeklarowano jedną strukturę `kpiData` z feedem `measures` (`mainStructureMember`). Kolejne miary w wierszu wyników modelu trafiają zgodnie z `dataMeasureOrder` (domyślnie: `leftValue,rightValue,centerValue,fuelValue,tempValue`). Widget włącza ekran, gdy otrzyma przynajmniej jedną prawidłową liczbową miarę; pozostałe pozostają ze zdefiniowanymi wartościami domyślnymi. Jeżeli model ładuje wartości w kilku etapach, wywołaj tryb ręczny po osiągnięciu wymaganej kompletności.

## Sterowanie skryptem Analytics Designer

W trybie `loadingMode=manual` możesz użyć następującej sekwencji (zastąp `M_Cockpit_1` nazwą własnej instancji):

```javascript
M_Cockpit_1.beginLoading();
M_Cockpit_1.setGaugeRange("left", 0, 100);
M_Cockpit_1.setGaugeRange("right", 1, 10);
M_Cockpit_1.setValues(86.5, 5.2, 92.1, 0.6, 73);
M_Cockpit_1.setText("fuelLabel", "MARŻA");
M_Cockpit_1.setText("tempLabel", "KOSZT");
M_Cockpit_1.finishLoading();
```

Metody `setGaugeRange`, `setGaugeValue`, `setTextStyle`, `setText`, `setLogo`, `setThemeColor` i `getGaugeValue` są publiczne w `m_competition.json`. Funkcje `beginLoading`, `finishLoading`, `replayAnimation` pozwalają kontrolować animację. Do przejścia animacyjnego użyto CSS `opacity`, `brightness` i `transform`, zgodnie z żądaniem „rozświetlenia wyświetlacza”. Przy `prefers-reduced-motion` animacje są wyłączone ze względów dostępności.

## Resizing

Główny rysunek SVG ma stały układ współrzędnych `viewBox="0 0 1672 941"`, ale jego widoczny obszar wypełnia kontener SAC (`width: 100%; height: 100%; preserveAspectRatio: xMidYMid meet`). Skalowanie zachowuje proporcje i nie deformuje tarcz; przy kontenerach o innych proporcjach mogą pozostać ciemne marginesy.

## Uwagi dotyczące testowania

Kod sprawdzono programowo w Chromium: HTML, gotowość danych, pięć skal, zmiany tekstu/koloru/fontu/logo, aktualizacja właściwości panelu Styling, dopasowanie rozmiaru, dane testowe o formacie Data Binding SAC. **Nie został przetestowany bezpośrednio w konkretnej instancji SAC użytkownika**; polityka CORS i połączenie modelu mogą wymagać dodatkowej weryfikacji na jego tenantcie.

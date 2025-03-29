(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      #root {
         width: 100%;
         height: 100%;
         font-family: Arial, sans-serif;
         margin: 10px;
      }
      h2 {
         text-align: center;
         margin: 5px 0;
      }
      .slider-container {
         display: flex;
         align-items: center;
         justify-content: center;
         margin: 10px 0;
      }
      .slider-container input[type="range"] {
         margin: 0 10px;
      }
      .slider-container button {
         padding: 5px 10px;
         margin: 0 5px;
         cursor: pointer;
      }
      table {
         width: 100%;
         border-collapse: collapse;
         margin-top: 10px;
      }
      table, th, td {
         border: 1px solid #ccc;
      }
      th, td {
         padding: 10px;
         text-align: center;
         cursor: pointer;
      }
      .selected {
         background-color: lightblue;
      }
    </style>
    <div id="root"></div>
  `;

  class KalendarzMiesieczny extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      // Ustaw bazowy rok na bieżący oraz domyślne wartości
      this._baseYear = new Date().getFullYear();
      this._year = this._baseYear;
      this._month = new Date().getMonth(); // indeks 0-11
      this.render();
    }

    onCustomWidgetResize(width, height) {
      // Dostosowanie rozmiaru widgetu do przekazanych wymiarów – istotne dla SAC
      this._root.style.width = width + "px";
      this._root.style.height = height + "px";
      this.render();
    }

    async render() {
      const userLang = (this.locale || navigator.language || "en").substring(0, 2);
      const translations = {
        pl: {
          title: "Kalendarz Miesięczny",
          months: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
          quarters: ["Q1", "Q2", "Q3", "Q4"]
        },
        en: {
          title: "Monthly Calendar",
          months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          quarters: ["Q1", "Q2", "Q3", "Q4"]
        }
      };
      const t = translations[userLang] || translations.en;
      const self = this;

      // Ustal zakres slidera na podstawie właściwości z JSON lub domyślnego zakresu
      const sliderMin = (this.properties && this.properties.minYear !== undefined)
        ? parseInt(this.properties.minYear)
        : (this._baseYear - 20);
      const sliderMax = (this.properties && this.properties.maxYear !== undefined)
        ? parseInt(this.properties.maxYear)
        : (this._baseYear + 10);

      this._root.innerHTML = "";

      // Nagłówek prezentujący aktualnie wybrany okres ("mm.yyyy")
      const periodHeader = document.createElement("h2");
      periodHeader.innerText = this.get_calmoth();
      this._root.appendChild(periodHeader);

      // Kontener dla sterowania rokiem (przyciski i slider)
      const sliderContainer = document.createElement("div");
      sliderContainer.className = "slider-container";

      const btnDecrease5 = document.createElement("button");
      btnDecrease5.innerText = "<<";
      btnDecrease5.addEventListener("click", () => {
        this._year = Math.max(sliderMin, parseInt(this._year) - 5);
        slider.value = this._year;
        periodHeader.innerText = self.get_calmoth();
        self.dispatchEvent(new CustomEvent("onSelect", {
          detail: {
            type: "year",
            value: this._year,
            selected: true
          }
        }));
      });
      sliderContainer.appendChild(btnDecrease5);

      const btnDecrease1 = document.createElement("button");
      btnDecrease1.innerText = "<";
      btnDecrease1.addEventListener("click", () => {
        this._year = Math.max(sliderMin, parseInt(this._year) - 1);
        slider.value = this._year;
        periodHeader.innerText = self.get_calmoth();
        self.dispatchEvent(new CustomEvent("onSelect", {
          detail: {
            type: "year",
            value: this._year,
            selected: true
          }
        }));
      });
      sliderContainer.appendChild(btnDecrease1);

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = sliderMin.toString();
      slider.max = sliderMax.toString();
      slider.value = this._year;
      slider.addEventListener("input", () => {
        this._year = slider.value;
        periodHeader.innerText = self.get_calmoth();
      });
      // Wysyłamy zdarzenie po zatwierdzeniu zmiany wartości slidera
      slider.addEventListener("change", () => {
        self.dispatchEvent(new CustomEvent("onSelect", {
          detail: {
            type: "year",
            value: slider.value,
            selected: true
          }
        }));
      });
      sliderContainer.appendChild(slider);

      const btnIncrease1 = document.createElement("button");
      btnIncrease1.innerText = ">";
      btnIncrease1.addEventListener("click", () => {
        this._year = Math.min(sliderMax, parseInt(this._year) + 1);
        slider.value = this._year;
        periodHeader.innerText = self.get_calmoth();
        self.dispatchEvent(new CustomEvent("onSelect", {
          detail: {
            type: "year",
            value: this._year,
            selected: true
          }
        }));
      });
      sliderContainer.appendChild(btnIncrease1);

      const btnIncrease5 = document.createElement("button");
      btnIncrease5.innerText = ">>";
      btnIncrease5.addEventListener("click", () => {
        this._year = Math.min(sliderMax, parseInt(this._year) + 5);
        slider.value = this._year;
        periodHeader.innerText = self.get_calmoth();
        self.dispatchEvent(new CustomEvent("onSelect", {
          detail: {
            type: "year",
            value: this._year,
            selected: true
          }
        }));
      });
      sliderContainer.appendChild(btnIncrease5);

      this._root.appendChild(sliderContainer);

      // Budowanie tabeli – układ: 4 kolumny (dla kwartałów) i 4 wiersze:
      // wiersz 0: etykiety kwartałów,
      // wiersze 1-3: poszczególne miesiące dla danego kwartału.
      const table = document.createElement("table");
      const numRows = 4;
      const rows = [];
      for (let r = 0; r < numRows; r++) {
        const tr = document.createElement("tr");
        rows.push(tr);
        table.appendChild(tr);
      }

      // Dla każdego kwartału
      for (let q = 0; q < 4; q++) {
        // Wiersz 0: komórka kwartału
        const th = document.createElement("th");
        th.innerText = t.quarters[q];
        th.addEventListener("click", function () {
          // Usuwamy zaznaczenie ze wszystkich komórek tabeli
          const allCells = table.querySelectorAll("th, td");
          allCells.forEach(cell => cell.classList.remove("selected"));
          th.classList.add("selected");
          self.dispatchEvent(new CustomEvent("onSelect", {
            detail: {
              type: "quarter",
              value: th.innerText,
              selected: true
            }
          }));
          periodHeader.innerText = self.get_calmoth();
        });
        rows[0].appendChild(th);

        // Wiersze 1-3: komórki miesięcy
        for (let m = 0; m < 3; m++) {
          const td = document.createElement("td");
          const monthIndex = q * 3 + m;
          td.innerText = t.months[monthIndex];
          if (monthIndex === parseInt(this._month)) {
            td.classList.add("selected");
          }
          td.addEventListener("click", function () {
            const allCells = table.querySelectorAll("th, td");
            allCells.forEach(cell => cell.classList.remove("selected"));
            td.classList.add("selected");
            self.dispatchEvent(new CustomEvent("onSelect", {
              detail: {
                type: "month",
                value: td.innerText,
                selected: true
              }
            }));
            self._month = monthIndex;
            periodHeader.innerText = self.get_calmoth();
          });
          rows[m + 1].appendChild(td);
        }
      }
      this._root.appendChild(table);
    }

    // Metoda zwracająca aktualnie wybrany miesiąc w formacie "mm.yyyy"
    get_calmoth() {
      let month = parseInt(this._month) + 1; // przekształcamy indeks (0-11) na numer miesiąca (1-12)
      let monthStr = month < 10 ? "0" + month : month.toString();
      return monthStr + "." + this._year;
    }

    // Metoda zwracająca aktualnie wybrany miesiąc w formacie "yyyymm"
    get_calmoth_sap() {
      let month = parseInt(this._month) + 1;
      let monthStr = month < 10 ? "0" + month : month.toString();
      return this._year.toString() + monthStr;
    }

    // Metoda ustawiająca wybrany miesiąc przyjmując dane wejściowe w formacie "mm.yyyy"
    set_calmoth(period) {
      const parts = period.split(".");
      if (parts.length !== 2) return;
      const mm = parseInt(parts[0]);
      const yyyy = parseInt(parts[1]);
      if (isNaN(mm) || isNaN(yyyy)) return;
      this._year = yyyy;
      this._month = mm - 1;
      // Aktualizacja interfejsu
      setTimeout(() => {
        this.render();
      }, 0);
    }

    // Metoda ustawiająca wybrany miesiąc przyjmując dane wejściowe w formacie "yyyymm"
    set_calmoth_sap(period) {
      if (period.length !== 6) return;
      const yyyy = parseInt(period.substring(0, 4));
      const mm = parseInt(period.substring(4, 6));
      if (isNaN(mm) || isNaN(yyyy)) return;
      this._year = yyyy;
      this._month = mm - 1;
      setTimeout(() => {
        this.render();
      }, 0);
    }
  }

  customElements.define("com-sap-analytics-custom-widget-monthlycalendar", KalendarzMiesieczny);
})();

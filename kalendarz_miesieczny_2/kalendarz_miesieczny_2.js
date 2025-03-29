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

  class KalendarzMiesieczny2 extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._baseYear = new Date().getFullYear();
      this._year = this._baseYear;
      this._month = new Date().getMonth();
      this.render();
    }

    onCustomWidgetResize(width, height) {
      this._root.style.width = width + "px";
      this._root.style.height = height + "px";
      this.render();
    }

    async render() {
      const userLang = (this.locale || navigator.language || "en").substring(0, 2);
      const translations = {
        pl: {
          title: "Kalendarz Miesięczny 2",
          months: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
          quarters: ["Q1", "Q2", "Q3", "Q4"]
        },
        en: {
          title: "Monthly Calendar 2",
          months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          quarters: ["Q1", "Q2", "Q3", "Q4"]
        }
      };
      const t = translations[userLang] || translations.en;
      const self = this;

      const sliderMin = (this.properties && this.properties.minYear !== undefined)
        ? parseInt(this.properties.minYear)
        : (this._baseYear - 20);
      const sliderMax = (this.properties && this.properties.maxYear !== undefined)
        ? parseInt(this.properties.maxYear)
        : (this._baseYear + 10);

      this._root.innerHTML = "";

      const periodHeader = document.createElement("h2");
      periodHeader.innerText = this.get_calmoth();
      this._root.appendChild(periodHeader);

      const sliderContainer = document.createElement("div");
      sliderContainer.className = "slider-container";

      const createButton = (label, step) => {
        const btn = document.createElement("button");
        btn.innerText = label;
        btn.addEventListener("click", () => {
          this._year = Math.max(sliderMin, Math.min(sliderMax, parseInt(this._year) + step));
          slider.value = this._year;
          periodHeader.innerText = self.get_calmoth();
          self.dispatchEvent(new CustomEvent("onSelect", {
            detail: { type: "year", value: this._year, selected: true }
          }));
        });
        return btn;
      };

      sliderContainer.appendChild(createButton("<<", -5));
      sliderContainer.appendChild(createButton("<", -1));

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = sliderMin.toString();
      slider.max = sliderMax.toString();
      slider.value = this._year;
      slider.addEventListener("input", () => {
        this._year = slider.value;
        periodHeader.innerText = self.get_calmoth();
      });
      slider.addEventListener("change", () => {
        self.dispatchEvent(new CustomEvent("onSelect", {
          detail: { type: "year", value: slider.value, selected: true }
        }));
      });
      sliderContainer.appendChild(slider);

      sliderContainer.appendChild(createButton(">", 1));
      sliderContainer.appendChild(createButton(">>", 5));

      this._root.appendChild(sliderContainer);

      const table = document.createElement("table");
      const numRows = 4;
      const rows = [];
      for (let r = 0; r < numRows; r++) {
        const tr = document.createElement("tr");
        rows.push(tr);
        table.appendChild(tr);
      }

      for (let q = 0; q < 4; q++) {
        const th = document.createElement("th");
        th.innerText = t.quarters[q];
        th.addEventListener("click", function () {
          const allCells = table.querySelectorAll("th, td");
          allCells.forEach(cell => cell.classList.remove("selected"));
          th.classList.add("selected");

          const monthIndex = q * 3 + 2;
          const td = table.querySelectorAll("tr")[3].children[q];
          if (td) {
            td.classList.add("selected");
            self._month = monthIndex;
          }

          periodHeader.innerText = self.get_calmoth();
          self.dispatchEvent(new CustomEvent("onSelect", {
            detail: { type: "quarter", value: th.innerText, selected: true }
          }));
        });
        rows[0].appendChild(th);

        for (let m = 0; m < 3; m++) {
          const td = document.createElement("td");
          const monthIndex = q * 3 + m;

          // nowa logika: czy pokazać numer czy nazwę
          td.innerText = this.properties && this.properties.numericMonths
            ? (monthIndex + 1).toString().padStart(2, "0")
            : t.months[monthIndex];

          if (monthIndex === parseInt(this._month)) {
            td.classList.add("selected");
          }

          td.addEventListener("click", function () {
            const allCells = table.querySelectorAll("th, td");
            allCells.forEach(cell => cell.classList.remove("selected"));
            td.classList.add("selected");
            self._month = monthIndex;
            periodHeader.innerText = self.get_calmoth();

            self.dispatchEvent(new CustomEvent("onSelect", {
              detail: { type: "month", value: td.innerText, selected: true }
            }));
          });

          rows[m + 1].appendChild(td);
        }
      }

      this._root.appendChild(table);
    }

    get_calmoth() {
      let month = parseInt(this._month) + 1;
      let monthStr = month < 10 ? "0" + month : month.toString();
      return monthStr + "." + this._year;
    }

    get_calmoth_sap() {
      let month = parseInt(this._month) + 1;
      let monthStr = month < 10 ? "0" + month : month.toString();
      return this._year.toString() + monthStr;
    }

    get_calquarter() {
      const quarter = Math.floor(this._month / 3) + 1;
      return this._year.toString() + quarter.toString();
    }

    set_calmoth(period) {
      const parts = period.split(".");
      if (parts.length !== 2) return;
      const mm = parseInt(parts[0]);
      const yyyy = parseInt(parts[1]);
      if (isNaN(mm) || isNaN(yyyy)) return;
      this._year = yyyy;
      this._month = mm - 1;
      setTimeout(() => {
        this.render();
        const slider = this._root.querySelector('input[type="range"]');
        if (slider) slider.value = this._year;
      }, 0);
    }

    set_calmoth_sap(period) {
      if (period.length !== 6) return;
      const yyyy = parseInt(period.substring(0, 4));
      const mm = parseInt(period.substring(4, 6));
      if (isNaN(mm) || isNaN(yyyy)) return;
      this._year = yyyy;
      this._month = mm - 1;
      setTimeout(() => {
        this.render();
        const slider = this._root.querySelector('input[type="range"]');
        if (slider) slider.value = this._year;
      }, 0);
    }
  }

  customElements.define("com-sap-analytics-custom-widget-monthlycalendar-2", KalendarzMiesieczny2);
})();

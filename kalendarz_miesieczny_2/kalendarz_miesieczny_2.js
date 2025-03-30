(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      #root {
        width: 100%;
        height: 100%;
        font-family: Arial, sans-serif;
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
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
        width: 100%;
      }
      .slider-container input[type="range"] {
        flex-grow: 1;
        max-width: 400px;
        margin: 0 10px;
        accent-color: var(--slider-color, #3399ff);
      }
      .slider-container button {
        padding: 5px 10px;
        margin: 0 5px;
        cursor: pointer;
      }
      table {
        width: 100%;
		border-collapse: collapse;
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
      }
      table, th, td {
        border: 1px solid #ccc;
      }
      th, td {
        padding: 10px;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
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
      this.properties = {}; // 🛡️ Zabezpieczenie – domyślna pusta konfiguracja
      this.render();
    }

    onCustomWidgetResize(width, height) {
      this._root.style.width = width + "px";
      this._root.style.height = height + "px";
      this.render();
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this.properties = { ...this.properties, ...changedProperties };
    }

    onCustomWidgetAfterUpdate() {
      this.render();
    }

    render() {
      const props = this.properties || {};
      const t = {
        months: props.numericMonths
          ? ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
          : ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
        quarters: ["Q1", "Q2", "Q3", "Q4"]
      };

      const sliderMin = parseInt(props.minYear || this._baseYear - 20);
      const sliderMax = parseInt(props.maxYear || this._baseYear + 10);
      const sliderColor = props.sliderColor || "#3399ff";

      this._root.innerHTML = "";

      const periodHeader = document.createElement("h2");
      periodHeader.innerText = this.get_calmoth();
      this._root.appendChild(periodHeader);

      const sliderContainer = document.createElement("div");
      sliderContainer.className = "slider-container";

      const createButton = (label, change) => {
        const btn = document.createElement("button");
        btn.innerText = label;
        btn.addEventListener("click", () => {
          this._year = Math.max(sliderMin, Math.min(sliderMax, this._year + change));
          slider.value = this._year;
          periodHeader.innerText = this.get_calmoth();
          this.dispatchEvent(new CustomEvent("onSelect", {
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
      slider.style.setProperty("--slider-color", sliderColor);
      slider.addEventListener("input", () => {
        this._year = parseInt(slider.value);
        periodHeader.innerText = this.get_calmoth();
      });
      slider.addEventListener("change", () => {
        this.dispatchEvent(new CustomEvent("onSelect", {
          detail: { type: "year", value: this._year, selected: true }
        }));
      });
      sliderContainer.appendChild(slider);

      sliderContainer.appendChild(createButton(">", 1));
      sliderContainer.appendChild(createButton(">>", 5));
      this._root.appendChild(sliderContainer);

      const table = document.createElement("table");
      const rows = Array.from({ length: 4 }, () => document.createElement("tr"));
      rows.forEach(row => table.appendChild(row));

      for (let q = 0; q < 4; q++) {
        const th = document.createElement("th");
        th.innerText = t.quarters[q];
        th.addEventListener("click", () => {
          const allCells = table.querySelectorAll("th, td");
          allCells.forEach(cell => cell.classList.remove("selected"));
          th.classList.add("selected");

          const lastMonthIndex = q * 3 + 2;
          rows[3].children[q].classList.add("selected");
          this._month = lastMonthIndex;

          this.dispatchEvent(new CustomEvent("onSelect", {
            detail: { type: "quarter", value: th.innerText, selected: true }
          }));
          periodHeader.innerText = this.get_calmoth();
        });
        rows[0].appendChild(th);

        for (let m = 0; m < 3; m++) {
          const td = document.createElement("td");
          const monthIndex = q * 3 + m;
          td.innerText = t.months[monthIndex];
          if (monthIndex === this._month) td.classList.add("selected");
          td.addEventListener("click", () => {
            const allCells = table.querySelectorAll("th, td");
            allCells.forEach(cell => cell.classList.remove("selected"));
            td.classList.add("selected");
            this._month = monthIndex;
            this.dispatchEvent(new CustomEvent("onSelect", {
              detail: { type: "month", value: td.innerText, selected: true }
            }));
            periodHeader.innerText = this.get_calmoth();
          });
          rows[m + 1].appendChild(td);
        }
      }

      this._root.appendChild(table);
    }

    get_calmoth() {
      const m = this._month + 1;
      return (m < 10 ? "0" + m : m) + "." + this._year;
    }

    get_calmoth_sap() {
      const m = this._month + 1;
      return this._year.toString() + (m < 10 ? "0" + m : m);
    }

    get_calquarter() {
      const q = Math.floor(this._month / 3) + 1;
      return this._year.toString() + q;
    }

    set_calmoth(period) {
      const parts = period.split(".");
      if (parts.length === 2) {
        this._year = parseInt(parts[1]);
        this._month = parseInt(parts[0]) - 1;
        setTimeout(() => this.render(), 0);
      }
    }

    set_calmoth_sap(period) {
      if (period.length === 6) {
        this._year = parseInt(period.substring(0, 4));
        this._month = parseInt(period.substring(4, 6)) - 1;
        setTimeout(() => this.render(), 0);
      }
    }
  }

  customElements.define("com-sap-analytics-custom-widget-monthlycalendar-2", KalendarzMiesieczny2);
})();

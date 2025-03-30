(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      #root {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        font-size: var(--font-size, 14px);
        font-family: var(--font-family, Arial);
        color: var(--font-color, #000);
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
        background-color: var(--button-bg, #f0f0f0);
        color: var(--button-text, #000000);
        border: 1px solid #ccc;
      }
      table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        margin-top: 10px;
      }
      table, th, td {
        border: 1px solid #ccc;
      }
      th, td {
        width: 25%;
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
        cursor: pointer;
      }
      th {
        background-color: var(--quarter-bg, #eeeeee);
      }
      td {
        background-color: var(--month-bg, #ffffff);
      }
      .selected {
        background-color: var(--selected-bg, lightblue) !important;
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
      this.properties = {};
      this.render();
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      const defaults = {
        minYear: 2000,
        maxYear: 2035,
        numericMonths: false,
        monthBgColor: "#ffffff",
        quarterBgColor: "#eeeeee",
        fontColor: "#000000",
        fontFamily: "Arial",
        activeCellColor: "lightblue",
        buttonColor: "#f0f0f0",
        buttonTextColor: "#000000",
        sliderColor: "#3399ff",
        fontSize: "14px"
      };
      this.properties = Object.assign({}, defaults, this.properties, changedProperties);
    }

    onCustomWidgetAfterUpdate() {
      this.render();
    }

    onCustomWidgetResize(width, height) {
      this._root.style.width = width + "px";
      this._root.style.height = height + "px";
      this.render();
    }

    applyStyles() {
      const styles = {
        "--month-bg": this.properties.monthBgColor,
        "--quarter-bg": this.properties.quarterBgColor,
        "--font-color": this.properties.fontColor,
        "--font-family": this.properties.fontFamily,
        "--selected-bg": this.properties.activeCellColor,
        "--button-bg": this.properties.buttonColor,
        "--button-text": this.properties.buttonTextColor,
        "--slider-color": this.properties.sliderColor,
        "--font-size": this.properties.fontSize
      };
      Object.entries(styles).forEach(([key, value]) => {
        this._root.style.setProperty(key, value);
      });
    }

    render() {
      this.applyStyles();
      const sliderMin = this.properties.minYear;
      const sliderMax = this.properties.maxYear;
      const months = this.properties.numericMonths
        ? ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
        : ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      this._root.innerHTML = "";

      const header = document.createElement("h2");
      header.innerText = this.get_calmoth();
      this._root.appendChild(header);

      const sliderContainer = document.createElement("div");
      sliderContainer.className = "slider-container";

      const createBtn = (label, step) => {
        const btn = document.createElement("button");
        btn.innerText = label;
        btn.addEventListener("click", () => {
          this._year = Math.max(sliderMin, Math.min(sliderMax, this._year + step));
          slider.value = this._year;
          header.innerText = this.get_calmoth();
          this.dispatchEvent(new CustomEvent("onSelect", {
            detail: { type: "year", value: this._year, selected: true }
          }));
        });
        return btn;
      };

      sliderContainer.appendChild(createBtn("<<", -5));
      sliderContainer.appendChild(createBtn("<", -1));

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = sliderMin.toString();
      slider.max = sliderMax.toString();
      slider.value = this._year;
      slider.addEventListener("input", () => {
        this._year = parseInt(slider.value);
        header.innerText = this.get_calmoth();
      });
      slider.addEventListener("change", () => {
        this.dispatchEvent(new CustomEvent("onSelect", {
          detail: { type: "year", value: this._year, selected: true }
        }));
      });

      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(createBtn(">", 1));
      sliderContainer.appendChild(createBtn(">>", 5));
      this._root.appendChild(sliderContainer);

      const table = document.createElement("table");
      const rows = Array.from({ length: 4 }, () => document.createElement("tr"));
      rows.forEach(row => table.appendChild(row));

      for (let q = 0; q < 4; q++) {
        const th = document.createElement("th");
        th.innerText = quarters[q];
        th.addEventListener("click", () => {
          const allCells = table.querySelectorAll("th, td");
          allCells.forEach(cell => cell.classList.remove("selected"));
          th.classList.add("selected");
          const td = rows[3].children[q];
          if (td) {
            td.classList.add("selected");
            this._month = q * 3 + 2;
          }
          header.innerText = this.get_calmoth();
          this.dispatchEvent(new CustomEvent("onSelect", {
            detail: { type: "quarter", value: th.innerText, selected: true }
          }));
        });
        rows[0].appendChild(th);

        for (let m = 0; m < 3; m++) {
          const td = document.createElement("td");
          const monthIndex = q * 3 + m;
          td.innerText = months[monthIndex];
          if (monthIndex === this._month) td.classList.add("selected");
          td.addEventListener("click", () => {
            const allCells = table.querySelectorAll("th, td");
            allCells.forEach(cell => cell.classList.remove("selected"));
            td.classList.add("selected");
            this._month = monthIndex;
            header.innerText = this.get_calmoth();
            this.dispatchEvent(new CustomEvent("onSelect", {
              detail: { type: "month", value: td.innerText, selected: true }
            }));
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

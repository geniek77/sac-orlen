(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <form id="form">
      <fieldset>
        <legend>Ustawienia kalendarza</legend>
        
        <label>Minimalny rok:</label><br>
        <input type="number" id="minYear"><br><br>

        <label>Maksymalny rok:</label><br>
        <input type="number" id="maxYear"><br><br>

        <label>Miesiące numerycznie:</label><br>
        <input type="checkbox" id="numericMonths"><br><br>

        <label>Kolor tła miesięcy:</label><br>
        <input type="color" id="monthBgColor"><br><br>

        <label>Kolor tła kwartałów:</label><br>
        <input type="color" id="quarterBgColor"><br><br>

        <label>Kolor czcionki:</label><br>
        <input type="color" id="fontColor"><br><br>

        <label>Czcionka (nazwa, np. Arial):</label><br>
        <input type="text" id="fontFamily"><br><br>

        <label>Kolor aktywnej komórki:</label><br>
        <input type="color" id="activeCellColor"><br><br>

        <label>Kolor tła przycisków:</label><br>
        <input type="color" id="buttonColor"><br><br>

        <label>Kolor tekstu przycisków:</label><br>
        <input type="color" id="buttonTextColor"><br><br>
      </fieldset>
    </form>
  `;

  class KalendarzMiesieczny2Builder {
    constructor() {
      this._shadowRoot = null;
      this._props = {};
    }

    render(container, changedCallback) {
      if (!this._shadowRoot) {
        this._shadowRoot = container.attachShadow({ mode: "open" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
      }

      const form = this._shadowRoot.getElementById("form");

      const fields = [
        "minYear", "maxYear", "numericMonths",
        "monthBgColor", "quarterBgColor",
        "fontColor", "fontFamily",
        "activeCellColor", "buttonColor", "buttonTextColor"
      ];

      fields.forEach(field => {
        const input = this._shadowRoot.getElementById(field);
        const value = this._props[field];

        if (input) {
          if (input.type === "checkbox") {
            input.checked = !!value;
          } else {
            input.value = value ?? "";
          }

          input.addEventListener("input", () => this._notifyChange(changedCallback));
          input.addEventListener("change", () => this._notifyChange(changedCallback));
        }
      });
    }

    _notifyChange(callback) {
      const getVal = (id) => {
        const el = this._shadowRoot.getElementById(id);
        if (!el) return undefined;
        if (el.type === "checkbox") return el.checked;
        return el.value;
      };

      const newProps = {
        minYear: parseInt(getVal("minYear")),
        maxYear: parseInt(getVal("maxYear")),
        numericMonths: getVal("numericMonths"),
        monthBgColor: getVal("monthBgColor"),
        quarterBgColor: getVal("quarterBgColor"),
        fontColor: getVal("fontColor"),
        fontFamily: getVal("fontFamily"),
        activeCellColor: getVal("activeCellColor"),
        buttonColor: getVal("buttonColor"),
        buttonTextColor: getVal("buttonTextColor")
      };

      this._props = newProps;
      callback(this._props);
    }

    getProperties() {
      return this._props;
    }

    setProperties(properties) {
      this._props = properties || {};
    }
  }

  customElements.define(
    "com-sap-analytics-custom-widget-monthlycalendar-2-builder",
    KalendarzMiesieczny2Builder
  );
})();

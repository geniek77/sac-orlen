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

        <label>Czcionka (np. Arial):</label><br>
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

  class KalendarzMiesieczny2Builder extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      this._initListeners();
    }

    _initListeners() {
      const form = this._shadowRoot.getElementById("form");
      form.addEventListener("input", () => this._firePropertiesChanged());
      form.addEventListener("change", () => this._firePropertiesChanged());
    }

    _firePropertiesChanged() {
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: this.getProperties()
        }
      }));
    }

    getProperties() {
      const getVal = (id, isCheckbox = false) => {
        const el = this._shadowRoot.getElementById(id);
        if (!el) return undefined;
        return isCheckbox ? el.checked : el.value;
      };

      return {
        minYear: parseInt(getVal("minYear")),
        maxYear: parseInt(getVal("maxYear")),
        numericMonths: getVal("numericMonths", true),
        monthBgColor: getVal("monthBgColor"),
        quarterBgColor: getVal("quarterBgColor"),
        fontColor: getVal("fontColor"),
        fontFamily: getVal("fontFamily"),
        activeCellColor: getVal("activeCellColor"),
        buttonColor: getVal("buttonColor"),
        buttonTextColor: getVal("buttonTextColor")
      };
    }

    setProperties(properties) {
      const setVal = (id, value, isCheckbox = false) => {
        const el = this._shadowRoot.getElementById(id);
        if (el) {
          if (isCheckbox) {
            el.checked = !!value;
          } else {
            el.value = value ?? "";
          }
        }
      };

      setVal("minYear", properties.minYear);
      setVal("maxYear", properties.maxYear);
      setVal("numericMonths", properties.numericMonths, true);
      setVal("monthBgColor", properties.monthBgColor);
      setVal("quarterBgColor", properties.quarterBgColor);
      setVal("fontColor", properties.fontColor);
      setVal("fontFamily", properties.fontFamily);
      setVal("activeCellColor", properties.activeCellColor);
      setVal("buttonColor", properties.buttonColor);
      setVal("buttonTextColor", properties.buttonTextColor);
    }
  }

  customElements.define(
    "com-sap-analytics-custom-widget-monthlycalendar-2-builder",
    KalendarzMiesieczny2Builder
  );
})();

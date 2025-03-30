(function () {
  const template = document.createElement("template");
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

        <button type="submit">Zapisz</button>
      </fieldset>
    </form>
  `;

  class KalendarzMiesieczny2Builder extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._shadowRoot.getElementById("form").addEventListener("submit", e => {
        e.preventDefault();
        this._updateProperties();
      });
    }

    getProperties() {
      return {
        minYear: parseInt(this._shadowRoot.getElementById("minYear").value),
        maxYear: parseInt(this._shadowRoot.getElementById("maxYear").value),
        numericMonths: this._shadowRoot.getElementById("numericMonths").checked,
        monthBgColor: this._shadowRoot.getElementById("monthBgColor").value,
        quarterBgColor: this._shadowRoot.getElementById("quarterBgColor").value,
        fontColor: this._shadowRoot.getElementById("fontColor").value,
        fontFamily: this._shadowRoot.getElementById("fontFamily").value,
        activeCellColor: this._shadowRoot.getElementById("activeCellColor").value,
        buttonColor: this._shadowRoot.getElementById("buttonColor").value,
        buttonTextColor: this._shadowRoot.getElementById("buttonTextColor").value
      };
    }

    setProperties(properties) {
      this._shadowRoot.getElementById("minYear").value = properties.minYear ?? 2000;
      this._shadowRoot.getElementById("maxYear").value = properties.maxYear ?? 2035;
      this._shadowRoot.getElementById("numericMonths").checked = !!properties.numericMonths;
      this._shadowRoot.getElementById("monthBgColor").value = properties.monthBgColor ?? "#ffffff";
      this._shadowRoot.getElementById("quarterBgColor").value = properties.quarterBgColor ?? "#eeeeee";
      this._shadowRoot.getElementById("fontColor").value = properties.fontColor ?? "#000000";
      this._shadowRoot.getElementById("fontFamily").value = properties.fontFamily ?? "Arial";
      this._shadowRoot.getElementById("activeCellColor").value = properties.activeCellColor ?? "lightblue";
      this._shadowRoot.getElementById("buttonColor").value = properties.buttonColor ?? "#f0f0f0";
      this._shadowRoot.getElementById("buttonTextColor").value = properties.buttonTextColor ?? "#000000";
    }

    _updateProperties() {
      const properties = this.getProperties();

      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: { properties }
      }));
    }
  }

  customElements.define(
    "com-sap-analytics-custom-widget-monthlycalendar-2-builder",
    KalendarzMiesieczny2Builder
  );
})();

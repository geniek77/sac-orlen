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

        <label>Kolor suwaka:</label><br>
        <input type="color" id="sliderColor"><br><br>

        <button type="submit">Zapisz</button>
      </fieldset>
    </form>
  `;

  class KalendarzMiesieczny2Builder extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._shadowRoot.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault();
        this._firePropertiesChanged();
      });
    }

    _firePropertiesChanged() {
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: { properties: this.getProperties() }
      }));
    }

    getProperties() {
      return {
        minYear: this.minYear,
        maxYear: this.maxYear,
        numericMonths: this.numericMonths,
        monthBgColor: this.monthBgColor,
        quarterBgColor: this.quarterBgColor,
        fontColor: this.fontColor,
        fontFamily: this.fontFamily,
        activeCellColor: this.activeCellColor,
        buttonColor: this.buttonColor,
        buttonTextColor: this.buttonTextColor,
        sliderColor: this.sliderColor
      };
    }

    get minYear() { return parseInt(this._shadowRoot.getElementById("minYear").value); }
    set minYear(value) { this._shadowRoot.getElementById("minYear").value = value; }

    get maxYear() { return parseInt(this._shadowRoot.getElementById("maxYear").value); }
    set maxYear(value) { this._shadowRoot.getElementById("maxYear").value = value; }

    get numericMonths() { return this._shadowRoot.getElementById("numericMonths").checked; }
    set numericMonths(value) { this._shadowRoot.getElementById("numericMonths").checked = value; }

    get monthBgColor() { return this._shadowRoot.getElementById("monthBgColor").value; }
    set monthBgColor(value) { this._shadowRoot.getElementById("monthBgColor").value = value; }

    get quarterBgColor() { return this._shadowRoot.getElementById("quarterBgColor").value; }
    set quarterBgColor(value) { this._shadowRoot.getElementById("quarterBgColor").value = value; }

    get fontColor() { return this._shadowRoot.getElementById("fontColor").value; }
    set fontColor(value) { this._shadowRoot.getElementById("fontColor").value = value; }

    get fontFamily() { return this._shadowRoot.getElementById("fontFamily").value; }
    set fontFamily(value) { this._shadowRoot.getElementById("fontFamily").value = value; }

    get activeCellColor() { return this._shadowRoot.getElementById("activeCellColor").value; }
    set activeCellColor(value) { this._shadowRoot.getElementById("activeCellColor").value = value; }

    get buttonColor() { return this._shadowRoot.getElementById("buttonColor").value; }
    set buttonColor(value) { this._shadowRoot.getElementById("buttonColor").value = value; }

    get buttonTextColor() { return this._shadowRoot.getElementById("buttonTextColor").value; }
    set buttonTextColor(value) { this._shadowRoot.getElementById("buttonTextColor").value = value; }

    get sliderColor() { return this._shadowRoot.getElementById("sliderColor").value; }
    set sliderColor(value) { this._shadowRoot.getElementById("sliderColor").value = value; }
  }

  customElements.define(
    "com-sap-analytics-custom-widget-monthlycalendar-2-builder",
    KalendarzMiesieczny2Builder
  );
})();

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

    // GET
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
        buttonTextColor: this.buttonTextColor
      };
    }

    // SET
    setProperties(props) {
      this.minYear = props.minYear ?? 2000;
      this.maxYear = props.maxYear ?? 2035;
      this.numericMonths = props.numericMonths ?? false;
      this.monthBgColor = props.monthBgColor ?? "#ffffff";
      this.quarterBgColor = props.quarterBgColor ?? "#eeeeee";
      this.fontColor = props.fontColor ?? "#000000";
      this.fontFamily = props.fontFamily ?? "Arial";
      this.activeCellColor = props.activeCellColor ?? "lightblue";
      this.buttonColor = props.buttonColor ?? "#f0f0f0";
      this.buttonTextColor = props.buttonTextColor ?? "#000000";

      this._updateFormUI();
    }

    // Przypisz dane do formularza
    _updateFormUI() {
      this._shadowRoot.getElementById("minYear").value = this.minYear;
      this._shadowRoot.getElementById("maxYear").value = this.maxYear;
      this._shadowRoot.getElementById("numericMonths").checked = this.numericMonths;
      this._shadowRoot.getElementById("monthBgColor").value = this.monthBgColor;
      this._shadowRoot.getElementById("quarterBgColor").value = this.quarterBgColor;
      this._shadowRoot.getElementById("fontColor").value = this.fontColor;
      this._shadowRoot.getElementById("fontFamily").value = this.fontFamily;
      this._shadowRoot.getElementById("activeCellColor").value = this.activeCellColor;
      this._shadowRoot.getElementById("buttonColor").value = this.buttonColor;
      this._shadowRoot.getElementById("buttonTextColor").value = this.buttonTextColor;
    }

    // Odczyt z formularza do obiektu klasy + wysyłka do SAC
    _updateProperties() {
      this.minYear = parseInt(this._shadowRoot.getElementById("minYear").value);
      this.maxYear = parseInt(this._shadowRoot.getElementById("maxYear").value);
      this.numericMonths = this._shadowRoot.getElementById("numericMonths").checked;
      this.monthBgColor = this._shadowRoot.getElementById("monthBgColor").value;
      this.quarterBgColor = this._shadowRoot.getElementById("quarterBgColor").value;
      this.fontColor = this._shadowRoot.getElementById("fontColor").value;
      this.fontFamily = this._shadowRoot.getElementById("fontFamily").value;
      this.activeCellColor = this._shadowRoot.getElementById("activeCellColor").value;
      this.buttonColor = this._shadowRoot.getElementById("buttonColor").value;
      this.buttonTextColor = this._shadowRoot.getElementById("buttonTextColor").value;

      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: this.getProperties()
        }
      }));
    }
  }

  customElements.define(
    "com-sap-analytics-custom-widget-monthlycalendar-2-builder",
    KalendarzMiesieczny2Builder
  );
})();

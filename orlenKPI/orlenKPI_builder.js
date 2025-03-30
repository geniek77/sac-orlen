(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <form id="form">
      <fieldset>
        <legend>Konfiguracja orlenKPI</legend>
        <label>Tytuł:</label><br>
        <input type="text" id="title"><br>
        <label>Wartość główna:</label><br>
        <input type="text" id="mainValue"><br>
        <label>Zmiana B:</label><br>
        <input type="text" id="deltaB"><br>
        <label>Zmiana B %:</label><br>
        <input type="text" id="deltaBPercent"><br>
        <label>Zmiana R/R:</label><br>
        <input type="text" id="deltaRR"><br>
        <label>Zmiana R/R %:</label><br>
        <input type="text" id="deltaRRPercent"><br><br>

        <label>Kolor słupka:</label><br>
        <input type="color" id="barColor"><br>
        <label>Kolor tekstu:</label><br>
        <input type="color" id="fontColor"><br>
        <label>Tło wartości B:</label><br>
        <input type="color" id="bgUpColor"><br>
        <label>Tło wartości R/R:</label><br>
        <input type="color" id="bgDownColor"><br>
        <label>Czcionka:</label><br>
        <input type="text" id="fontFamily"><br>
        <label>Rozmiar czcionki:</label><br>
        <input type="text" id="fontSize"><br><br>

        <button type="submit">Zapisz</button>
      </fieldset>
    </form>
  `;

  class OrlenKPIBuilder extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._shadowRoot.getElementById("form").addEventListener("submit", e => {
        e.preventDefault();
        this._firePropertiesChanged();
      });
    }

    _firePropertiesChanged() {
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: this.getProperties()
        }
      }));
    }

    getProperties() {
      const ids = [
        "title", "mainValue", "deltaB", "deltaBPercent", "deltaRR", "deltaRRPercent",
        "barColor", "fontColor", "bgUpColor", "bgDownColor", "fontFamily", "fontSize"
      ];
      const props = {};
      ids.forEach(id => {
        props[id] = this._shadowRoot.getElementById(id).value;
      });
      return props;
    }

    setProperties(properties) {
      const ids = [
        "title", "mainValue", "deltaB", "deltaBPercent", "deltaRR", "deltaRRPercent",
        "barColor", "fontColor", "bgUpColor", "bgDownColor", "fontFamily", "fontSize"
      ];
      ids.forEach(id => {
        this._shadowRoot.getElementById(id).value = properties[id] || "";
      });
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi-builder", OrlenKPIBuilder);
})();

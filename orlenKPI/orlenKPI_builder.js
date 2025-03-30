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
        <input type="text" id="fontSize"><br>
        <label>Etykieta B:</label><br>
        <input type="text" id="labelB"><br>
        <label>Etykieta R/R:</label><br>
        <input type="text" id="labelRR"><br>
        <label>Kolor tekstu B:</label><br>
        <input type="color" id="textColorB"><br>
        <label>Kolor tekstu R/R:</label><br>
        <input type="color" id="textColorRR"><br>
        <label>Kolor strzałki B:</label><br>
        <input type="color" id="arrowColorB"><br>
        <label>Kierunek strzałki B:</label><br>
        <select id="arrowDirectionB">
          <option value="up">▲ Góra</option>
          <option value="down">▼ Dół</option>
          <option value="none">Brak</option>
        </select><br>
        <label>Kolor strzałki R/R:</label><br>
        <input type="color" id="arrowColorRR"><br>
        <label>Kierunek strzałki R/R:</label><br>
        <select id="arrowDirectionRR">
          <option value="up">▲ Góra</option>
          <option value="down">▼ Dół</option>
          <option value="none">Brak</option>
        </select><br><br>

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
        "barColor", "fontColor", "bgUpColor", "bgDownColor", "fontFamily", "fontSize",
        "labelB", "labelRR", "textColorB", "textColorRR",
        "arrowColorB", "arrowColorRR", "arrowDirectionB", "arrowDirectionRR"
      ];
      const props = {};
      ids.forEach(id => {
        const el = this._shadowRoot.getElementById(id);
        props[id] = el?.value || "";
      });
      return props;
    }

    setProperties(properties) {
      const ids = [
        "title", "mainValue", "deltaB", "deltaBPercent", "deltaRR", "deltaRRPercent",
        "barColor", "fontColor", "bgUpColor", "bgDownColor", "fontFamily", "fontSize",
        "labelB", "labelRR", "textColorB", "textColorRR",
        "arrowColorB", "arrowColorRR", "arrowDirectionB", "arrowDirectionRR"
      ];
      ids.forEach(id => {
        const el = this._shadowRoot.getElementById(id);
        if (el) el.value = properties[id] || "";
      });
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi-builder", OrlenKPIBuilder);
})();

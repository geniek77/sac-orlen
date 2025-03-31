(function () {
  const template = document.createElement("template");
  template.innerHTML = `
<style>
  .tab-content { display: none; }
  input[name="tab-control"]:checked + label + .tab-content { display: block; }
  .tab-label { font-weight: bold; margin-right: 10px; cursor: pointer; display: inline-block; }
</style>

<input type="radio" id="tab-main" name="tab-control" checked hidden>
<label for="tab-main" class="tab-label">Element główny</label>
<div class="tab-content">
  <label>Tytuł:</label><br>
  <input type="text" id="title"><br>
  <label>Wartość główna:</label><br>
  <input type="text" id="mainValue"><br>
  <label>Czcionka tytułu:</label><br>
  <input type="text" id="titleFontFamily"><br>
  <label>Rozmiar czcionki tytułu:</label><br>
  <input type="text" id="titleFontSize"><br>
  <label>Czcionka wartości głównej:</label><br>
  <input type="text" id="mainValueFontFamily"><br>
  <label>Rozmiar wartości głównej:</label><br>
  <input type="text" id="mainValueFontSize"><br>
  <label>Kolor słupka:</label><br>
  <input type="color" id="barColor"><br>
  <label>Kolor tekstu:</label><br>
  <input type="color" id="fontColor"><br>
</div>

<input type="radio" id="tab-delta" name="tab-control" hidden>
<label for="tab-delta" class="tab-label">Delta</label>
<div class="tab-content">
  <label>Zmiana B:</label><br>
  <input type="text" id="deltaB"><br>
  <label>Zmiana B %:</label><br>
  <input type="text" id="deltaBPercent"><br>
  <label>Zmiana R/R:</label><br>
  <input type="text" id="deltaRR"><br>
  <label>Zmiana R/R %:</label><br>
  <input type="text" id="deltaRRPercent"><br>
  <label>Etykieta B:</label><br>
  <input type="text" id="labelB"><br>
  <label>Etykieta R/R:</label><br>
  <input type="text" id="labelRR"><br>
  <label>Kolor tekstu B:</label><br>
  <input type="color" id="textColorB"><br>
  <label>Kolor tekstu R/R:</label><br>
  <input type="color" id="textColorRR"><br>
  <label>Tło wartości B:</label><br>
  <input type="color" id="bgUpColor"><br>
  <label>Tło wartości R/R:</label><br>
  <input type="color" id="bgDownColor"><br>
  <label>Czcionka dla wartości delta:</label><br>
  <input type="text" id="deltaFontFamily"><br>
  <label>Rozmiar czcionki dla delta:</label><br>
  <input type="text" id="deltaFontSize"><br>
  <label>Krój czcionki dla delta:</label><br>
  <input type="text" id="deltaFontWeight"><br>
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
  </select><br>
</div>

<br><button type="submit">Zapisz</button>
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
        "arrowColorB", "arrowColorRR", "arrowDirectionB", "arrowDirectionRR",
        "barColor", "fontColor", "bgUpColor", "bgDownColor", "fontFamily", "fontSize",
        "deltaFontFamily",
        "deltaFontSize",
        "deltaFontWeight",
        "labelB", "labelRR", "textColorB", "textColorRR",
        "mainValueFontFamily",
        "mainValueFontSize",
        "title", "mainValue", "deltaB", "deltaBPercent", "deltaRR", "deltaRRPercent",
        "titleFontFamily",
        "titleFontSize"
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
        "arrowColorB", "arrowColorRR", "arrowDirectionB", "arrowDirectionRR",
        "barColor", "fontColor", "bgUpColor", "bgDownColor", "fontFamily", "fontSize",
        "deltaFontFamily",
        "deltaFontSize",
        "deltaFontWeight",
        "labelB", "labelRR", "textColorB", "textColorRR",
        "mainValueFontFamily",
        "mainValueFontSize",
        "title", "mainValue", "deltaB", "deltaBPercent", "deltaRR", "deltaRRPercent",
        "titleFontFamily",
        "titleFontSize"
      ];
      ids.forEach(id => {
        const el = this._shadowRoot.getElementById(id);
        if (el) el.value = properties[id] || "";
      });
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi-builder", OrlenKPIBuilder);
})();

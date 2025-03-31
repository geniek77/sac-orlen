(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <form id="form">
      <fieldset>
        <legend>Konfiguracja orlenKPI</legend>

        <label>Tytuł:</label><br><input type="text" id="title"><br>
        <label>Wartość główna:</label><br><input type="text" id="mainValue"><br>
        <label>Delta B:</label><br><input type="text" id="deltaB"><br>
        <label>Delta B %:</label><br><input type="text" id="deltaBPercent"><br>
        <label>Delta R/R:</label><br><input type="text" id="deltaRR"><br>
        <label>Delta R/R %:</label><br><input type="text" id="deltaRRPercent"><br>
        <label>Kolor słupka:</label><br><input type="color" id="barColor"><br>
        <label>Kolor tekstu:</label><br><input type="color" id="fontColor"><br>
        <label>Tło wartości B:</label><br><input type="color" id="bgUpColor"><br>
        <label>Tło wartości R/R:</label><br><input type="color" id="bgDownColor"><br>
        <label>Czcionka tytułu:</label><br><input type="text" id="titleFontFamily"><br>
        <label>Rozmiar tytułu:</label><br><input type="text" id="titleFontSize"><br>
        <label>Czcionka główna:</label><br><input type="text" id="mainValueFontFamily"><br>
        <label>Rozmiar głównej:</label><br><input type="text" id="mainValueFontSize"><br>
        <label>Czcionka delta:</label><br><input type="text" id="deltaFontFamily"><br>
        <label>Rozmiar delta:</label><br><input type="text" id="deltaFontSize"><br>
        <label>Krój delta:</label><br><input type="text" id="deltaFontWeight"><br>
        <label>Etykieta B:</label><br><input type="text" id="labelB"><br>
        <label>Etykieta R/R:</label><br><input type="text" id="labelRR"><br>
        <label>Kolor tekstu B:</label><br><input type="color" id="textColorB"><br>
        <label>Kolor tekstu R/R:</label><br><input type="color" id="textColorRR"><br>
        <label>Kolor trójkąta B:</label><br><input type="color" id="arrowColorB"><br>
        <label>Kierunek trójkąta B:</label><br>
        <select id="arrowDirectionB">
          <option value="up">▲ Góra</option>
          <option value="down">▼ Dół</option>
          <option value="none">Brak</option>
        </select><br>
        <label>Kolor trójkąta R/R:</label><br><input type="color" id="arrowColorRR"><br>
        <label>Kierunek trójkąta R/R:</label><br>
        <select id="arrowDirectionRR">
          <option value="up">▲ Góra</option>
          <option value="down">▼ Dół</option>
          <option value="none">Brak</option>
        </select><br>

        <br><button type="submit">Zapisz</button>
      </fieldset>
    </form>
  `;

  const DEFAULTS = {
    title: "EBITDA LIFO",
    mainValue: "315,8",
    deltaB: "+198",
    deltaBPercent: "+168%",
    deltaRR: "-521",
    deltaRRPercent: "-254%",
    barColor: "#006400",
    fontColor: "#000000",
    bgUpColor: "#dff0d8",
    bgDownColor: "#f2dede",
    fontFamily: "Arial",
    fontSize: "14px",
    titleFontFamily: "Arial",
    titleFontSize: "16px",
    mainValueFontFamily: "Arial",
    mainValueFontSize: "28px",
    deltaFontFamily: "Arial",
    deltaFontSize: "14px",
    deltaFontWeight: "bold",
    labelB: "B",
    labelRR: "R/R",
    textColorB: "#006400",
    textColorRR: "#a94442",
    arrowColorB: "#006400",
    arrowDirectionB: "up",
    arrowColorRR: "#a94442",
    arrowDirectionRR: "down"
  };

  class OrlenKPIBuilder extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._form = this._shadowRoot.getElementById("form");
      this._form.addEventListener("submit", this._handleSubmit.bind(this));
      this._initialized = false;
    }

    connectedCallback() {
      this._initialized = true;
      if (this._pendingProperties) {
        this.setProperties(this._pendingProperties);
        this._pendingProperties = null;
      }
    }

    _handleSubmit(e) {
      e.preventDefault();
      this._firePropertiesChanged();
    }

    _firePropertiesChanged() {
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: { properties: this.getProperties() }
      }));
    }

    getProperties() {
      const props = {};
      Object.keys(DEFAULTS).forEach(id => {
        const el = this._shadowRoot.getElementById(id);
        props[id] = el ? el.value : DEFAULTS[id];
      });
      return props;
    }

    setProperties(properties) {
      if (!this._initialized) {
        this._pendingProperties = properties;
        return;
      }
      
      if (!this._shadowRoot) return;

      Object.keys(DEFAULTS).forEach(id => {
        const el = this._shadowRoot.getElementById(id);
        if (!el) return;
        
        const defaultValue = DEFAULTS[id];
        let newValue = properties[id];
        
        if (newValue === undefined || newValue === null) {
          newValue = defaultValue;
        }
        
        if (el.type === 'color') {
          el.value = (newValue && typeof newValue === 'string' && newValue.startsWith('#')) ? newValue : defaultValue;
        } 
        else if (el.tagName === 'SELECT') {
          const optionExists = Array.from(el.options).some(opt => opt.value === newValue);
          el.value = optionExists ? newValue : defaultValue;
        }
        else {
          el.value = newValue !== undefined ? newValue : defaultValue;
        }
      });
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi-builder", OrlenKPIBuilder);
})();
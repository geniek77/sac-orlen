(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <form id="form">
      <fieldset>
        <legend>Konfiguracja orlenKPI</legend>

        <label>Tytuł:</label><br><input type="text" id="title"><br>
        <label>Wartość główna:</label><br><input type="text" id="mainValue"><br>
        
        <fieldset>
          <legend>Styl tytułu</legend>
          <label>Czcionka:</label>
          <select id="titleFontFamily">
            <option value="'72'">72 (SAP Default)</option>
            <option value="'72-Light'">72 Light</option>
            <option value="'72-Bold'">72 Bold</option>
            <option value="'72-Condensed'">72 Condensed</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
          </select><br>
          <label>Krój:</label>
          <select id="titleFontWeight">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="600">Semi Bold</option>
          </select><br>
        </fieldset>

        <fieldset>
          <legend>Styl wartości głównej</legend>
          <label>Czcionka:</label>
          <select id="mainValueFontFamily">
            <option value="'72'">72 (SAP Default)</option>
            <option value="'72-Bold'">72 Bold</option>
            <option value="Arial">Arial</option>
          </select><br>
          <label>Krój:</label>
          <select id="mainValueFontWeight">
            <option value="bold">Bold</option>
            <option value="600">Semi Bold</option>
          </select><br>
        </fieldset>

        <fieldset>
          <legend>Wartości Delta</legend>
          <label>Delta B:</label><br><input type="text" id="deltaB"><br>
          <label>Delta B %:</label><br><input type="text" id="deltaBPercent"><br>
          <label>Delta R/R:</label><br><input type="text" id="deltaRR"><br>
          <label>Delta R/R %:</label><br><input type="text" id="deltaRRPercent"><br>
        </fieldset>

        <fieldset>
          <legend>Styl Delta B</legend>
          <label>Czcionka:</label>
          <select id="deltaBFontFamily">
            <option value="'72'">72 (SAP Default)</option>
            <option value="'72-Light'">72 Light</option>
            <option value="Arial">Arial</option>
          </select><br>
          <label>Krój:</label>
          <select id="deltaBFontWeight">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select><br>
          <label>Rozmiar czcionki:</label><br><input type="text" id="deltaBFontSize"><br>
          <label>Tło:</label><br><input type="color" id="deltaBBackgroundColor"><br>
          <label>Kolor tekstu:</label><br><input type="color" id="textColorB"><br>
          <label>Kolor strzałki:</label><br><input type="color" id="arrowColorB"><br>
          <label>Kierunek strzałki:</label><br>
          <select id="arrowDirectionB">
            <option value="up">▲ Góra</option>
            <option value="down">▼ Dół</option>
            <option value="none">Brak</option>
          </select><br>
          <label>Padding:</label><br><input type="text" id="deltaBPadding"><br>
          <label>Zaokrąglenie rogów:</label><br><input type="text" id="deltaBBorderRadius"><br>
        </fieldset>

        <fieldset>
          <legend>Styl Delta R/R</legend>
          <label>Czcionka:</label>
          <select id="deltaRRFontFamily">
            <option value="'72'">72 (SAP Default)</option>
            <option value="'72-Light'">72 Light</option>
            <option value="Arial">Arial</option>
          </select><br>
          <label>Krój:</label>
          <select id="deltaRRFontWeight">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select><br>
          <label>Rozmiar czcionki:</label><br><input type="text" id="deltaRRFontSize"><br>
          <label>Tło:</label><br><input type="color" id="deltaRRBackgroundColor"><br>
          <label>Kolor tekstu:</label><br><input type="color" id="textColorRR"><br>
          <label>Kolor strzałki:</label><br><input type="color" id="arrowColorRR"><br>
          <label>Kierunek strzałki:</label><br>
          <select id="arrowDirectionRR">
            <option value="up">▲ Góra</option>
            <option value="down">▼ Dół</option>
            <option value="none">Brak</option>
          </select><br>
          <label>Padding:</label><br><input type="text" id="deltaRRPadding"><br>
          <label>Zaokrąglenie rogów:</label><br><input type="text" id="deltaRRBorderRadius"><br>
        </fieldset>

        <fieldset>
          <legend>Ogólne style</legend>
          <label>Kolor słupka:</label><br><input type="color" id="barColor"><br>
          <label>Kolor tekstu:</label><br><input type="color" id="fontColor"><br>
          <label>Etykieta B:</label><br><input type="text" id="labelB"><br>
          <label>Etykieta R/R:</label><br><input type="text" id="labelRR"><br>
        </fieldset>

        <br><button type="submit">Zapisz</button>
      </fieldset>
    </form>
    <style>
      select, input[type="text"], input[type="color"] {
        width: 100%;
        margin-bottom: 10px;
      }
      fieldset {
        margin-bottom: 15px;
        border: 1px solid #ddd;
        padding: 10px;
      }
      legend {
        font-weight: bold;
      }
      select option {
        font-family: inherit;
      }
      select option[value^="'72"] {
        font-family: '72', sans-serif;
      }
    </style>
  `;

  const DEFAULTS = {
    title: "EBITDA LIFO",
    mainValue: "315,8",
    deltaB: "+198",
    deltaBPercent: "+168%",
    deltaRR: "-521",
    deltaRRPercent: "-254%",
    titleFontFamily: "'72'",
    titleFontWeight: "bold",
    mainValueFontFamily: "'72'",
    mainValueFontWeight: "bold",
    deltaBFontFamily: "'72'",
    deltaBFontWeight: "bold",
    deltaRRFontFamily: "'72'",
    deltaRRFontWeight: "bold",
    deltaBFontSize: "14px",
    deltaRRFontSize: "14px",
    barColor: "#006400",
    fontColor: "#000000",
    labelB: "B",
    labelRR: "R/R",
    textColorB: "#006400",
    textColorRR: "#a94442",
    arrowColorB: "#006400",
    arrowColorRR: "#a94442",
    arrowDirectionB: "up",
    arrowDirectionRR: "down",
    deltaBBackgroundColor: "#dff0d8",
    deltaRRBackgroundColor: "#f2dede",
    deltaBPadding: "6px 8px",
    deltaRRPadding: "6px 8px",
    deltaBBorderRadius: "4px",
    deltaRRBorderRadius: "4px"
  };

  class OrlenKPIBuilder extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._form = this._shadowRoot.getElementById("form");
      this._form.addEventListener("submit", this._onSubmit.bind(this));
      this._initDefaultValues();
    }

    _initDefaultValues() {
      Object.keys(DEFAULTS).forEach(id => {
        const el = this._shadowRoot.getElementById(id);
        if (el) el.value = DEFAULTS[id];
      });
    }

    _onSubmit(e) {
      e.preventDefault();
      const formData = this._getFormData();
      
      if (!["'72'", "'72-Light'", "'72-Bold'", "'72-Condensed'"].includes(formData.titleFontFamily)) {
        alert('Dla lepszej spójności zalecane jest użycie czcionek SAP');
      }
      
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: { properties: formData }
      }));
    }

    _getFormData() {
      const props = {};
      const elements = this._form.elements;
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.id && el.id !== "form") {
          props[el.id] = el.value || DEFAULTS[el.id];
        }
      }
      return props;
    }

    setProperties(properties) {
      const propsToSet = properties || DEFAULTS;
      
      Object.keys(DEFAULTS).forEach(id => {
        const el = this._shadowRoot.getElementById(id);
        if (el) {
          const value = propsToSet[id] !== undefined ? propsToSet[id] : DEFAULTS[id];
          
          if (el.tagName === "SELECT") {
            const option = el.querySelector(`option[value="${value}"]`);
            if (option) {
              option.selected = true;
            } else {
              const defaultOption = el.querySelector(`option[value="${DEFAULTS[id]}"]`);
              if (defaultOption) defaultOption.selected = true;
            }
          } else if (el.type === "color" && !/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
            el.value = DEFAULTS[id];
          } else if (id.includes('FontSize') && !value.match(/^\d+(\.\d+)?(px|rem|em|%)$/)) {
            el.value = DEFAULTS[id];
          } else {
            el.value = value;
          }
        }
      });
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi-builder", OrlenKPIBuilder);
})();
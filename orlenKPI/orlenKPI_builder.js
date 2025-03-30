(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <form id="form">
      <fieldset>
        <legend>Konfiguracja orlenKPI</legend>
        <label>Przykładowy parametr (tekst):</label><br>
        <input type="text" id="exampleText"><br><br>
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
      return {
        exampleText: this.exampleText
      };
    }

    set exampleText(value) {
      this._shadowRoot.getElementById("exampleText").value = value;
    }

    get exampleText() {
      return this._shadowRoot.getElementById("exampleText").value;
    }

    setProperties(properties) {
      this.exampleText = properties.exampleText || "";
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi-builder", OrlenKPIBuilder);
})();

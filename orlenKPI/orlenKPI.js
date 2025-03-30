(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
      }
      #root {
        width: 100%;
        height: 100%;
        padding: 10px;
        font-family: Arial, sans-serif;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-sizing: border-box;
      }
    </style>
    <div id="root">
      <h2>orlenKPI</h2>
    </div>
  `;

  class OrlenKPI extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this.properties = { ...this.properties, ...changedProperties };
    }

    onCustomWidgetAfterUpdate() {
      this.render();
    }

    onCustomWidgetResize(width, height) {
      this._root.style.width = width + "px";
      this._root.style.height = height + "px";
    }

    render() {
      this._root.innerHTML = "<h2>orlenKPI – Widget startowy</h2>";
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();

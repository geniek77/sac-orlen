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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        font-family: var(--font-family, Arial);
        color: var(--font-color, #000);
        font-size: var(--font-size, 14px);
      }

      .kpi-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        cursor: pointer;
      }

      .kpi-header {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 4px;
      }

      .kpi-main {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .kpi-bar {
        width: 10px;
        height: 40px;
        background-color: var(--bar-color, #006400);
      }

      .kpi-value {
        font-size: 28px;
        font-weight: bold;
      }

      .kpi-matrix {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .kpi-row {
        display: flex;
        justify-content: center;
        gap: 4px;
      }

      .kpi-label {
        width: 40px;
        text-align: center;
        font-size: 12px;
      }

      .kpi-cell {
        width: 60px;
        padding: 4px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        border-radius: 2px;
      }

      .up {
        background-color: var(--bg-up-color, #dff0d8);
        color: #006400;
      }

      .down {
        background-color: var(--bg-down-color, #f2dede);
        color: #a94442;
      }
    </style>
    <div id="root"></div>
  `;

  class OrlenKPI extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this.properties = {};

      this._root.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("onClick", {
          detail: {
            title: this.properties.title,
            mainValue: this.properties.mainValue
          }
        }));
      });
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this.properties = { ...this.properties, ...changedProperties };
    }

    onCustomWidgetAfterUpdate() {
      this.render();
    }

    applyStyles() {
      const {
        fontColor = "#000000",
        fontFamily = "Arial",
        fontSize = "14px",
        barColor = "#006400",
        bgUpColor = "#dff0d8",
        bgDownColor = "#f2dede"
      } = this.properties;

      this._root.style.setProperty("--font-color", fontColor);
      this._root.style.setProperty("--font-family", fontFamily);
      this._root.style.setProperty("--font-size", fontSize);
      this._root.style.setProperty("--bar-color", barColor);
      this._root.style.setProperty("--bg-up-color", bgUpColor);
      this._root.style.setProperty("--bg-down-color", bgDownColor);
    }

    render() {
      this.applyStyles();

      const {
        title = "EBITDA LIFO",
        mainValue = "315,8",
        deltaB = "+198",
        deltaBPercent = "+168%",
        deltaRR = "-521",
        deltaRRPercent = "-254%"
      } = this.properties;

      this._root.innerHTML = `
        <div class="kpi-box">
          <div class="kpi-header">${title}</div>
          <div class="kpi-main">
            <div class="kpi-bar"></div>
            <div class="kpi-value">${mainValue}</div>
          </div>
          <div class="kpi-matrix">
            <div class="kpi-row">
              <div class="kpi-label up">▲<br>B</div>
              <div class="kpi-cell up">${deltaB}</div>
              <div class="kpi-cell up">${deltaBPercent}</div>
            </div>
            <div class="kpi-row">
              <div class="kpi-label down">▼<br>R/R</div>
              <div class="kpi-cell down">${deltaRR}</div>
              <div class="kpi-cell down">${deltaRRPercent}</div>
            </div>
          </div>
        </div>
      `;
    }

    getTitle() {
      return this.properties.title;
    }

    setTitle(value) {
      this.properties.title = value;
      this.render();
    }

    getMainValue() {
      return this.properties.mainValue;
    }

    setMainValue(value) {
      this.properties.mainValue = value;
      this.render();
    }

    getDeltaB() {
      return this.properties.deltaB;
    }

    setDeltaB(value) {
      this.properties.deltaB = value;
      this.render();
    }

    getDeltaRR() {
      return this.properties.deltaRR;
    }

    setDeltaRR(value) {
      this.properties.deltaRR = value;
      this.render();
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();

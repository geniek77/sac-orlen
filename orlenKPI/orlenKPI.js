(function () {
  const template = document.createElement("template");
  template.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
    }

    #root {
      width: 100%;
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      box-sizing: border-box;
      font-family: var(--font-family, Arial);
      color: var(--font-color, #000);
      font-size: var(--font-size, 14px);
    }

    .edit-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: gray;
  cursor: pointer;
  z-index: 10;
}

    .kpi-box {
  position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      cursor: pointer;
    }

    .kpi-header {
  font-size: var(--title-font-size, 16px);
  font-family: var(--title-font-family, Arial);

  margin-top: -4px;
  margin-bottom: 2px;

      font-weight: bold;
      font-size: 16px;
      margin-bottom: 4px;
      text-align: left;
    }

    .kpi-main {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-start;
      width: 100%;
    }

    .kpi-bar {
      width: var(--bar-width, 10px);
      height: var(--bar-height, 40px);
      background-color: var(--bar-color, #006400);
    }

    .kpi-value {
  font-size: var(--main-value-font-size, 28px);
  font-family: var(--main-value-font-family, Arial);

      font-size: 28px;
      font-weight: bold;
      text-align: left;
    }

    .kpi-matrix {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: var(--row-gap, 4px);
    }

    .kpi-row {
      display: flex;
      justify-content: center;
      gap: var(--row-gap, 4px);
    }

    .kpi-label {
      width: var(--label-width, 40px);
      text-align: center;
      font-size: 12px;
    }

    .kpi-cell {
  font-size: var(--delta-font-size, 14px);
  font-weight: var(--delta-font-weight, bold);
  font-family: var(--delta-font-family, Arial);

      width: var(--cell-width, 60px);
      padding: var(--cell-padding, 4px);
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      border-radius: 2px;
    }

    .up {
      background-color: var(--bg-up-color, #dff0d8);
      color: var(--text-color-b, #006400);
    }

    .down {
      background-color: var(--bg-down-color, #f2dede);
      color: var(--text-color-rr, #a94442);
    }
  </style>
  <div id="root"></div>`;

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

    onCustomWidgetResize(width, height) {
  const baseWidth = 300;
  const scale = Math.min(width / baseWidth, 2);

  const titleSize = (16 * scale).toFixed(1) + "px";
  const mainSize = (28 * scale).toFixed(1) + "px";
  const deltaSize = (14 * scale).toFixed(1) + "px";
  const barWidth = Math.max(4, Math.round(10 * scale)) + "px";
  const barHeight = Math.round(40 * scale) + "px";
  const cellPadding = Math.round(4 * scale) + "px";
  const rowGap = Math.round(4 * scale) + "px";
  const labelWidth = Math.round(40 * scale) + "px";
  const cellWidth = Math.round(60 * scale) + "px";

  this._root.style.setProperty("--title-font-size", titleSize);
  this._root.style.setProperty("--main-value-font-size", mainSize);
  this._root.style.setProperty("--delta-font-size", deltaSize);
  this._root.style.setProperty("--bar-width", barWidth);
  this._root.style.setProperty("--bar-height", barHeight);
  this._root.style.setProperty("--cell-padding", cellPadding);
  this._root.style.setProperty("--row-gap", rowGap);
  this._root.style.setProperty("--label-width", labelWidth);
  this._root.style.setProperty("--cell-width", cellWidth);
}

    applyStyles() {
      const {
        fontColor = "#000000",
        fontFamily = "Arial",
        fontSize = "14px",
        barColor = "#006400",
        bgUpColor = "#dff0d8",
        bgDownColor = "#f2dede",
        textColorB = "#006400",
        textColorRR = "#a94442"
      } = this.properties;

      this._root.style.setProperty("--font-color", fontColor);
      this._root.style.setProperty("--font-family", fontFamily);
      this._root.style.setProperty("--font-size", fontSize);
      this._root.style.setProperty("--bar-color", barColor);
      this._root.style.setProperty("--bg-up-color", bgUpColor);
      this._root.style.setProperty("--bg-down-color", bgDownColor);
      this._root.style.setProperty("--text-color-b", textColorB);
      this._root.style.setProperty("--text-color-rr", textColorRR);
    }

    render() {
      this.applyStyles();

      const {
        title = "EBITDA LIFO",
        mainValue = "315,8",
        deltaB = "+198",
        deltaBPercent = "+168%",
        deltaRR = "-521",
        deltaRRPercent = "-254%",
        labelB = "B",
        labelRR = "R/R",
        arrowColorB = "#006400",
        arrowColorRR = "#a94442",
        arrowDirectionB = "up",
        arrowDirectionRR = "down"
      } = this.properties;

      const arrowB = arrowDirectionB === "up" ? "▲" : arrowDirectionB === "down" ? "▼" : "";
      const arrowRR = arrowDirectionRR === "up" ? "▲" : arrowDirectionRR === "down" ? "▼" : "";

      this._root.innerHTML = `<div class="edit-icon" id="editIcon" title="Edytuj">✎</div>
        <div class="kpi-box">
          <div class="kpi-header">${title}</div>
          <div class="kpi-main">
            <div class="kpi-bar"></div>
            <div class="kpi-value">${mainValue}</div>
          </div>
          <div class="kpi-matrix">
            <div class="kpi-row">
              <div class="kpi-label up" style="color: ${arrowColorB}">${arrowB}<br>${labelB}</div>
              <div class="kpi-cell up">${deltaB}</div>
              <div class="kpi-cell up">${deltaBPercent}</div>
            </div>
            <div class="kpi-row">
              <div class="kpi-label down" style="color: ${arrowColorRR}">${arrowRR}<br>${labelRR}</div>
              <div class="kpi-cell down">${deltaRR}</div>
              <div class="kpi-cell down">${deltaRRPercent}</div>
            </div>
          </div>
        </div>`;

      const editIcon = this._root.querySelector("#editIcon");
      if (editIcon) {
        editIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent("onEdit", {
            detail: {
              title: this.properties.title || ""
            }
          }));
        });
      }
    }

    getTitle() { return this.properties.title; }
    setTitle(value) { this.properties.title = value; this.render(); }

    getMainValue() { return this.properties.mainValue; }
    setMainValue(value) { this.properties.mainValue = value; this.render(); }

    getDeltaB() { return this.properties.deltaB; }
    setDeltaB(value) { this.properties.deltaB = value; this.render(); }

    getDeltaRR() { return this.properties.deltaRR; }
    setDeltaRR(value) { this.properties.deltaRR = value; this.render(); }

    getLabelB() { return this.properties.labelB; }
    setLabelB(value) { this.properties.labelB = value; this.render(); }

    getLabelRR() { return this.properties.labelRR; }
    setLabelRR(value) { this.properties.labelRR = value; this.render(); }

    getTextColorB() { return this.properties.textColorB; }
    setTextColorB(value) { this.properties.textColorB = value; this.render(); }

    getTextColorRR() { return this.properties.textColorRR; }
    setTextColorRR(value) { this.properties.textColorRR = value; this.render(); }

    getArrowColorB() { return this.properties.arrowColorB; }
    setArrowColorB(value) { this.properties.arrowColorB = value; this.render(); }

    getArrowColorRR() { return this.properties.arrowColorRR; }
    setArrowColorRR(value) { this.properties.arrowColorRR = value; this.render(); }

    getArrowDirectionB() { return this.properties.arrowDirectionB; }
    setArrowDirectionB(value) { this.properties.arrowDirectionB = value; this.render(); }

    getArrowDirectionRR() { return this.properties.arrowDirectionRR; }
    setArrowDirectionRR(value) { this.properties.arrowDirectionRR = value; this.render(); }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();
